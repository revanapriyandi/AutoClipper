/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * electron/handlers/autopilot.js
 * 
 * Handles the full automation pipeline:
 *  - Persist autopilot config (keywords, platform, limits, isActive toggle)
 *  - Search YouTube for trending videos matching keywords
 *  - Download the video using yt-dlp (youtube-dl-exec)
 *  - Create a Project DB record automatically
 */

const { ipcMain, app } = require('electron');
const path = require('path');
const fs = require('fs');
const prisma = require('../prisma');
const { getDir } = require('../paths');

let ytdl;
let ytSearch;
// Lazy-load so they don't crash if not installed
try { ytdl = require('youtube-dl-exec'); } catch (e) { console.warn('[Autopilot] youtube-dl-exec not available:', e.message); }
try { ytSearch = require('yt-search'); } catch (e) { console.warn('[Autopilot] yt-search not available:', e.message); }

// ─── IPC Handlers ────────────────────────────────────────────────────────────

// Get the current autopilot config (creates a default if none exists)
ipcMain.handle('autopilot:getConfig', async () => {
  try {
    let config = await prisma.autopilotConfig.findFirst();
    if (!config) {
      config = await prisma.autopilotConfig.create({
        data: {
          keywords: 'podcast clips, motivation, interview highlights',
          targetPlatform: 'youtube',
          maxDailyDownloads: 3,
          isActive: false,
        },
      });
    }
    return { success: true, config };
  } catch (error) {
    console.error('[Autopilot] getConfig error:', error);
    return { success: false, error: error.message };
  }
});

// Save updated autopilot config
ipcMain.handle('autopilot:saveConfig', async (_, data) => {
  try {
    let config = await prisma.autopilotConfig.findFirst();
    if (!config) {
      config = await prisma.autopilotConfig.create({ data });
    } else {
      config = await prisma.autopilotConfig.update({
        where: { id: config.id },
        data,
      });
    }
    return { success: true, config };
  } catch (error) {
    console.error('[Autopilot] saveConfig error:', error);
    return { success: false, error: error.message };
  }
});

// Toggle the master switch
ipcMain.handle('autopilot:toggle', async (_, isActive) => {
  try {
    const config = await prisma.autopilotConfig.findFirst();
    if (!config) return { success: false, error: 'No config found. Save config first.' };

    const updated = await prisma.autopilotConfig.update({
      where: { id: config.id },
      data: { isActive },
    });
    return { success: true, config: updated };
  } catch (error) {
    console.error('[Autopilot] toggle error:', error);
    return { success: false, error: error.message };
  }
});

// Manually trigger one search-and-download cycle (also called by the background poller)
ipcMain.handle('autopilot:runNow', async () => {
  return await runAutopilotCycle();
});

// ─── Background Poller ────────────────────────────────────────────────────────

let autopilotInterval = null;

function startAutopilotPoller() {
  if (autopilotInterval) return;
  // Check every 30 minutes
  autopilotInterval = setInterval(async () => {
    try {
      const config = await prisma.autopilotConfig.findFirst();
      if (!config?.isActive) return;
      console.log('[Autopilot] 🔄 Background cycle triggered...');
      await runAutopilotCycle();
    } catch (e) {
      console.error('[Autopilot] Poller error:', e.message);
    }
  }, 30 * 60 * 1000);
  console.log('[Autopilot] Background poller started (30-min interval).');
}

// ─── Core Search + Download Logic ─────────────────────────────────────────────

async function runAutopilotCycle() {
  try {
    const config = await prisma.autopilotConfig.findFirst();
    if (!config) return { success: false, error: 'No autopilot config found.' };

    if (!ytSearch) return { success: false, error: 'yt-search module not available.' };
    if (!ytdl) return { success: false, error: 'youtube-dl-exec module not available.' };

    // Count today's downloads to respect maxDailyDownloads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await prisma.project.count({
      where: {
        createdAt: { gte: today },
        title: { contains: '[Autopilot]' },
      },
    });

    if (todayCount >= config.maxDailyDownloads) {
      return { success: false, error: `Daily limit of ${config.maxDailyDownloads} downloads reached.` };
    }

    // Pick a random keyword from the comma-separated list
    const keywords = config.keywords.split(',').map(k => k.trim()).filter(Boolean);
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];

    console.log(`[Autopilot] 🔍 Searching "${keyword}"...`);

    const results = await ytSearch({ query: keyword, pages: 1 });
    const videos = results.videos.filter(v => {
      const seconds = v.seconds || (v.duration?.seconds ?? 0);
      return seconds >= 120 && seconds <= 1800; // 2-30 min range
    });

    if (videos.length === 0) {
      return { success: false, error: `No suitable videos found for "${keyword}".` };
    }

    const video = videos[Math.floor(Math.random() * Math.min(videos.length, 5))];
    const jobId = Date.now().toString();
    const downloadsDir = await getDir('autopilot');
    const jobDir = path.join(downloadsDir, jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    console.log(`[Autopilot] ⬇️ Downloading: ${video.title}`);

    await ytdl(video.url, {
      output: path.join(jobDir, '%(title)s.%(ext)s'),
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      mergeOutputFormat: 'mp4',
      noPlaylist: true,
    });

    // Scan the temp dir for the actual output file (yt-dlp sanitizes filenames)
    const files = fs.readdirSync(jobDir).filter(f => f.endsWith('.mp4') || f.endsWith('.mkv') || f.endsWith('.webm'));
    if (files.length === 0) {
      return { success: false, error: 'Download finished but no video file found on disk. The video format may be unsupported.' };
    }

    const outputPath = path.join(jobDir, files[0]);
    const safeTitle = files[0].replace(/\.[^/.]+$/, ''); // strip extension for DB title

    // Automatically create a project record in the DB
    const project = await prisma.project.create({
      data: {
        title: `[Autopilot] ${safeTitle}`,
        sourcePath: outputPath,
        status: 'DRAFT',
      },
    });

    console.log(`[Autopilot] ✅ Project created: ${project.id}`);
    return { success: true, project, videoTitle: video.title };

  } catch (error) {
    console.error('[Autopilot] runCycle error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { startAutopilotPoller };
