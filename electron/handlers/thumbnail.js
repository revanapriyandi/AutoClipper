/**
 * electron/handlers/thumbnail.js (Phase 4 — AI Thumbnail Generator)
 *
 * - thumbnail:generate — basic midpoint frame (existing behaviour)
 * - thumbnail:generateAI — scene detection + AI frame scoring + text overlay
 * - export:srt — export SRT subtitle file
 */

const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const keytar = require('keytar');
const { getDir } = require('../paths');

const SERVICE_NAME = 'AutoClipperApp';

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

// ── Basic thumbnail (midpoint frame) ─────────────────────────────────────────
ipcMain.handle('thumbnail:generate', async (_, { sourcePath, startMs, endMs, jobId }) => {
  try {
    if (!sourcePath) throw new Error('sourcePath is required');
    if (typeof startMs !== 'number' || typeof endMs !== 'number') {
      throw new Error('startMs and endMs must be numbers');
    }
    if (startMs >= endMs) throw new Error('startMs must be less than endMs');

    const midpointSec = ((startMs + endMs) / 2) / 1000;
    const clipsDir = await getDir('clips');
    const thumbName = `thumb_${jobId || Date.now()}.jpg`;
    const outputPath = path.join(clipsDir, thumbName);

    await new Promise((resolve, reject) => {
      ffmpeg(sourcePath)
        .seekInput(midpointSec)
        .frames(1)
        .outputOptions(['-vf', 'scale=360:-1', '-q:v', '2'])
        .save(outputPath)
        .on('end', resolve)
        .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)));
    });

    if (!fs.existsSync(outputPath)) throw new Error('Thumbnail file was not created');
    const buffer = fs.readFileSync(outputPath);
    const dataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return { success: true, outputPath, dataUrl };
  } catch (e) {
    console.error('[Thumbnail]', e.message);
    return { success: false, error: e.message };
  }
});

// ── AI Thumbnail Generator ─────────────────────────────────────────────────────

/**
 * Extract candidate frames using FFmpeg scene detection.
 * Returns an array of temp file paths.
 */
async function extractSceneFrames(sourcePath, startMs, endMs, maxFrames = 5) {
  const tmpDir = path.join(os.tmpdir(), `ac_thumb_${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  const startSec = startMs / 1000;
  const durationSec = (endMs - startMs) / 1000;

  await new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .seekInput(startSec)
      .duration(durationSec)
      .outputOptions([
        '-vf', `select='gt(scene\\,0.25)',scale=640:-1`,
        '-vsync', 'vfr',
        '-frames:v', String(maxFrames),
      ])
      .output(path.join(tmpDir, 'frame_%03d.jpg'))
      .on('end', resolve)
      .on('error', () => {
        // Fallback: extract frames at intervals if scene detection finds none
        resolve(null);
      })
      .run();
  });

  let frames = fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg')).map(f => path.join(tmpDir, f));

  // Fallback: extract 5 evenly-spaced frames if scene detection produced none
  if (frames.length === 0) {
    const interval = durationSec / (maxFrames + 1);
    for (let i = 1; i <= maxFrames; i++) {
      const frameOut = path.join(tmpDir, `frame_${String(i).padStart(3, '0')}.jpg`);
      await new Promise((resolve, reject) => {
        ffmpeg(sourcePath)
          .seekInput(startSec + interval * i)
          .frames(1)
          .outputOptions(['-vf', 'scale=640:-1', '-q:v', '3'])
          .save(frameOut)
          .on('end', resolve)
          .on('error', resolve); // Don't fail on individual frames
      });
    }
    frames = fs.readdirSync(tmpDir).filter(f => f.endsWith('.jpg')).map(f => path.join(tmpDir, f));
  }

  return { frames, tmpDir };
}

/**
 * Score frames using Gemini Vision API.
 * Returns the index of the best frame.
 */
async function scoreFamesWithGemini(frames, geminiKey) {
  const geminiModel = 'gemini-1.5-flash';

  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `You are a YouTube thumbnail expert. Look at these video frames and pick the ONE most engaging frame for a thumbnail. Consider: clear face expression, peak action moment, good composition. Return ONLY the index number (0-based) of the best frame. Nothing else.`,
        },
        ...frames.map(framePath => {
          const buf = fs.readFileSync(framePath);
          return {
            inlineData: {
              mimeType: 'image/jpeg',
              data: buf.toString('base64'),
            },
          };
        }),
      ],
    },
  ];

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  });

  if (!res.ok) throw new Error(`Gemini Vision error: ${res.status}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '0';
  const idx = parseInt(text, 10);
  return isNaN(idx) ? 0 : Math.min(idx, frames.length - 1);
}

/**
 * Overlay text on a frame using FFmpeg drawtext filter.
 */
async function overlayTextOnFrame(inputPath, outputPath, text) {
  const escapedText = text.replace(/[':]/g, '\\$&').slice(0, 60);

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf',
        `scale=1280:720,` +
        `drawtext=text='${escapedText}':` +
        `fontsize=52:fontcolor=white:` +
        `shadowcolor=black:shadowx=3:shadowy=3:` +
        `x=(w-text_w)/2:y=h-th-40:` +
        `fontfile=/Windows/Fonts/arialbd.ttf`,
        '-frames:v', '1',
        '-q:v', '2',
      ])
      .save(outputPath)
      .on('end', resolve)
      .on('error', (err) => reject(new Error(`FFmpeg drawtext error: ${err.message}`)));
  });
}

ipcMain.handle('thumbnail:generateAI', async (_, { sourcePath, startMs, endMs, clipId, caption }) => {
  const tmpDir = os.tmpdir();
  const framesTmpDir = path.join(tmpDir, `ac_ai_thumb_${Date.now()}`);
  fs.mkdirSync(framesTmpDir, { recursive: true });

  try {
    if (!sourcePath || typeof startMs !== 'number' || typeof endMs !== 'number') {
      throw new Error('sourcePath, startMs, endMs are required');
    }

    const clipsDir = await getDir('clips');

    // 1. Extract candidate frames
    const { frames, tmpDir: frameDir } = await extractSceneFrames(sourcePath, startMs, endMs);

    if (frames.length === 0) throw new Error('Could not extract frames for AI thumbnail');

    let bestFrameIdx = 0;

    // 2. Score frames with Gemini Vision (if key available)
    const geminiKey = await getSetting('gemini_api_key');
    if (geminiKey && frames.length > 1) {
      try {
        bestFrameIdx = await scoreFamesWithGemini(frames, geminiKey);
      } catch (scoringErr) {
        console.warn('[AI Thumbnail] Vision scoring failed, using first frame:', scoringErr.message);
      }
    }

    const bestFrame = frames[bestFrameIdx];
    const baseId = clipId || Date.now().toString();

    // 3. Variant A: Clean frame (no text)
    const variantAPath = path.join(clipsDir, `thumb_ai_clean_${baseId}.jpg`);
    fs.copyFileSync(bestFrame, variantAPath);

    // 4. Variant B: Frame with text overlay
    const variantBPath = path.join(clipsDir, `thumb_ai_text_${baseId}.jpg`);
    const overlayText = caption || 'Watch Full Video';
    try {
      await overlayTextOnFrame(bestFrame, variantBPath, overlayText);
    } catch {
      // If text overlay fails (e.g. font not found on system), just copy clean frame
      fs.copyFileSync(bestFrame, variantBPath);
    }

    // 5. Cleanup temp frames
    try { fs.rmSync(frameDir, { recursive: true, force: true }); } catch {}

    // 6. Read as data URLs
    const bufA = fs.readFileSync(variantAPath);
    const bufB = fs.readFileSync(variantBPath);

    return {
      success: true,
      variants: [
        { label: 'Clean', path: variantAPath, dataUrl: `data:image/jpeg;base64,${bufA.toString('base64')}` },
        { label: 'With Text', path: variantBPath, dataUrl: `data:image/jpeg;base64,${bufB.toString('base64')}` },
      ],
      framesScored: frames.length,
      bestFrameIdx,
    };
  } catch (e) {
    console.error('[AI Thumbnail]', e.message);
    // Cleanup
    try { fs.rmSync(framesTmpDir, { recursive: true, force: true }); } catch {}
    return { success: false, error: e.message };
  }
});

// ── Export SRT subtitle file ───────────────────────────────────────────────────
ipcMain.handle('export:srt', async (_, { segments, outputPath }) => {
  try {
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      throw new Error('segments must be a non-empty array');
    }
    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath is required');
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const fmt = (ms) => {
      if (typeof ms !== 'number') ms = 0;
      const d = new Date(Math.max(0, ms));
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      const ms3 = String(d.getUTCMilliseconds()).padStart(3, '0');
      return `${h}:${m}:${s},${ms3}`;
    };

    let srt = '';
    segments.forEach((seg, i) => {
      const text = (seg.text || '').trim();
      if (!text) return;
      srt += `${i + 1}\n${fmt(seg.startMs)} --> ${fmt(seg.endMs)}\n${text}\n\n`;
    });

    fs.writeFileSync(outputPath, srt, 'utf8');
    return { success: true, outputPath };
  } catch (e) {
    console.error('[SRT Export]', e.message);
    return { success: false, error: e.message };
  }
});
