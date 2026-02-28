/**
 * electron/handlers/render.js
 * FFmpeg rendering with real-time progress streaming via IPC
 */
const { ipcMain, BrowserWindow, app } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const { getDir } = require('../paths');
const { getBestH264Encoder } = require('./ffmpeg');

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
// Send OS notification
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
  const { sourcePath, outputPath, startMs, endMs, segments, isVerticalTarget, style, bgMusicPath, colorFilterString, brandKit, hookText } = options;
  const durationSec = (endMs - startMs) / 1000;
  const startSec    = startMs / 1000;

  const fontName     = brandKit?.fontFamily   || style?.font         || 'Arial';
  const fontSize     = style?.fontSize        || 54;
  const primaryColor = brandKit?.primaryColor || style?.primaryColor || '&H0000FFFF';
  const outlineColor = style?.outlineColor    || '&H00000000';
  const align        = style?.alignment       || 2;
  const marginV      = style?.marginV         || 150;

  const assPath = path.join(os.tmpdir(), `autoclipper_sub_${Date.now()}.ass`);
  let assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${fontName},${fontSize},${primaryColor},&H00FFFFFF,${outlineColor},&H80000000,-1,0,0,0,100,100,0,0,1,3,0,${align},10,10,${marginV},1
${hookText ? `Style: Hook,${fontName},80,&H0000FFFF,&H00FFFFFF,&H80000000,-1,0,0,0,100,100,0,0,1,4,0,8,10,10,80,1` : ''}

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${hookText ? `Dialogue: 1,0:00:00.00,0:00:03.00,Hook,,0,0,0,,${hookText}\n` : ''}`;

  for (const seg of segments) {
    const relStart = Math.max(0, seg.start - startSec);
    const relEnd   = Math.max(0, seg.end   - startSec);
    if (relEnd <= 0) continue;

    if (seg.words && seg.words.length > 0) {
      for (let i = 0; i < seg.words.length; i++) {
        const w = seg.words[i];
        const wStart = Math.max(0, w.start - startSec);
        const wEnd = Math.max(0, w.end - startSec);
        const durMs = Math.round((w.end - w.start) * 1000);

        let textLine = '';
        for (let j = 0; j < seg.words.length; j++) {
           if (j === i) {
              textLine += `{\\c&H00FFFF&\\fscx120\\fscy120\\t(0,${durMs/2},\\fscx100\\fscy100)}${seg.words[j].text} `;
           } else if (j < i) {
              textLine += `{\\c${primaryColor}\\fscx100\\fscy100}${seg.words[j].text} `;
           } else {
              textLine += `{\\c&HFFFFFF&\\fscx100\\fscy100}${seg.words[j].text} `;
           }
        }
        assContent += `Dialogue: 0,${formatAssTime(wStart)},${formatAssTime(wEnd)},Default,,0,0,0,,${textLine.trim()}\n`;
      }
    } else {
      const popAnim = `{\\fscx80\\fscy80\\t(0,150,\\fscx110\\fscy110)\\t(150,300,\\fscx100\\fscy100)}`;
      assContent += `Dialogue: 0,${formatAssTime(relStart)},${formatAssTime(relEnd)},Default,,0,0,0,,${popAnim}${seg.text.trim()}\n`;
    }
  }
  fs.writeFileSync(assPath, assContent, 'utf8');

  const stickers = options.stickers || [];
  const tempFilesToClean = [assPath];

  for (let i = 0; i < stickers.length; i++) {
     const st = stickers[i];
     if (st && st.src && st.src.startsWith('data:image')) {
        const b64Data = st.src.replace(/^data:image\/\w+;base64,/, "");
        const tmpPath = path.join(os.tmpdir(), `autoclipper_sticker_${Date.now()}_${i}.png`);
        fs.writeFileSync(tmpPath, Buffer.from(b64Data, 'base64'));
        st.localPath = tmpPath;
        tempFilesToClean.push(tmpPath);
     }
  }

  // ── Format-aware crop & scale ──────────────────────────────
  const FORMAT_FILTERS = {
    '9:16':  ['crop=ih*9/16:ih',  'scale=1080:1920'],
    '16:9':  ['crop=iw:iw*9/16', 'scale=1920:1080'],
    '1:1':   ['crop=ih:ih',       'scale=1080:1080'],
    '4:5':   ['crop=ih*4/5:ih',  'scale=1080:1350'],
  };
  let formatFilters = FORMAT_FILTERS[options.format || '9:16'] || FORMAT_FILTERS['9:16'];

  // Apply Smart Face Tracking for Vertical Formats
  // ── Determine Speaker Count ──────────────────────────────────
  let maxSpeaker = 0;
  for (const seg of segments) {
    if (seg.words) {
      for (const w of seg.words) {
        if ((w.speaker || 0) > maxSpeaker) maxSpeaker = w.speaker;
      }
    }
  }
  const isSplitScreen = maxSpeaker > 0 && (options.format === '9:16' || !options.format);

  // ── Unified Complex Filter Graph ──────────────────────────────
  let filterChain = [];
  let vOut = '0:v';

  // Apply Smart Face Tracking or Split Screen for Vertical Formats
  if ((options.format === '9:16' || !options.format) || options.format === '4:5') {
    let vw = 1920, vh = 1080;
    try {
      const meta = await new Promise((res, rej) => ffmpeg.ffprobe(sourcePath, (err, d) => err ? rej(err) : res(d)));
      const v = meta.streams.find(s => s.codec_type === 'video');
      if (v && v.width) { vw = v.width; vh = v.height; }
    } catch (e) { console.warn('[FFprobe] Failed to get exact dimensions, using 1080p assumption'); }
    
    if (isSplitScreen && options.format === '9:16') {
      const { getMultiCropOffsets } = require('./facetrack');
      const counts = Math.min(maxSpeaker + 1, 3); // Max 3 stacked for sanity
      const xOffs = await getMultiCropOffsets(sourcePath, vw, vh, counts);
      
      const tgtH = Math.round(1920 / counts);
      const cropW = Math.round(vh * 9 / (16 / counts)); 
      
      filterChain.push(`[0:v]split=${counts}` + xOffs.map((_, i) => `[v${i}]`).join(''));
      
      for (let i = 0; i < counts; i++) {
         const faceCenterX = xOffs[i] + Math.round(vh * 9 / 16 / 2);
         const adjX = Math.max(0, Math.min(vw - cropW, Math.round(faceCenterX - cropW / 2)));
         filterChain.push(`[v${i}]crop=${cropW}:${vh}:${adjX}:0,scale=1080:${tgtH}[c${i}]`);
      }
      filterChain.push(xOffs.map((_, i) => `[c${i}]`).join('') + `vstack=inputs=${counts}[vstack]`);
      vOut = '[vstack]';
      
    } else {
      const { getCropOffset } = require('./facetrack');
      const xOff = await getCropOffset(sourcePath, vw, vh);

      if (options.format === '4:5') {
         const faceCenterX = xOff + Math.round(vh * 9 / 16 / 2);
         const cropW = Math.round(vh * 4 / 5);
         const adjX = Math.max(0, Math.min(vw - cropW, Math.round(faceCenterX - cropW / 2)));
         filterChain.push(`[0:v]crop=${cropW}:${vh}:${adjX}:0,scale=1080:1350[vfmt]`);
      } else {
         filterChain.push(`[0:v]crop=ih*9/16:ih:${xOff}:0,scale=1080:1920[vfmt]`);
      }
      vOut = '[vfmt]';
    }
  } else {
    filterChain.push(`[0:v]${formatFilters.join(',')}[vfmt]`);
    vOut = '[vfmt]';
  }

  // Keyframe Animations (Zoom/Pan)
  const keyframes = options.keyframes || [];
  if (keyframes.length > 0) {
    // We apply a single zoompan filter that evaluates dynamically based on 't'
    const fps = 30; // FFmpeg default assumed if not passed
    let zExprs = [];
    let xExprs = [];
    let yExprs = [];

    for (const kf of keyframes) {
      const zS = kf.zoomBase; const zE = kf.zoomTarget;
      const startSec = kf.startMs / 1000;
      const endSec = kf.endMs / 1000;
      const duration = endSec - startSec;
      
      // zoompan uses 'in' and 'on' but we can base it on time 'time'
      // If time falls in range, compute lerp. Else do nothing.
      // E.g. z='if(between(time,1,3), 1 + (time-1)*(2-1)/(3-1), zoom)'
      const zEq = `if(between(time,${startSec},${endSec}),${zS}+(time-${startSec})*(${zE}-${zS})/${duration},`;
      zExprs.push(zEq);
    }
    
    // Fallback if not matching any keyframe (just keep 1)
    let finalZ = '1' + ')'.repeat(keyframes.length);
    for (const eq of zExprs.reverse()) finalZ = eq + finalZ;

    // We can do simple centering for Pan for now (ih/2 - ih/zoom/2)
    const px = '(iw-iw/zoom)/2';
    const py = '(ih-ih/zoom)/2';

    filterChain.push(`${vOut}zoompan=z='${finalZ}':x='${px}':y='${py}':d=${durationSec*fps}:s=1080x1920:fps=${fps}[vzoom]`);
    vOut = '[vzoom]';
  } else if ((options.format === '9:16' || !options.format) && options.autoZoom !== false) {
    // Dynamic Auto-Zoom (CapCut style subtle zoom)
    // If no specific keyframes, apply a very subtle slow zoom to keep the viewer engaged
    const fps = 30;
    // Zoom from 1.0 to 1.05 over the entire clip duration
    const finalZ = `min(zoom+0.0015,1.1)`;
    const px = '(iw-iw/zoom)/2';
    const py = '(ih-ih/zoom)/2';

    filterChain.push(`${vOut}zoompan=z='${finalZ}':x='${px}':y='${py}':d=${durationSec*fps}:s=1080x1920:fps=${fps}[vzoom]`);
    vOut = '[vzoom]';
  }

  let inputCount = 1; // 1-based since 0 is source video

  // B-Roll Overlays
  const brolls = options.brollLayers || [];
  for (let i = 0; i < brolls.length; i++) {
    const idx = inputCount++;
    const broll = brolls[i];
    const bStart = broll.startMs / 1000;
    const bEnd = broll.endMs / 1000;
    
    const targetW = options.format === '16:9' ? 1920 : 1080;
    const targetH = options.format === '16:9' ? 1080 : 
                    options.format === '1:1' ? 1080 : 
                    options.format === '4:5' ? 1350 : 1920;

    filterChain.push(`[${idx}:v]scale=${targetW}:${targetH}:force_original_aspect_ratio=increase,crop=${targetW}:${targetH},setpts=PTS-STARTPTS+${bStart}/TB[broll${idx}]`);
    filterChain.push(`${vOut}[broll${idx}]overlay=enable='between(t,${bStart},${bEnd})'[voverlay${idx}]`);
    vOut = `[voverlay${idx}]`;
  }

  // AI Image / Stickers Overlays
  for (let i = 0; i < stickers.length; i++) {
    const stk = stickers[i];
    if (!stk.localPath) continue;

    const targetW = options.format === '16:9' ? 1920 : 1080;
    const targetH = options.format === '16:9' ? 1080 : 
                    options.format === '1:1' ? 1080 : 
                    options.format === '4:5' ? 1350 : 1920;

    const idx = inputCount++;
    const sStart = stk.startMs / 1000;
    const sEnd = stk.endMs / 1000;

    // Scale defaults to 30% of target width
    const scaleFactor = stk.scale || 1;
    let wScaled = `(${targetW}*0.3*${scaleFactor})`;
    
    // Position x, y are percentages. Center the image over x, y.
    const px = `(${targetW}*${stk.x}/100 - (${wScaled})/2)`;
    const py = `(${targetH}*${stk.y}/100 - (ih*(${wScaled})/iw)/2)`;

    filterChain.push(`[${idx}:v]scale=${wScaled}:-1[stk_s_${idx}]`);
    filterChain.push(`${vOut}[stk_s_${idx}]overlay=x='${px}':y='${py}':enable='between(t,${sStart},${sEnd})'[vstk${idx}]`);
    vOut = `[vstk${idx}]`;
  }

  // Color Filter
  if (colorFilterString) {
    filterChain.push(`${vOut}${colorFilterString}[vcolor]`);
    vOut = '[vcolor]';
  }

  // Subtitles
  const escapedAssPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
  filterChain.push(`${vOut}subtitles='${escapedAssPath}'[vsub]`);
  vOut = '[vsub]';

  // Brand Kit Watermark
  if (brandKit?.watermarkPath && fs.existsSync(brandKit.watermarkPath)) {
    const wmPath = brandKit.watermarkPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    // Using movie filter allows us to inject inputs without adding to the primary strict command.input arrays sometimes,
    // but better is to use standard inputs. We will try movie filter here for simplicity.
    filterChain.push(`movie='${wmPath}',scale=150:-1[wm]`);
    filterChain.push(`${vOut}[wm]overlay=W-w-30:30[vwm]`);
    vOut = '[vwm]';
  }

  const vcodec = await getBestH264Encoder();
  let videoOutputOptions = [`-c:v ${vcodec}`, '-preset fast', '-crf 23'];
  
  if (options.quality === 'high') videoOutputOptions = [`-c:v ${vcodec}`, '-preset slow', '-crf 18'];
  if (options.quality === 'fast') videoOutputOptions = [`-c:v ${vcodec}`, '-preset ultrafast', '-crf 28'];

  if (vcodec === 'h264_nvenc') {
     videoOutputOptions = [`-c:v ${vcodec}`, '-preset p4', '-cq 23', '-b:v 0'];
     if (options.quality === 'high') videoOutputOptions = [`-c:v ${vcodec}`, '-preset p7', '-cq 18', '-b:v 0'];
     if (options.quality === 'fast') videoOutputOptions = [`-c:v ${vcodec}`, '-preset p1', '-cq 28', '-b:v 0'];
  }

  try {
    await new Promise((resolve, reject) => {
      const command = ffmpeg(sourcePath).setStartTime(startSec).setDuration(durationSec);
      
      for (const broll of brolls) {
        command.input(broll.path);
      }
      
      for (const stk of stickers) {
        if (stk.localPath) command.input(stk.localPath);
      }

      let aOut = '[0:a]';

      // 1. Audio Enhancement or Muting
      if (options.muteOriginal) {
        filterChain.push(`${aOut}volume=0[Amute]`);
        aOut = '[Amute]';
      } else {
        const vidVol = options.videoVolume ?? 1.0;
        if (vidVol !== 1.0) {
          filterChain.push(`${aOut}volume=${vidVol}[Avol]`);
          aOut = '[Avol]';
        }
        if (options.enhanceAudio) {
          filterChain.push(`${aOut}afftdn=nf=-25,dynaudnorm=f=75:g=15[Aenh]`);
          aOut = '[Aenh]';
        }
      }

      // 2. Background Music with Auto-Ducking
      if (bgMusicPath && fs.existsSync(bgMusicPath)) {
        const bgCmd = command.input(bgMusicPath);
        if (options.bgMusicOptions?.trimStartSec > 0) bgCmd.seekInput(options.bgMusicOptions.trimStartSec);
        bgCmd.inputOptions(['-stream_loop', '-1']);
        
        const bgIdx = inputCount++;
        
        let bgVol = options.bgMusicOptions?.volume ?? 0.1;
        filterChain.push(`[${bgIdx}:a]volume=${bgVol}[bgvol]`);
        let bgOut = '[bgvol]';
        
        if (options.bgMusicOptions?.fadeIn) {
           filterChain.push(`${bgOut}afade=t=in:st=0:d=2[bgfadein]`);
           bgOut = '[bgfadein]';
        }
        if (options.bgMusicOptions?.fadeOut) {
           const fadeOutSt = Math.max(0, durationSec - 2);
           filterChain.push(`${bgOut}afade=t=out:st=${fadeOutSt}:d=2[bgfadeout]`);
           bgOut = '[bgfadeout]';
        }
        
        if (options.audioDucking) {
          filterChain.push(`${aOut}asplit=2[sc_main][sc_ref]`);
          filterChain.push(`${bgOut}[sc_ref]sidechaincompress=threshold=0.08:ratio=4:attack=5:release=100[Aduck]`);
          filterChain.push(`[sc_main][Aduck]amix=inputs=2:duration=first:weights=1 1[Abg]`);
        } else {
          filterChain.push(`${aOut}${bgOut}amix=inputs=2:duration=first:weights=1 1[Abg]`);
        }
        
        aOut = '[Abg]';
      }

      // 3. SFX (Pops for text appearance)
      if (options.sfxEnabled && options.textLayers && options.textLayers.length > 0) {
        const popPath = app.isPackaged ? path.join(process.resourcesPath, 'assets', 'pop.mp3') : path.join(app.getAppPath(), 'assets', 'pop.mp3');
        if (fs.existsSync(popPath)) {
          const pops = options.textLayers.filter(t => t.startMs > 0 && t.startMs < durationSec * 1000).slice(0, 10);
          if (pops.length > 0) {
            command.input(popPath);
            const popIdx = inputCount++;
            
            let sfxGraph = `[${popIdx}:a]asplit=${pops.length}`;
            for (let i = 0; i < pops.length; i++) sfxGraph += `[pop${i}]`;
            filterChain.push(sfxGraph);
            
            let delayOuts = [];
            for (let i = 0; i < pops.length; i++) {
              filterChain.push(`[pop${i}]adelay=${pops[i].startMs}|${pops[i].startMs}[dpop${i}]`);
              delayOuts.push(`[dpop${i}]`);
            }
            
            filterChain.push(`${aOut}${delayOuts.join('')}amix=inputs=${pops.length + 1}:duration=first[Asfx]`);
            aOut = '[Asfx]';
          }
        }
      }

      command.complexFilter(filterChain);
      command.outputOptions([...videoOutputOptions, `-map ${vOut}`, `-map ${aOut}`, '-c:a aac', '-b:a 128k']);

      // Ensure output directory exists right before saving
      const outDir = path.dirname(outputPath);
      if (!fs.existsSync(outDir)) {
          fs.mkdirSync(outDir, { recursive: true });
      }

      command
        .on('progress', (progress) => {
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

    return outputPath;
  } finally {
    for (const file of tempFilesToClean) {
      if (fs.existsSync(file)) {
        try { fs.unlinkSync(file); } catch (e) { /* ignore cleanup error */ }
      }
    }
  }
}

ipcMain.handle('render:clip', async (_, options) => {
  try {
    const jobId = options.jobId || `render_${Date.now()}`;
    broadcastProgress(jobId, 0);

    // Derive a safe output path in the user-configured clips folder
    if (!options.outputPath) {
      const clipsDir = await getDir('clips');
      const baseName = path.basename(options.sourcePath || 'clip', path.extname(options.sourcePath || '.mp4'));
      options.outputPath = path.join(clipsDir, `${baseName}_${jobId}.mp4`);
    }

    // FFmpeg on Windows struggles with backslashes in certain output mappings
    options.outputPath = options.outputPath.replace(/\\/g, '/');

    const outputPath = await runVideoRender(options, jobId);
    return { success: true, outputPath, jobId };
  } catch (e) {
    console.error('[Render]', e.message);
    return { success: false, error: e.message };
  }
});

ipcMain.handle('render:batch', async (_, jobs) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return { success: false, error: 'jobs must be a non-empty array' };
  }
  const results = [];
  for (const options of jobs) {
    try {
      const jobId = options.jobId || `render_${Date.now()}`;
      broadcastProgress(jobId, 0);
      if (!options.outputPath) {
        const clipsDir = await getDir('clips');
        const baseName = path.basename(options.sourcePath || 'clip', path.extname(options.sourcePath || '.mp4'));
        options.outputPath = path.join(clipsDir, `${baseName}_${jobId}.mp4`);
      }

      // FFmpeg on Windows struggles with backslashes in certain output mappings
      options.outputPath = options.outputPath.replace(/\\/g, '/');

      const outputPath = await runVideoRender(options, jobId);
      results.push({ success: true, jobId, outputPath });
    } catch (e) {
      console.error('[Render:Batch]', e.message);
      results.push({ success: false, jobId: options.jobId, error: e.message });
    }
  }
  return { success: true, results };
});

module.exports = { runVideoRender, broadcastProgress, sendNotification };
