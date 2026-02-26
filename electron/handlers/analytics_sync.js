/**
 * electron/handlers/analytics_sync.js
 *
 * Phase 2: Analytics Platform Sync
 * - Fetch real stats from YouTube Data API v3, TikTok, Facebook Graph API
 * - Auto-sync every 6 hours for all clips with POSTED status
 * - Persist data to Analytics model
 */

const { ipcMain } = require('electron');
const keytar = require('keytar');
const prisma = require('../prisma');

const SERVICE_NAME = 'AutoClipperApp';

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

// ── YouTube Data API v3 ───────────────────────────────────────────────────────

async function syncYouTubeStats(clip, ytVideoId) {
  const apiKey = await getSetting('youtube_data_api_key');
  if (!apiKey) return null;

  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${ytVideoId}&key=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

  const data = await res.json();
  const stats = data.items?.[0]?.statistics;
  if (!stats) return null;

  return {
    platform: 'youtube',
    clipId: clip.id,
    views:    parseInt(stats.viewCount    || '0', 10),
    likes:    parseInt(stats.likeCount    || '0', 10),
    comments: parseInt(stats.commentCount || '0', 10),
    shares:   0, // YouTube API doesn't expose shares publicly
  };
}

// ── TikTok Creator API ────────────────────────────────────────────────────────

async function syncTikTokStats(clip, tiktokVideoId) {
  const accessToken = await getSetting('tiktok_access_token');
  if (!accessToken) return null;

  const res = await fetch('https://open.tiktokapis.com/v2/video/query/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filters: { video_ids: [tiktokVideoId] },
      fields: ['view_count', 'like_count', 'comment_count', 'share_count'],
    }),
  });
  if (!res.ok) throw new Error(`TikTok API error: ${res.status}`);

  const data = await res.json();
  const video = data.data?.videos?.[0];
  if (!video) return null;

  return {
    platform: 'tiktok',
    clipId: clip.id,
    views:    video.view_count    || 0,
    likes:    video.like_count    || 0,
    comments: video.comment_count || 0,
    shares:   video.share_count   || 0,
  };
}

// ── Facebook Graph API ────────────────────────────────────────────────────────

async function syncFacebookStats(clip, fbVideoId) {
  const accessToken = await getSetting('facebook_access_token');
  if (!accessToken) return null;

  const fields = 'video_insights.metric(total_video_views,total_video_reactions_by_type_total,total_video_comment_count)';
  const res = await fetch(`https://graph.facebook.com/v18.0/${fbVideoId}?fields=${fields}&access_token=${accessToken}`);
  if (!res.ok) throw new Error(`Facebook API error: ${res.status}`);

  const data = await res.json();
  const insights = data.video_insights?.data || [];

  const getMetric = (name) => {
    const item = insights.find(i => i.name === name);
    return item?.values?.[0]?.value || 0;
  };

  return {
    platform: 'facebook',
    clipId: clip.id,
    views:    getMetric('total_video_views'),
    likes:    getMetric('total_video_reactions_by_type_total'),
    comments: getMetric('total_video_comment_count'),
    shares:   0,
  };
}

// ── Core Sync Logic ───────────────────────────────────────────────────────────

async function syncAllAnalytics() {
  try {
    // Find all clips that have been posted (status = POSTED or COMPLETED)
    const clips = await prisma.clip.findMany({
      where: { status: 'POSTED' },
      include: { assets: true, analytics: true },
    });

    if (clips.length === 0) {
      console.log('[AnalyticsSync] No posted clips found.');
      return { success: true, synced: 0 };
    }

    let synced = 0;
    for (const clip of clips) {
      try {
        // Determine platform from existing analytics records or assets
        const platforms = clip.analytics.map(a => a.platform);

        for (const platform of platforms) {
          let statsData = null;

          // Extract video ID from asset storagePath or a separate field
          // Convention: storagePath contains platform video ID for uploaded videos
          const platformAsset = clip.assets.find(a => a.kind === `${platform}_id`);
          const videoId = platformAsset?.storagePath;

          if (!videoId) continue;

          if (platform === 'youtube')  statsData = await syncYouTubeStats(clip, videoId).catch(() => null);
          if (platform === 'tiktok')   statsData = await syncTikTokStats(clip, videoId).catch(() => null);
          if (platform === 'facebook') statsData = await syncFacebookStats(clip, videoId).catch(() => null);

          if (statsData) {
            await prisma.analytics.upsert({
              where: { clipId_platform: { clipId: clip.id, platform } },
              update: {
                views:    statsData.views,
                likes:    statsData.likes,
                comments: statsData.comments,
                shares:   statsData.shares,
                updatedAt: new Date(),
              },
              create: statsData,
            });
            synced++;
          }
        }
      } catch (clipErr) {
        console.warn(`[AnalyticsSync] Clip ${clip.id} sync error:`, clipErr.message);
      }
    }

    console.log(`[AnalyticsSync] ✅ Synced ${synced} analytics records.`);
    return { success: true, synced };
  } catch (error) {
    console.error('[AnalyticsSync] Fatal error:', error.message);
    return { success: false, error: error.message };
  }
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('analytics:syncAll', async () => {
  return await syncAllAnalytics();
});

ipcMain.handle('analytics:syncPlatform', async (_, { platform }) => {
  // For now, just run full sync filtered mentally; could be extended
  return await syncAllAnalytics();
});

// ── Auto-sync poller (every 6 hours) ─────────────────────────────────────────

function startAnalyticsSyncPoller() {
  console.log('[AnalyticsSync] Auto-sync poller started (6-hour interval).');
  setInterval(async () => {
    console.log('[AnalyticsSync] 🔄 Running scheduled sync...');
    await syncAllAnalytics();
  }, 6 * 60 * 60 * 1000);
}

module.exports = { startAnalyticsSyncPoller };
