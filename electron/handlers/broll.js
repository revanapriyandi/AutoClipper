/**
 * electron/handlers/broll.js
 * 
 * B-Roll download from Pexels API based on keywords extracted during scoring.
 * - broll:search  — search Pexels for videos matching keywords
 * - broll:download — download a Pexels video to local cache
 */
const { ipcMain, app } = require('electron');
const fs = require('fs');
const path = require('path');
const keytar = require('keytar');
const { getDir } = require('../paths');

const SERVICE_NAME = 'AutoClipperApp';
const PEXELS_API_URL = 'https://api.pexels.com/videos/search';


// ── Search Pexels for video clips ────────────────────────────────
ipcMain.handle('broll:search', async (_, { keywords, orientation = 'portrait', perPage = 5 }) => {
  try {
    const pexelsKey = await keytar.getPassword(SERVICE_NAME, 'pexels_api_key');
    if (!pexelsKey) {
      return { success: false, error: 'Pexels API Key not configured. Add it in Settings.' };
    }

    const query = Array.isArray(keywords) ? keywords.slice(0, 3).join(' ') : keywords;
    const url = `${PEXELS_API_URL}?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${perPage}&size=small`;

    const res = await fetch(url, {
      headers: { 'Authorization': pexelsKey },
    });

    if (!res.ok) {
      throw new Error(`Pexels API error: ${res.status}`);
    }

    const data = await res.json();

    const videos = (data.videos || []).map(v => {
      // Prefer SD file for faster download, fallback to HD
      const file = v.video_files?.find(f => f.quality === 'sd') 
                || v.video_files?.find(f => f.quality === 'hd')
                || v.video_files?.[0];
      return {
        id: v.id,
        url: v.url,
        image: v.image,          // Thumbnail
        duration: v.duration,    // seconds
        width: file?.width,
        height: file?.height,
        downloadUrl: file?.link,
        quality: file?.quality,
      };
    }).filter(v => v.downloadUrl);

    return { success: true, videos, query };
  } catch (e) {
    console.error('[B-Roll] Search failed:', e.message);
    return { success: false, error: e.message };
  }
});

// ── Download a Pexels video to local cache ───────────────────────
ipcMain.handle('broll:download', async (_, { videoId, downloadUrl }) => {
  try {
    const cacheDir = await getDir('brollCache');
    const cacheFile = path.join(cacheDir, `broll_${videoId}.mp4`);

    // Return cached version if already downloaded
    if (fs.existsSync(cacheFile)) {
      return { success: true, localPath: cacheFile, cached: true };
    }

    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(cacheFile, buffer);

    console.log(`[B-Roll] Downloaded ${videoId} → ${cacheFile}`);
    return { success: true, localPath: cacheFile, cached: false };
  } catch (e) {
    console.error('[B-Roll] Download failed:', e.message);
    return { success: false, error: e.message };
  }
});

// ── List cached B-Roll files ─────────────────────────────────────
ipcMain.handle('broll:listCache', async () => {
  try {
    const cacheDir = await getDir('brollCache');
    const files = fs.readdirSync(cacheDir).map(f => ({
      name: f,
      path: path.join(cacheDir, f),
      size: fs.statSync(path.join(cacheDir, f)).size,
    }));
    return { success: true, files, cacheDir };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// ── Clear B-Roll cache ───────────────────────────────────────────
ipcMain.handle('broll:clearCache', async () => {
  try {
    const cacheDir = await getDir('brollCache');
    const files = fs.readdirSync(cacheDir);
    for (const f of files) fs.unlinkSync(path.join(cacheDir, f));
    return { success: true, cleared: files.length };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
