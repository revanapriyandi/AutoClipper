/**
 * electron/handlers/jobs.js
 * 
 * Prisma-based async job queue with RETRY + BACKOFF:
 * - Jobs are retried up to MAX_JOB_ATTEMPTS times before marking FAILED
 * - Back-off delay grows between attempts: 5s → 30s → 2min
 * - Non-retryable errors (e.g. auth) are failed immediately
 */

const { ipcMain } = require('electron');
const { PrismaClient } = require('@prisma/client');
const keytar = require('keytar');
const { runVideoRender } = require('./render');
const { getValidToken } = require('./auth');
const { writeLog } = require('./logger');


const prisma = new PrismaClient();
const SERVICE_NAME = 'AutoClipperApp';

/** Max attempts before marking a job permanently FAILED */
const MAX_JOB_ATTEMPTS = 3;

/**
 * Delays between retry attempts (ms). Index = attempt number (1-based).
 * 1st fail → wait 5s, 2nd fail → wait 30s, 3rd fail → FAILED
 */
const RETRY_DELAYS_MS = [0, 5_000, 30_000, 120_000];

/**
 * Some errors are not retryable at all.
 * e.g. "Not authenticated" — no point retrying without user action.
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

let isProcessingQueue = false;

async function processNextJob() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    // Pick the next QUEUED job, or a FAILED job that is scheduled for retry
    const now = new Date();
    const job = await prisma.job.findFirst({
      where: {
        OR: [
          { status: 'QUEUED' },
          { status: 'RETRY_PENDING', nextRetryAt: { lte: now } },
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

    try {
      const payload = JSON.parse(job.payloadJson);

      if (job.type === 'RENDER') {
        await runVideoRender(payload);

      } else if (job.type === 'POST') {
        const { videoPath, title, description, tags, pageId, targetPlatform } = payload;
        let platform = '';
        if ((targetPlatform || '').includes('YouTube'))       platform = 'youtube';
        else if ((targetPlatform || '').includes('TikTok'))   platform = 'tiktok';
        else if ((targetPlatform || '').includes('Facebook')) platform = 'facebook';
        else platform = targetPlatform?.toLowerCase() || '';

        if (!platform) throw new Error('Unsupported platform: ' + targetPlatform);

        const token = await getValidToken(platform);
        if (!token) throw new Error(`Not authenticated with ${platform}. Connect in Settings.`);

        // Dynamic require to avoid circular dependency at module load time
        const { uploadToYouTube, uploadToTikTok, uploadToFacebook } = require('./upload');
        if      (platform === 'youtube')  await uploadToYouTube({ videoPath, title, description, tags });
        else if (platform === 'tiktok')   await uploadToTikTok({ videoPath, title });
        else if (platform === 'facebook') await uploadToFacebook({ videoPath, title, pageId });

        writeLog('info', 'jobs', `Posted to ${platform}`);

      } else {
        throw new Error('Unknown job type: ' + job.type);
      }

      // ✅ Success
      await prisma.job.update({ where: { id: job.id }, data: { status: 'COMPLETED', error: null } });
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
        console.log(`[JobQueue] ⏳ Job ${job.id} scheduled for retry at ${nextRetryAt.toISOString()}`);
      } else {
        // Permanently failed
        await prisma.job.update({
          where: { id: job.id },
          data: {
            status: 'FAILED',
            error: `Gave up after ${attemptNumber} attempt(s): ${jobError.message}`,
          },
        });
        console.log(`[JobQueue] 💀 Job ${job.id} permanently failed.`);
      }
    }
  } catch (systemError) {
    console.error('[JobQueue] System error:', systemError.message);
  }

  isProcessingQueue = false;
}

ipcMain.handle('job:enqueue', async (_, { type, payload }) => {
  try {
    const job = await prisma.job.create({ data: { type, payloadJson: JSON.stringify(payload), status: 'QUEUED' } });
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

// Poll every 3 seconds; pick up RETRY_PENDING jobs when their timer expires
module.exports = { pollJobQueue: () => setInterval(processNextJob, 3000), prisma };
