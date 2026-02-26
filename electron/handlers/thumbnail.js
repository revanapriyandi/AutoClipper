/**
 * electron/handlers/thumbnail.js
 * Generate thumbnail from video clip using FFmpeg screenshot
 */
const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { getDir } = require('../paths');

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

    // Read as data URL for display
    if (!fs.existsSync(outputPath)) throw new Error('Thumbnail file was not created');
    const buffer = fs.readFileSync(outputPath);
    const dataUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    return { success: true, outputPath, dataUrl };
  } catch (e) {
    console.error('[Thumbnail]', e.message);
    return { success: false, error: e.message };
  }
});

// Export SRT subtitle file
ipcMain.handle('export:srt', async (_, { segments, outputPath }) => {
  try {
    if (!segments || !Array.isArray(segments) || segments.length === 0) {
      throw new Error('segments must be a non-empty array');
    }
    if (!outputPath || typeof outputPath !== 'string') {
      throw new Error('outputPath is required');
    }

    // Ensure output directory exists
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
      if (!text) return; // Skip empty segments
      srt += `${i + 1}\n${fmt(seg.startMs)} --> ${fmt(seg.endMs)}\n${text}\n\n`;
    });

    fs.writeFileSync(outputPath, srt, 'utf8');
    return { success: true, outputPath };
  } catch (e) {
    console.error('[SRT Export]', e.message);
    return { success: false, error: e.message };
  }
});
