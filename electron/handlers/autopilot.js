/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * electron/handlers/autopilot.js (Phase 3 — Smart Autopilot)
 *
 * Handles the full automation pipeline:
 *  - Persist autopilot config (keywords, platform, limits, filters, isActive)
 *  - Search YouTube / Playlist / RSS for matching videos
 *  - Smart deduplication via AutopilotHistory
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

// ─── Default Config ──────────────────────────────────────────────────────────
const DEFAULT_CONFIG = {
  keywords: 'podcast clips, motivation, interview highlights',
  targetPlatform: 'youtube',
  maxDailyDownloads: 3,
  isActive: false,
  minViews: 10000,
  maxAgeDays: 30,
  sourceType: 'search',
  playlistUrl: null,
  rssUrl: null,
};

// ─── IPC Handlers ────────────────────────────────────────────────────────────

ipcMain.handle('autopilot:getConfig', async () => {
  try {
    let config = await prisma.autopilotConfig.findFirst();
    if (!config) {
      config = await prisma.autopilotConfig.create({ data: DEFAULT_CONFIG });
    }
    return { success: true, config };
  } catch (error) {
    console.error('[Autopilot] getConfig error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('autopilot:saveConfig', async (_, data) => {
  try {
    let config = await prisma.autopilotConfig.findFirst();
    if (!config) {
      config = await prisma.autopilotConfig.create({ data: { ...DEFAULT_CONFIG, ...data } });
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

ipcMain.handle('autopilot:runNow', async () => {
  return await runAutopilotCycle();
});

// Get download history for deduplication tracking in UI
ipcMain.handle('autopilot:getHistory', async () => {
  try {
    const history = await prisma.autopilotHistory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return { success: true, history };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// ─── Background Poller ────────────────────────────────────────────────────────

let autopilotInterval = null;

function startAutopilotPoller() {
  if (autopilotInterval) return;
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

// ─── RSS Podcast Parser ───────────────────────────────────────────────────────

async function getVideoFromRSS(rssUrl) {
  const res = await fetch(rssUrl);
  if (!res.ok) throw new Error(`RSS fetch failed: ${res.status}`);
  const xml = await res.text();

  // Simple regex XML parsing for RSS enclosures (podcast episodes)
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  const episodes = items.map(item => {
    const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
      || item.match(/<title>(.*?)<\/title>/)?.[1] || 'Untitled';
    const url = item.match(/<enclosure[^>]+url="([^"]+)"/)?.[1]
      || item.match(/<media:content[^>]+url="([^"]+)"/)?.[1] || '';
    const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
    return { title, url, pubDate };
  }).filter(e => e.url);

  return episodes[0] || null; // Return latest episode
}

// ─── Playlist Video Picker ────────────────────────────────────────────────────

async function getVideoFromPlaylist(playlistUrl, config) {
  if (!ytdl) throw new Error('youtube-dl-exec not available');
  // Use yt-dlp to get playlist info (flat)
  const info = await ytdl(playlistUrl, {
    dumpSingleJson: true,
    flatPlaylist: true,
    skipDownload: true,
    noWarnings: true,
  });

  const videos = (info.entries || []).filter(v => {
    const dur = v.duration || 0;
    return dur >= 120 && dur <= 1800;
  });

  if (videos.length === 0) throw new Error('No suitable videos found in playlist');

  const video = videos[Math.floor(Math.random() * Math.min(videos.length, 10))];
  return { url: `https://youtube.com/watch?v=${video.id}`, title: video.title };
}

// ─── Core Search + Download Logic ─────────────────────────────────────────────

async function runAutopilotCycle() {
  try {
    const config = await prisma.autopilotConfig.findFirst();
    if (!config) return { success: false, error: 'No autopilot config found.' };

    // Count today's downloads
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

    let videoUrl = '';
    let videoTitle = '';

    // ── Source: RSS ────────────────────────────────────────────────────────
    if (config.sourceType === 'rss') {
      if (!config.rssUrl) return { success: false, error: 'RSS URL not configured.' };

      const episode = await getVideoFromRSS(config.rssUrl);
      if (!episode) return { success: false, error: 'No episodes found in RSS feed.' };

      // Check deduplication
      const existing = await prisma.autopilotHistory.findUnique({ where: { url: episode.url } });
      if (existing) return { success: false, error: `Already processed: ${episode.title}` };

      videoUrl = episode.url;
      videoTitle = episode.title;

    // ── Source: Playlist ───────────────────────────────────────────────────
    } else if (config.sourceType === 'playlist') {
      if (!config.playlistUrl) return { success: false, error: 'Playlist URL not configured.' };
      if (!ytdl) return { success: false, error: 'youtube-dl-exec module not available.' };

      const video = await getVideoFromPlaylist(config.playlistUrl, config);

      // Check deduplication
      const existing = await prisma.autopilotHistory.findUnique({ where: { url: video.url } });
      if (existing) return { success: false, error: `Already processed: ${video.title}` };

      videoUrl = video.url;
      videoTitle = video.title;

    // ── Source: Search (default) ───────────────────────────────────────────
    } else {
      if (!ytSearch) return { success: false, error: 'yt-search module not available.' };
      if (!ytdl) return { success: false, error: 'youtube-dl-exec module not available.' };

      const keywords = config.keywords.split(',').map(k => k.trim()).filter(Boolean);
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      console.log(`[Autopilot] 🔍 Searching "${keyword}"...`);

      const results = await ytSearch({ query: keyword, pages: 1 });
      const maxAgeDate = new Date(Date.now() - (config.maxAgeDays || 30) * 24 * 60 * 60 * 1000);

      const videos = results.videos.filter(v => {
        const seconds = v.seconds || (v.duration?.seconds ?? 0);
        const views = v.views || 0;
        const publishedDate = v.ago ? new Date() : null; // Approximation
        const ageOk = !publishedDate || publishedDate >= maxAgeDate;
        return seconds >= 120 && seconds <= 1800 && views >= (config.minViews || 0) && ageOk;
      });

      if (videos.length === 0) {
        return { success: false, error: `No suitable videos found for "${keyword}" (min views: ${config.minViews}).` };
      }

      // Filter already-processed URLs
      const candidateUrls = videos.slice(0, 5).map(v => v.url);
      const alreadyProcessed = await prisma.autopilotHistory.findMany({
        where: { url: { in: candidateUrls } },
        select: { url: true },
      });
      const processedSet = new Set(alreadyProcessed.map(h => h.url));
      const freshVideos = videos.filter(v => !processedSet.has(v.url));

      if (freshVideos.length === 0) {
        return { success: false, error: 'All top results already processed. Try different keywords.' };
      }

      const video = freshVideos[0];
      videoUrl = video.url;
      videoTitle = video.title;
    }

    // ── Download ───────────────────────────────────────────────────────────
    const jobId = Date.now().toString();
    const downloadsDir = await getDir('autopilot');
    const jobDir = path.join(downloadsDir, jobId);
    fs.mkdirSync(jobDir, { recursive: true });

    console.log(`[Autopilot] ⬇️ Downloading: ${videoTitle}`);

    await ytdl(videoUrl, {
      output: path.join(jobDir, '%(title)s.%(ext)s'),
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      mergeOutputFormat: 'mp4',
      noPlaylist: true,
    });

    const files = fs.readdirSync(jobDir).filter(f => f.endsWith('.mp4') || f.endsWith('.mkv') || f.endsWith('.webm'));
    if (files.length === 0) {
      return { success: false, error: 'Download finished but no video file found on disk.' };
    }

    const outputPath = path.join(jobDir, files[0]);
    const safeTitle = files[0].replace(/\.[^/.]+$/, '');

    const project = await prisma.project.create({
      data: {
        title: `[Autopilot] ${safeTitle}`,
        sourcePath: outputPath,
        status: 'DRAFT',
      },
    });

    // Record in AutopilotHistory for future deduplication
    await prisma.autopilotHistory.create({
      data: {
        url: videoUrl,
        title: videoTitle,
        projectId: project.id,
      },
    });

    console.log(`[Autopilot] ✅ Project created: ${project.id}`);
    return { success: true, project, videoTitle };

  } catch (error) {
    console.error('[Autopilot] runCycle error:', error);
    return { success: false, error: error.message };
  }
}

module.exports = { startAutopilotPoller };
