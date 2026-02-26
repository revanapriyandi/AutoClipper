/**
 * electron/handlers/compilation.js (Phase 7 — Clip Compilation Mode)
 *
 * - compilation:create    — concatenate selected clips into one video
 * - compilation:bestOf    — auto-select top N clips by score and concatenate
 */

const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const ffmpeg = require('fluent-ffmpeg');
const prisma = require('../prisma');
const { getDir } = require('../paths');

function broadcast(channel, data) {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) win.webContents.send(channel, data);
  });
}

// ── Concat clips using FFmpeg concat demuxer ─────────────────────────────────

async function concatClips(clipPaths, outputPath) {
  const tmpConcatFile = path.join(os.tmpdir(), `ac_concat_${Date.now()}.txt`);

  // Verify all files exist
  for (const p of clipPaths) {
    if (!fs.existsSync(p)) throw new Error(`Clip file not found: ${p}`);
  }

  // Write concat list
  const concatContent = clipPaths.map(p => `file '${p.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n');
  fs.writeFileSync(tmpConcatFile, concatContent, 'utf8');

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(tmpConcatFile)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .outputOptions(['-c', 'copy'])
      .save(outputPath)
      .on('progress', (progress) => {
        broadcast('compilation:progress', {
          percent: Math.round(progress.percent || 0),
          timemark: progress.timemark,
        });
      })
      .on('end', () => {
        try { fs.unlinkSync(tmpConcatFile); } catch {}
        resolve();
      })
      .on('error', (err) => {
        try { fs.unlinkSync(tmpConcatFile); } catch {}
        reject(new Error(`FFmpeg concat error: ${err.message}`));
      });
  });
}

// ── IPC: Create compilation from selected clip IDs ───────────────────────────

ipcMain.handle('compilation:create', async (_, { clipIds, outputName }) => {
  try {
    if (!clipIds || clipIds.length === 0) throw new Error('clipIds is required');

    // Fetch clips and their render asset paths
    const clips = await prisma.clip.findMany({
      where: { id: { in: clipIds } },
      include: { assets: true },
    });

    // Get video asset paths
    const clipPaths = clipIds.map(id => {
      const clip = clips.find(c => c.id === id);
      if (!clip) throw new Error(`Clip ${id} not found`);
      const videoAsset = clip.assets.find(a => a.kind === 'video');
      if (!videoAsset || !fs.existsSync(videoAsset.storagePath)) {
        throw new Error(`Rendered video not found for clip ${id}. Please render it first.`);
      }
      return videoAsset.storagePath;
    });

    const clipsDir = await getDir('clips');
    const fileName = outputName
      ? outputName.replace(/[^a-z0-9_-]/gi, '_') + '.mp4'
      : `compilation_${Date.now()}.mp4`;
    const outputPath = path.join(clipsDir, fileName);

    broadcast('compilation:progress', { percent: 0, timemark: '00:00:00' });
    await concatClips(clipPaths, outputPath);
    broadcast('compilation:progress', { percent: 100, timemark: '' });

    return { success: true, outputPath, clipCount: clipPaths.length };
  } catch (e) {
    console.error('[Compilation] create error:', e.message);
    return { success: false, error: e.message };
  }
});

// ── IPC: Auto Best-Of — top N clips by AI score ──────────────────────────────

ipcMain.handle('compilation:bestOf', async (_, { topN = 10, projectId, outputName }) => {
  try {
    const where = projectId ? { projectId } : {};

    // Fetch clips with rendered video assets
    const clips = await prisma.clip.findMany({
      where: { ...where, status: { in: ['COMPLETED', 'POSTED'] } },
      include: { assets: true },
      orderBy: { createdAt: 'desc' },
    });

    // Sort by total score from scores JSON
    const scoredClips = clips
      .map(clip => {
        let total = 0;
        try {
          const scores = JSON.parse(clip.scores || '{}');
          total = scores.total || scores.virality_score || 0;
        } catch {}
        const videoAsset = clip.assets.find(a => a.kind === 'video');
        return { clip, total, videoPath: videoAsset?.storagePath };
      })
      .filter(item => item.videoPath && fs.existsSync(item.videoPath))
      .sort((a, b) => b.total - a.total)
      .slice(0, topN);

    if (scoredClips.length === 0) {
      throw new Error('No rendered clips found. Render some clips first.');
    }

    const clipPaths = scoredClips.map(item => item.videoPath);
    const selectedIds = scoredClips.map(item => item.clip.id);

    const clipsDir = await getDir('clips');
    const fileName = outputName
      ? outputName.replace(/[^a-z0-9_-]/gi, '_') + '.mp4'
      : `bestof_top${topN}_${Date.now()}.mp4`;
    const outputPath = path.join(clipsDir, fileName);

    broadcast('compilation:progress', { percent: 0, timemark: '00:00:00' });
    await concatClips(clipPaths, outputPath);
    broadcast('compilation:progress', { percent: 100, timemark: '' });

    return {
      success: true,
      outputPath,
      clipCount: clipPaths.length,
      selectedClipIds: selectedIds,
    };
  } catch (e) {
    console.error('[Compilation] bestOf error:', e.message);
    return { success: false, error: e.message };
  }
});

// ── IPC: Get all clips for compilation picker ─────────────────────────────────

ipcMain.handle('compilation:getClips', async () => {
  try {
    const clips = await prisma.clip.findMany({
      where: { status: { in: ['COMPLETED', 'POSTED'] } },
      include: {
        assets: { where: { kind: 'video' } },
        project: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const clipsWithPath = clips.map(clip => {
      const videoAsset = clip.assets[0];
      let total = 0;
      try { const s = JSON.parse(clip.scores || '{}'); total = s.total || s.virality_score || 0; } catch {}
      return {
        id: clip.id,
        projectTitle: clip.project?.title || '',
        caption: clip.caption,
        startMs: clip.startMs,
        endMs: clip.endMs,
        status: clip.status,
        score: total,
        hasVideo: !!videoAsset && fs.existsSync(videoAsset.storagePath),
        videoPath: videoAsset?.storagePath,
        createdAt: clip.createdAt,
      };
    }).filter(c => c.hasVideo);

    return { success: true, clips: clipsWithPath };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

module.exports = {};
