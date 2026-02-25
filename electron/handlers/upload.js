/**
 * electron/handlers/upload.js
 * 
 * Real social media video upload handlers
 * - YouTube Shorts: Resumable upload API
 * - TikTok: Direct post API
 * - Facebook/Meta: Graph API video publish
 */
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');
const { getValidToken } = require('./auth');

// ──────────────────────────────────────────────────────────────
// YouTube Shorts Resumable Upload
// ──────────────────────────────────────────────────────────────
async function uploadToYouTube({ videoPath, title, description, tags = [] }) {
  const token = await getValidToken('youtube');
  if (!token) throw new Error('YouTube: Not authenticated. Connect in Settings.');

  const videoBuffer = fs.readFileSync(videoPath);
  const fileSize = fs.statSync(videoPath).size;
  const ext = path.extname(videoPath).slice(1).toLowerCase();
  const mimeType = ext === 'webm' ? 'video/webm' : 'video/mp4';

  // Step 1: Initiate resumable upload
  const initRes = await fetch(
    'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Type': mimeType,
        'X-Upload-Content-Length': fileSize,
      },
      body: JSON.stringify({
        snippet: {
          title: title || 'AutoClipper Short',
          description: description || '',
          tags,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus: 'private', // Start as private, user can change
          selfDeclaredMadeForKids: false,
        },
      }),
    }
  );

  if (!initRes.ok) {
    const err = await initRes.text();
    throw new Error(`YouTube init failed (${initRes.status}): ${err.slice(0, 200)}`);
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) throw new Error('YouTube: No resumable upload URL received.');

  // Step 2: Upload video bytes
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': mimeType,
      'Content-Length': fileSize,
    },
    body: videoBuffer,
  });

  if (uploadRes.status !== 200 && uploadRes.status !== 201) {
    throw new Error(`YouTube upload failed (${uploadRes.status})`);
  }

  const data = await uploadRes.json();
  return { videoId: data.id, url: `https://youtube.com/shorts/${data.id}` };
}

// ──────────────────────────────────────────────────────────────
// TikTok Direct Post
// ──────────────────────────────────────────────────────────────
async function uploadToTikTok({ videoPath, title }) {
  const token = await getValidToken('tiktok');
  if (!token) throw new Error('TikTok: Not authenticated. Connect in Settings.');

  const videoBuffer = fs.readFileSync(videoPath);
  const fileSize = fs.statSync(videoPath).size;

  // Step 1: Init upload
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify({
      post_info: { title: title || 'AutoClipper', privacy_level: 'SELF_ONLY', disable_duet: false, disable_comment: false, disable_stitch: false },
      source_info: { source: 'FILE_UPLOAD', video_size: fileSize, chunk_size: fileSize, total_chunk_count: 1 },
    }),
  });
  if (!initRes.ok) throw new Error(`TikTok init failed: ${initRes.status}`);
  const initData = await initRes.json();
  const uploadUrl = initData.data?.upload_url;
  if (!uploadUrl) throw new Error('TikTok: No upload URL received.');

  // Step 2: Upload chunk
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Range': `bytes 0-${fileSize - 1}/${fileSize}`, 'Content-Type': 'video/mp4' },
    body: videoBuffer,
  });
  if (!uploadRes.ok) throw new Error(`TikTok upload failed: ${uploadRes.status}`);

  return { publishId: initData.data?.publish_id };
}

// ──────────────────────────────────────────────────────────────
// Facebook/Meta Reels
// ──────────────────────────────────────────────────────────────
async function uploadToFacebook({ videoPath, title, pageId }) {
  const token = await getValidToken('facebook');
  if (!token) throw new Error('Facebook: Not authenticated. Connect in Settings.');

  const targetId = pageId || 'me';
  const videoBuffer = fs.readFileSync(videoPath);
  const formData = new FormData();
  formData.append('access_token', token);
  formData.append('description', title || 'AutoClipper Reel');
  formData.append('file', new Blob([videoBuffer], { type: 'video/mp4' }), path.basename(videoPath));

  const res = await fetch(`https://graph.facebook.com/v17.0/${targetId}/videos`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error(`Facebook upload failed: ${res.status}`);
  const data = await res.json();
  return { videoId: data.id };
}

// ──────────────────────────────────────────────────────────────
// IPC: upload:video
// ──────────────────────────────────────────────────────────────
ipcMain.handle('upload:video', async (_, { platform, videoPath, title, description, tags, pageId }) => {
  try {
    let result;
    if      (platform === 'youtube')  result = await uploadToYouTube({ videoPath, title, description, tags });
    else if (platform === 'tiktok')   result = await uploadToTikTok({ videoPath, title });
    else if (platform === 'facebook') result = await uploadToFacebook({ videoPath, title, pageId });
    else throw new Error('Unknown platform: ' + platform);
    return { success: true, ...result };
  } catch (e) {
    console.error(`[Upload][${platform}]`, e.message);
    return { success: false, error: e.message };
  }
});

module.exports = { uploadToYouTube, uploadToTikTok, uploadToFacebook };

