/**
 * electron/handlers/jobs.js
 *
 * Prisma-based async job queue with RETRY + BACKOFF:
 * - Jobs are retried up to MAX_JOB_ATTEMPTS times before marking FAILED
 * - Back-off delay grows between attempts: 5s → 30s → 2min
 * - Non-retryable errors (e.g. auth) are failed immediately
 * - Real-time IPC broadcasts for front-end progress UI
 */

const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const { getDir } = require('../paths');
const { runVideoRender } = require('./render');
const { getValidToken } = require('./auth');
const { writeLog } = require('./logger');

const prisma = require('../prisma');

/** Max attempts before marking a job permanently FAILED */
const MAX_JOB_ATTEMPTS = 3;

/**
 * Delays between retry attempts (ms). Index = attempt number (1-based).
 * 1st fail → wait 5s, 2nd fail → wait 30s, 3rd fail → FAILED
 */
const RETRY_DELAYS_MS = [0, 5_000, 30_000, 120_000];

/**
 * Some errors are not retryable at all.
 */
const NON_RETRYABLE_MESSAGES = [
  'Not authenticated',
  'no API key',
  'API Key not configured',
  'Unknown job type',
  'Unsupported platform',
];

function isNonRetryable(errorMessage = '') {
  return NON_RETRYABLE_MESSAGES.some(m => errorMessage.includes(m));
}

/** Broadcast an event to all renderer windows */
function broadcast(channel, data) {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) win.webContents.send(channel, data);
  });
}

let isProcessingQueue = false;

async function processNextJob() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    const now = new Date();
    const job = await prisma.job.findFirst({
      where: {
        OR: [
          { status: 'QUEUED' },
          { status: 'RETRY_PENDING', nextRetryAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { scheduledAt: null },
              { scheduledAt: { lte: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    if (!job) { isProcessingQueue = false; return; }

    const attemptNumber = (job.attempts || 0) + 1;
    console.log(`[JobQueue] ${job.id} (${job.type}) — attempt ${attemptNumber}/${MAX_JOB_ATTEMPTS}`);

    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'PROCESSING', attempts: attemptNumber },
    });

    broadcast('job:statusChanged', { jobId: job.id, status: 'PROCESSING', attempts: attemptNumber });

    try {
      const payload = JSON.parse(job.payloadJson);

      if (job.type === 'RENDER') {
        broadcast('job:progress', { jobId: job.id, percent: 0, label: 'Starting render...' });

        // Derive outputPath if not in payload
        if (!payload.outputPath) {
          const clipsDir = await getDir('clips');
          const baseName = path.basename(payload.sourcePath || 'clip').replace(/\.[^.]+$/, '');
          payload.outputPath = path.join(clipsDir, `${baseName}_${job.id}.mp4`);
        }

        await runVideoRender(payload, job.id);
        broadcast('job:progress', { jobId: job.id, percent: 100, label: 'Render complete' });

      } else if (job.type === 'POST') {
        const { videoPath, title, description, tags, pageId, targetPlatform } = payload;
        let platform = '';
        if ((targetPlatform || '').includes('YouTube'))       platform = 'youtube';
        else if ((targetPlatform || '').includes('TikTok'))   platform = 'tiktok';
        else if ((targetPlatform || '').includes('Facebook')) platform = 'facebook';
        else platform = targetPlatform?.toLowerCase() || '';

        if (!platform) throw new Error('Unsupported platform: ' + targetPlatform);

        broadcast('job:progress', { jobId: job.id, percent: 20, label: `Authenticating with ${platform}...` });
        const token = await getValidToken(platform);
        if (!token) throw new Error(`Not authenticated with ${platform}. Connect in Settings.`);

        broadcast('job:progress', { jobId: job.id, percent: 50, label: `Uploading to ${platform}...` });

        const { uploadToYouTube, uploadToTikTok, uploadToFacebook } = require('./upload');
        if      (platform === 'youtube')  await uploadToYouTube({ videoPath, title, description, tags });
        else if (platform === 'tiktok')   await uploadToTikTok({ videoPath, title });
        else if (platform === 'facebook') await uploadToFacebook({ videoPath, title, pageId });

        writeLog('info', 'jobs', `Posted to ${platform}`);
        broadcast('job:progress', { jobId: job.id, percent: 100, label: 'Upload complete' });

      } else {
        throw new Error('Unknown job type: ' + job.type);
      }

      await prisma.job.update({ where: { id: job.id }, data: { status: 'COMPLETED', error: null } });
      broadcast('job:statusChanged', { jobId: job.id, status: 'COMPLETED' });
      console.log(`[JobQueue] ✅ Job ${job.id} completed.`);

    } catch (jobError) {
      console.error(`[JobQueue] ❌ Job ${job.id} attempt ${attemptNumber} failed:`, jobError.message);

      const canRetry = attemptNumber < MAX_JOB_ATTEMPTS && !isNonRetryable(jobError.message);

      if (canRetry) {
        const retryDelay = RETRY_DELAYS_MS[attemptNumber] || 60_000;
        const nextRetryAt = new Date(Date.now() + retryDelay);
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: 'RETRY_PENDING',
            error: `Attempt ${attemptNumber} failed: ${jobError.message}. Retry in ${retryDelay / 1000}s.`,
            nextRetryAt,
          },
        });
        broadcast('job:statusChanged', { jobId: job.id, status: 'RETRY_PENDING', error: jobError.message, nextRetryAt });
        console.log(`[JobQueue] ⏳ Job ${job.id} scheduled for retry at ${nextRetryAt.toISOString()}`);
      } else {
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            error: `Gave up after ${attemptNumber} attempt(s): ${jobError.message}`,
          },
        });
        broadcast('job:statusChanged', { jobId: job.id, status: 'FAILED', error: jobError.message });
        console.log(`[JobQueue] 💀 Job ${job.id} permanently failed.`);
      }
    }
  } catch (systemError) {
    console.error('[JobQueue] System error:', systemError.message);
  }

  isProcessingQueue = false;
}

// ── IPC Handlers ─────────────────────────────────────────────────────────────

ipcMain.handle('job:enqueue', async (_, { type, payload, scheduledAt }) => {
  try {
    const job = await prisma.job.create({
      data: {
        type,
        payloadJson: JSON.stringify(payload),
        status: 'QUEUED',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });
    broadcast('job:statusChanged', { jobId: job.id, status: 'QUEUED', type });
    return { success: true, jobId: job.id };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('job:get', async (_, { jobId }) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    return { success: true, job };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

/** Get all jobs — optionally filtered by status, with pagination */
ipcMain.handle('job:getAll', async (_, { status, page = 1, pageSize = 50 } = {}) => {
  try {
    const where = status ? { status } : {};
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.job.count({ where }),
    ]);
    return { success: true, jobs, total };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

/** Retry a FAILED job by resetting it to QUEUED */
ipcMain.handle('job:retry', async (_, { jobId }) => {
  try {
    const job = await prisma.job.update({
      where: { id: jobId },
      data: { status: 'QUEUED', attempts: 0, error: null, nextRetryAt: null },
    });
    broadcast('job:statusChanged', { jobId: job.id, status: 'QUEUED' });
    return { success: true, job };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

/** Cancel a QUEUED or RETRY_PENDING job */
ipcMain.handle('job:cancel', async (_, { jobId }) => {
  try {
    await prisma.job.delete({ where: { id: jobId } });
    broadcast('job:statusChanged', { jobId, status: 'CANCELLED' });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Poll every 3 seconds; pick up RETRY_PENDING jobs when their timer expires
module.exports = { pollJobQueue: () => setInterval(processNextJob, 3000), prisma };
