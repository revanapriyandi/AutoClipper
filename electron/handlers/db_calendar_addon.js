/**
 * electron/handlers/db_calendar_addon.js (Phase 6 — Enhanced Content Calendar)
 *
 * - calendar:getScheduled     — get all jobs scheduled for a date range
 * - calendar:reschedule       — move a job to a new scheduledAt time
 * - calendar:getOptimalTimes  — suggest best posting times per platform from analytics
 * - calendar:getMonth         — convenience: get all scheduled jobs in a calendar month
 */

const { ipcMain } = require('electron');
const prisma = require('../prisma');

// ── Get scheduled jobs for a month ───────────────────────────────────────────

ipcMain.handle('calendar:getMonth', async (_, { year, month }) => {
  try {
    const startDate = new Date(year, month - 1, 1);
    const endDate   = new Date(year, month, 0, 23, 59, 59);

    const jobs = await prisma.job.findMany({
      where: {
        scheduledAt: { gte: startDate, lte: endDate },
        status: { in: ['QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'RETRY_PENDING'] },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    // Group by day
    const grouped = {};
    for (const job of jobs) {
      const day = new Date(job.scheduledAt).getDate();
      if (!grouped[day]) grouped[day] = [];
      try {
        const payload = JSON.parse(job.payloadJson || '{}');
        grouped[day].push({
          id: job.id,
          type: job.type,
          status: job.status,
          scheduledAt: job.scheduledAt,
          title: payload.title || payload.videoTitle || `${job.type} Job`,
          platform: payload.targetPlatform || payload.platform || '',
        });
      } catch {
        grouped[day].push({ id: job.id, type: job.type, status: job.status, scheduledAt: job.scheduledAt });
      }
    }

    return { success: true, jobs, grouped };
  } catch (error) {
    console.error('[Calendar] getMonth error:', error);
    return { success: false, error: error.message };
  }
});

// ── Reschedule a job ─────────────────────────────────────────────────────────

ipcMain.handle('calendar:reschedule', async (_, { jobId, scheduledAt }) => {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: {
        scheduledAt: new Date(scheduledAt),
        // If it was in a terminal state, reset it so it can run
        status: 'QUEUED',
        attempts: 0,
        error: null,
        nextRetryAt: null,
      },
    });
    return { success: true, job };
  } catch (error) {
    console.error('[Calendar] reschedule error:', error);
    return { success: false, error: error.message };
  }
});

// ── Suggest optimal posting times per platform ────────────────────────────────

ipcMain.handle('calendar:getOptimalTimes', async () => {
  try {
    const analytics = await prisma.analytics.findMany({
      orderBy: { views: 'desc' },
      take: 100,
      include: {
        clip: {
          include: {
            assets: { where: { kind: { in: ['youtube_id', 'tiktok_id', 'facebook_id'] } } },
          },
        },
      },
    });

    // Group by platform and calculate views by hour from updatedAt as proxy
    const hourBuckets = {};
    for (const entry of analytics) {
      const platform = entry.platform;
      const hour = new Date(entry.updatedAt).getHours();
      if (!hourBuckets[platform]) hourBuckets[platform] = {};
      if (!hourBuckets[platform][hour]) hourBuckets[platform][hour] = { totalViews: 0, count: 0 };
      hourBuckets[platform][hour].totalViews += entry.views;
      hourBuckets[platform][hour].count++;
    }

    // Find best hour per platform (highest avg views)
    const suggestions = {};
    for (const [platform, hours] of Object.entries(hourBuckets)) {
      let bestHour = 18; // default
      let bestAvg = 0;
      for (const [hour, data] of Object.entries(hours)) {
        const avg = data.totalViews / data.count;
        if (avg > bestAvg) {
          bestAvg = avg;
          bestHour = parseInt(hour);
        }
      }
      suggestions[platform] = {
        bestHour,
        bestTime: `${String(bestHour).padStart(2, '0')}:00`,
        avgViews: Math.round(bestAvg),
      };
    }

    // Add defaults for platforms with no data
    const defaults = {
      youtube:  { bestHour: 18, bestTime: '18:00', avgViews: 0 },
      tiktok:   { bestHour: 19, bestTime: '19:00', avgViews: 0 },
      facebook: { bestHour: 14, bestTime: '14:00', avgViews: 0 },
    };

    return {
      success: true,
      suggestions: { ...defaults, ...suggestions },
      dataPoints: analytics.length,
    };
  } catch (error) {
    console.error('[Calendar] getOptimalTimes error:', error);
    return { success: false, error: error.message };
  }
});

// ── Legacy: getScheduledJobs (keep backwards compat) ────────────────────────
ipcMain.handle('db:getScheduledJobs', async () => {
  try {
    const jobs = await prisma.job.findMany({
      where: { scheduledAt: { not: null }, status: { not: 'COMPLETED' } },
      orderBy: { scheduledAt: 'asc' },
    });
    return { success: true, jobs };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
