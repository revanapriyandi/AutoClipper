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
        '-vf', `select='eq(pict_type\\,I)'`,
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
  const geminiModel = 'gemini-2.0-flash';

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
async function overlayTextOnFrame(inputPath, outputPath, text, options = {}) {
  const escapedText = text.replace(/[':]/g, '\\$&').slice(0, 60);
  const color = options.fontColor || 'white';
  const outline = options.outlineColor || 'black';
  
  // Note: For native Windows compatibility when passing custom fonts, we assume Arial fallback if not absolute path
  let fontPath = '/Windows/Fonts/arialbd.ttf';
  if (options.fontFamily && fs.existsSync(options.fontFamily)) {
     fontPath = options.fontFamily.replace(/\\/g, '/'); // FFmpeg needs forward slashes even on Windows
  }

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-vf',
        `scale=1280:720,` +
        `drawtext=text='${escapedText}':` +
        `fontsize=52:fontcolor=${color}:` +
        `shadowcolor=${outline}:shadowx=3:shadowy=3:` +
        `x=(w-text_w)/2:y=h-th-40:` +
        `fontfile='${fontPath}'`,
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
    const { frames, tmpDir: frameDir } = await extractSceneFrames(sourcePath, startMs, endMs, 3);
    if (!frames || frames.length === 0) throw new Error('Could not extract frames for thumbnail');

    // 2. Prepare variants to send to the frontend
    const maxVars = Math.min(3, frames.length);
    const variants = [];
    
    // Fetch user's active brand settings if passing an ID or use fallback
    let userFontPath = null;
    let userColor = 'white';
    
    // In a real app we'd fetch this from Prisma using a passed WorkspaceID,
    // but without one in the current IPC payload, we'll try pulling the first valid Kit
    try {
       const prisma = require('../prisma');
       const kit = await prisma.brandKit.findFirst();
       if (kit) {
          userColor = kit.primaryColor || 'white';
          if (kit.fontFamily && fs.existsSync(kit.fontFamily)) userFontPath = kit.fontFamily;
       }
    } catch (e) { console.warn('[Thumbnail] Could not fetch brand kit:', e.message); }

    // Try AI scoring with Gemini Vision if key available
    const geminiKey = await getSetting('gemini_api_key');
    let bestFrameIdx = 0;
    if (geminiKey && frames.length > 1) {
      try {
        bestFrameIdx = await scoreFamesWithGemini(frames, geminiKey);
        console.log(`[Thumbnail] Gemini selected frame ${bestFrameIdx}`);
      } catch (e) {
        console.warn('[Thumbnail] Gemini Vision scoring failed, using first frame:', e.message);
      }
    } else if (!geminiKey) {
      console.log('[Thumbnail] No Gemini key, skipping AI frame scoring');
    }
    
    for (let i = 0; i < maxVars; i++) {
        const frameSrc = frames[i];
        
        // Variant A (Clean)
        const cleanPath = path.join(clipsDir, `thumb_clean_${Date.now()}_v${i}.jpg`);
        fs.copyFileSync(frameSrc, cleanPath);
        
        // Variant B (With Text)
        const textPath = path.join(clipsDir, `thumb_text_${Date.now()}_v${i}.jpg`);
        const overlayText = caption || 'Watch Now';
        try {
            await overlayTextOnFrame(frameSrc, textPath, overlayText, {
               fontColor: userColor,
               fontFamily: userFontPath,
               outlineColor: 'black'
            });
            const cleanBuf = fs.readFileSync(cleanPath);
            const textBuf = fs.readFileSync(textPath);
            
            variants.push({
                cleanDataUrl: `data:image/jpeg;base64,${cleanBuf.toString('base64')}`,
                textDataUrl: `data:image/jpeg;base64,${textBuf.toString('base64')}`,
            });
        } catch (e) {
            console.warn("Text overlay failed for frame", i, e.message);
            const cleanBuf = fs.readFileSync(cleanPath);
            variants.push({
                cleanDataUrl: `data:image/jpeg;base64,${cleanBuf.toString('base64')}`,
                textDataUrl: "", // Failed text composite
            });
        }
    }

    // 3. Cleanup temp frames
    try { fs.rmSync(frameDir, { recursive: true, force: true }); } catch {}

    return {
      success: true,
      variants
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
