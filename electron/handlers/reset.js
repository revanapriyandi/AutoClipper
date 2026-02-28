/**
 * electron/handlers/reset.js
 *
 * App Reset — bersihkan data via Prisma deleteMany (bukan hapus file DB),
 * bersihkan API keys dari keytar, dan restart app.
 */

const { ipcMain, app } = require('electron');
const path = require('path');
const fs = require('fs');

const KEYTAR_SERVICE = 'AutoClipper';

const KEYTAR_ACCOUNTS = [
  'openai', 'gemini', 'claude', 'groq', 'mistral', 'cohere',
  'elevenlabs', 'deepgram', 'assemblyai',
  'google_client_id', 'google_client_secret',
  'tiktok_client_key', 'tiktok_client_secret',
  'facebook_app_id', 'facebook_app_secret',
  'pexels', 'supabase_url', 'supabase_anon_key',
  'database_url', 'elevenlabs_voice_id',
];

ipcMain.handle('app:reset', async (_, { resetDb = true, resetKeys = true, resetSettings = true } = {}) => {
  try {
    let keytar;
    try { keytar = require('keytar'); } catch (_) { keytar = null; }

    // 1. Hapus API keys dari keytar
    if (resetKeys && keytar) {
      await Promise.allSettled(
        KEYTAR_ACCOUNTS.map(account => keytar.deletePassword(KEYTAR_SERVICE, account))
      );
      console.log('[Reset] API keys cleared from keychain.');
    }

    // 2. Bersihkan data database via Prisma deleteMany (tidak hapus file DB)
    if (resetDb) {
      const prisma = require('../prisma');
      try {
        // Hapus dalam urutan yang benar (child tables first due to FK constraints)
        await prisma.reviewLink.deleteMany();
        await prisma.autopilotHistory.deleteMany();
        await prisma.autopilotConfig.deleteMany();
        await prisma.settings.deleteMany();
        await prisma.analytics.deleteMany();
        await prisma.themePreset.deleteMany();
        await prisma.job.deleteMany();
        await prisma.asset.deleteMany();
        await prisma.clip.deleteMany();
        await prisma.clipCandidate.deleteMany();
        await prisma.transcript.deleteMany();
        await prisma.clipProfile.deleteMany();
        await prisma.project.deleteMany();
        await prisma.brandKit.deleteMany();
        await prisma.workspace.deleteMany();
        console.log('[Reset] All database records cleared.');
      } catch (dbErr) {
        console.error('[Reset] DB clear error (non-fatal):', dbErr.message);
      }
    }

    // 3. Reset app settings (config JSON)
    if (resetSettings) {
      const userDataDir = app.getPath('userData');
      for (const configFile of ['config.json', 'storage-dirs.json', 'autopilot-config.json', 'logger.json']) {
        const p = path.join(userDataDir, configFile);
        if (fs.existsSync(p)) {
          fs.unlinkSync(p);
          console.log('[Reset] Config deleted:', p);
        }
      }
    }

    console.log('[Reset] App reset complete — restarting...');

    // 4. Restart app
    app.relaunch();
    app.exit(0);

    return { success: true };
  } catch (err) {
    console.error('[Reset] Error during reset:', err);
    return { success: false, error: err.message };
  }
});
