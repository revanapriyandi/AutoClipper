/**
 * electron/handlers/render.js
 * FFmpeg rendering with real-time progress streaming via IPC
 */
const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');

function formatAssTime(seconds) {
  const date = new Date(0);
  date.setMilliseconds(seconds * 1000);
  const h  = String(date.getUTCHours());
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const ss = String(date.getUTCSeconds()).padStart(2, '0');
  const cs = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
  return `${h}:${mm}:${ss}.${cs}`;
}

// ──────────────────────────────────────────────────────────────
// Send progress to all renderer windows
// ──────────────────────────────────────────────────────────────
function broadcastProgress(jobId, percent) {
  const wins = BrowserWindow.getAllWindows();
  for (const win of wins) {
    if (!win.isDestroyed()) {
      win.webContents.send('render:progress', { jobId, percent: Math.round(percent) });
    }
  }
}

// ──────────────────────────────────────────────────────────────
// Send OS notification
// ──────────────────────────────────────────────────────────────
function sendNotification(title, body) {
  const wins = BrowserWindow.getAllWindows();
  for (const win of wins) {
    if (!win.isDestroyed()) {
      win.webContents.send('app:notification', { title, body });
    }
  }
}

async function runVideoRender(options, jobId = null) {
  const { sourcePath, outputPath, startMs, endMs, segments, isVerticalTarget, style, bgMusicPath } = options;
  const durationSec = (endMs - startMs) / 1000;
  const startSec    = startMs / 1000;

  const fontName     = style?.font         || 'Arial';
  const fontSize     = style?.fontSize     || 54;
  const primaryColor = style?.primaryColor || '&H0000FFFF';
  const outlineColor = style?.outlineColor || '&H00000000';
  const align        = style?.alignment    || 2;
  const marginV      = style?.marginV      || 150;

  const assPath = path.join(os.tmpdir(), `autoclipper_sub_${Date.now()}.ass`);
  let assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontName},${fontSize},${primaryColor},&H00FFFFFF,${outlineColor},&H80000000,-1,0,0,0,100,100,0,0,1,3,0,${align},10,10,${marginV},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  for (const seg of segments) {
    const relStart = Math.max(0, seg.start - startSec);
    const relEnd   = Math.max(0, seg.end   - startSec);
    if (relEnd <= 0) continue;
    let textLine = '';
    if (seg.words && seg.words.length > 0) {
      for (const w of seg.words) {
        const durCs = Math.round((w.end - w.start) * 100);
        textLine += `{\\k${durCs}}${w.text} `;
      }
    } else {
      textLine = seg.text;
    }
    assContent += `Dialogue: 0,${formatAssTime(relStart)},${formatAssTime(relEnd)},Default,,0,0,0,,${textLine.trim()}\n`;
  }
  fs.writeFileSync(assPath, assContent, 'utf8');

  // ── Format-aware crop & scale ──────────────────────────────
  const FORMAT_FILTERS = {
    '9:16':  ['crop=ih*9/16:ih',  'scale=1080:1920'],
    '16:9':  ['crop=iw:iw*9/16', 'scale=1920:1080'],
    '1:1':   ['crop=ih:ih',       'scale=1080:1080'],
    '4:5':   ['crop=ih*4/5:ih',  'scale=1080:1350'],
  };
  const formatFilters = FORMAT_FILTERS[options.format || '9:16'] || FORMAT_FILTERS['9:16'];

  await new Promise((resolve, reject) => {
    const command = ffmpeg(sourcePath).setStartTime(startSec).setDuration(durationSec);
    const videoFilters = [...formatFilters];
    const escapedAssPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    videoFilters.push(`subtitles='${escapedAssPath}'`);
    command.videoFilters(videoFilters);

    if (bgMusicPath && fs.existsSync(bgMusicPath)) {
      command
        .input(bgMusicPath)
        .complexFilter([`[0:a][1:a]amix=inputs=2:duration=first:weights=1 0.1[aout]`])
        .outputOptions(['-c:v libx264', '-preset fast', '-crf 23', '-map 0:v', '-map [aout]', '-c:a aac', '-b:a 128k']);
    } else {
      command.outputOptions(['-c:v libx264', '-preset fast', '-crf 23', '-c:a aac', '-b:a 128k']);
    }

    command
      .on('progress', (progress) => {
        // progress.percent is relative to input duration, can be > 100 sometimes
        const pct = Math.min(99, progress.percent || 0);
        if (jobId) broadcastProgress(jobId, pct);
      })
      .save(outputPath)
      .on('end', () => {
        if (jobId) {
          broadcastProgress(jobId, 100);
          sendNotification('✅ Render Complete', `Clip saved to ${path.basename(outputPath)}`);
        }
        resolve(outputPath);
      })
      .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)));
  });

  if (fs.existsSync(assPath)) fs.unlinkSync(assPath);
  return outputPath;
}

ipcMain.handle('render:clip', async (_, options) => {
  try {
    const jobId = options.jobId || `render_${Date.now()}`;
    broadcastProgress(jobId, 0);
    const outputPath = await runVideoRender(options, jobId);
    return { success: true, outputPath, jobId };
  } catch (e) {
    console.error('[Render]', e.message);
    return { success: false, error: e.message };
  }
});

module.exports = { runVideoRender, broadcastProgress, sendNotification };
