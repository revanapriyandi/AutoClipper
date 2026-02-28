/**
 * electron/handlers/facetrack.js
 *
 * Smart face/subject tracking for crop positioning.
 * 
 * Strategy (no heavy ML dependency):
 * 1. User toggle — if disabled, falls back to center crop
 * 2. Extract a sample frame from the video via FFmpeg
 * 3. If OpenAI Vision API key available: send frame to GPT-4o Vision
 *    → returns face position as {x, y, w, h} relative to frame size
 * 4. If no Vision API: use FFmpeg's `signalstats` + edge variance analysis
 *    to estimate the "busiest" region → likely where the face/subject is
 * 5. Result: x_offset for the crop filter (used by render.js)
 */
const { ipcMain } = require('electron');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const ffmpeg  = require('fluent-ffmpeg');
const keytar  = require('keytar');
const config  = require('../config');

const SERVICE_NAME = 'AutoClipperApp';

// ── Toggle ────────────────────────────────────────────────────────

ipcMain.handle('facetrack:setEnabled', async (_, enabled) => {
  await keytar.setPassword(SERVICE_NAME, 'facetrack_enabled', String(enabled));
  return { success: true, enabled };
});

ipcMain.handle('facetrack:getEnabled', async () => {
  const val = await keytar.getPassword(SERVICE_NAME, 'facetrack_enabled');
  return { success: true, enabled: val !== 'false' }; // Default ON
});

// ── Extract a frame at `atSeconds` offset ────────────────────────
function extractFrame(videoPath, atSeconds = 1) {
  const outPath = path.join(os.tmpdir(), `facetrack_frame_${Date.now()}.jpg`);
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .seekInput(atSeconds)
      .frames(1)
      .outputOptions(['-f image2', '-q:v 4'])
      .save(outPath)
      .on('end',   () => resolve(outPath))
      .on('error', reject);
  });
}

// ── OpenAI Vision: ask where the face/subject is ─────────────────
async function detectFaceViaVision(framePath, videoWidth, videoHeight) {
  const key = await keytar.getPassword(SERVICE_NAME, 'openai_key');
  if (!key) throw new Error('no-key');

  const imageBase64 = fs.readFileSync(framePath).toString('base64');
  const res = await fetch(config.OPENAI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 128,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is a video frame (${videoWidth}x${videoHeight}px). 
Locate the primary human face or subject. 
Return ONLY JSON: {"cx": <center_x_pixels>, "cy": <center_y_pixels>, "found": true/false}
If no face found: {"cx": ${Math.round(videoWidth / 2)}, "cy": ${Math.round(videoHeight / 2)}, "found": false}`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'low' },
          },
        ],
      }],
    }),
  });

  if (!res.ok) throw new Error(`Vision API ${res.status}`);
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ── OpenAI Vision: ask for MULTIPLE faces ────────────────────────────
async function detectMultipleFacesViaVision(framePath, videoWidth, videoHeight, count = 2) {
  const key = await keytar.getPassword(SERVICE_NAME, 'openai_key');
  if (!key) throw new Error('no-key');

  const imageBase64 = fs.readFileSync(framePath).toString('base64');
  const res = await fetch(config.OPENAI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      max_tokens: 128,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'text',
            text: `This is a video frame (${videoWidth}x${videoHeight}px). 
Locate the ${count} primary human faces or subjects. 
Return ONLY a JSON array containing ${count} objects: [{"cx": <center_x_pixels>, "cy": <center_y_pixels>}, ...]
Order the array from left to right (smallest cx first).
If fewer than ${count} faces are found, duplicate the best one or estimate distinct regions.`,
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/jpeg;base64,${imageBase64}`, detail: 'low' },
          },
        ],
      }],
    }),
  });

  if (!res.ok) throw new Error(`Vision API ${res.status}`);
  const data = await res.json();
  const faces = JSON.parse(data.choices[0].message.content);
  return faces;
}

// ── FFmpeg saliency fallback: divide frame into columns, ──────────
// find the column with highest PSNR (most detail = likely face)
function detectFaceViaFFmpeg(videoPath, videoWidth, videoHeight, atSeconds = 1) {
  return new Promise((resolve) => {
    // Use FFmpeg signalstats to get per-region brightness info
    // We analyze 3 vertical columns: left / center / right
    // The column with highest average brightness variance → likely subject
    const cols = [
      { name: 'left',   crop: `crop=iw/3:ih:0:0` },
      { name: 'center', crop: `crop=iw/3:ih:iw/3:0` },
      { name: 'right',  crop: `crop=iw/3:ih:2*iw/3:0` },
    ];

    const variances = { left: 0, center: 0, right: 0 };
    let done = 0;

    for (const col of cols) {
      let output = '';
      ffmpeg(videoPath)
        .seekInput(atSeconds)
        .duration(0.1)
        .videoFilters([col.crop, 'signalstats'])
        .outputOptions(['-f null'])
        .save('-')
        .on('stderr', line => { output += line; })
        .on('end', () => {
          // Parse YAVG (luminance average) from signalstats output
          const match = output.match(/YAVG:\s*([\d.]+)/);
          variances[col.name] = match ? parseFloat(match[1]) : 0;
          done++;
          if (done === 3) {
            // Pick column with highest average (most lit = likely face)
            const best = Object.entries(variances).sort((a, b) => b[1] - a[1])[0][0];
            const cx = best === 'left'   ? Math.round(videoWidth * 0.17) :
                       best === 'center' ? Math.round(videoWidth * 0.5)  :
                                           Math.round(videoWidth * 0.83);
            resolve({ cx, cy: Math.round(videoHeight / 2), method: 'ffmpeg-signalstats', best });
          }
        })
        .on('error', () => {
          done++;
          if (done === 3) resolve({ cx: Math.round(videoWidth / 2), cy: Math.round(videoHeight / 2), method: 'fallback' });
        });
    }
  });
}

function detectMultipleFacesViaFFmpeg(videoPath, videoWidth, videoHeight, count = 2, atSeconds = 1) {
  return new Promise((resolve) => {
    const cols = [
      { name: 'left',   crop: `crop=iw/3:ih:0:0` },
      { name: 'center', crop: `crop=iw/3:ih:iw/3:0` },
      { name: 'right',  crop: `crop=iw/3:ih:2*iw/3:0` },
    ];
    const variances = { left: 0, center: 0, right: 0 };
    let done = 0;

    for (const col of cols) {
      let output = '';
      ffmpeg(videoPath).seekInput(atSeconds).duration(0.1)
        .videoFilters([col.crop, 'signalstats']).outputOptions(['-f null']).save('-')
        .on('stderr', line => { output += line; })
        .on('end', () => {
          const match = output.match(/YAVG:\s*([\d.]+)/);
          variances[col.name] = match ? parseFloat(match[1]) : 0;
          done++;
          if (done === 3) {
            const sorted = Object.entries(variances).sort((a, b) => b[1] - a[1]);
            const bestCols = sorted.slice(0, count).map(x => x[0]);
            // Ensure they are ordered left-to-right
            const colOrder = { left: 1, center: 2, right: 3 };
            bestCols.sort((a, b) => colOrder[a] - colOrder[b]);

            const faces = bestCols.map(best => {
              const cx = best === 'left'   ? Math.round(videoWidth * 0.17) :
                         best === 'center' ? Math.round(videoWidth * 0.5)  :
                                             Math.round(videoWidth * 0.83);
              return { cx, cy: Math.round(videoHeight / 2), method: 'ffmpeg-signalstats', best };
            });
            
            // Duplicate if fewer than count
            while (faces.length < count) faces.push({ ...faces[0] });
            resolve(faces);
          }
        })
        .on('error', () => {
           done++;
           if (done === 3) {
             const fallback = Array(count).fill({ cx: Math.round(videoWidth / 2), cy: Math.round(videoHeight / 2), method: 'fallback' });
             resolve(fallback);
           }
        });
    }
  });
}

/**
 * Main export: get crop x_offset for the given video.
 * Returns the x_offset to pass to FFmpeg crop filter.
 * Falls back to center (videoWidth/2) on any error.
 *
 * Usage in render.js:
 *   const xOff = await getCropOffset(sourcePath, videoWidth, videoHeight);
 *   videoFilters.push(`crop=ih*9/16:ih:${xOff}:0`);
 */
async function getCropOffset(videoPath, videoWidth = 1920, videoHeight = 1080) {
  // Check user toggle
  const enabledVal = await keytar.getPassword(SERVICE_NAME, 'facetrack_enabled');
  const enabled = enabledVal !== 'false';
  if (!enabled) return Math.round((videoWidth - videoHeight * 9 / 16) / 2); // center

  let framePath = null;
  try {
    framePath = await extractFrame(videoPath, 2);
    let result;

    // Try Vision API first
    try {
      result = await detectFaceViaVision(framePath, videoWidth, videoHeight);
    } catch {
      // Fall back to FFmpeg analysis
      result = await detectFaceViaFFmpeg(videoPath, videoWidth, videoHeight);
    }

    if (framePath && fs.existsSync(framePath)) fs.unlinkSync(framePath);

    // Convert face center X to crop x_offset
    const cropW  = Math.round(videoHeight * 9 / 16);
    const xOff   = Math.max(0, Math.min(videoWidth - cropW, Math.round(result.cx - cropW / 2)));
    console.log(`[FaceTrack] cx=${result.cx} → x_offset=${xOff} (method: ${result.method || 'vision'})`);
    return xOff;

  } catch (err) {
    console.warn('[FaceTrack] Detection failed, using center crop:', err.message);
    if (framePath && fs.existsSync(framePath)) try { fs.unlinkSync(framePath); } catch {}
    return Math.round((videoWidth - videoHeight * 9 / 16) / 2);
  }
}

// IPC for direct query (for preview purposes)
ipcMain.handle('facetrack:detect', async (_, { videoPath, width, height }) => {
  try {
    const xOffset = await getCropOffset(videoPath, width, height);
    return { success: true, xOffset };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

/**
 * Get multiple crop x_offsets for multi-speaker split-screen
 */
async function getMultiCropOffsets(videoPath, videoWidth = 1920, videoHeight = 1080, count = 2) {
  const enabledVal = await keytar.getPassword(SERVICE_NAME, 'facetrack_enabled');
  if (enabledVal === 'false') {
    // Return evenly spaced centers if disabled
    return Array(count).fill(Math.round((videoWidth - videoHeight * 9 / 16) / 2));
  }

  let framePath = null;
  try {
    framePath = await extractFrame(videoPath, 2);
    let faces;
    try {
      faces = await detectMultipleFacesViaVision(framePath, videoWidth, videoHeight, count);
    } catch {
      faces = await detectMultipleFacesViaFFmpeg(videoPath, videoWidth, videoHeight, count);
    }
    if (framePath && fs.existsSync(framePath)) fs.unlinkSync(framePath);

    const cropW = Math.round(videoHeight * 9 / 16);
    return faces.map(f => Math.max(0, Math.min(videoWidth - cropW, Math.round(f.cx - cropW / 2))));
  } catch (err) {
    console.warn('[FaceTrack] Multi-detection failed:', err.message);
    if (framePath && fs.existsSync(framePath)) try { fs.unlinkSync(framePath); } catch {}
    return Array(count).fill(Math.round((videoWidth - videoHeight * 9 / 16) / 2));
  }
}

module.exports = { getCropOffset, getMultiCropOffsets };
