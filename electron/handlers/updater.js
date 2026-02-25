/**
 * electron/handlers/updater.js
 *
 * Auto-updater using electron-updater with user toggle.
 * Checks for updates from GitHub Releases.
 * 
 * Setup requirements (in package.json "build"):
 *   "publish": { "provider": "github", "owner": "yourname", "repo": "AutoClipper" }
 *
 * User can toggle auto-update check on/off in Settings.
 */
const { ipcMain, BrowserWindow } = require('electron');
const keytar = require('keytar');

const SERVICE_NAME = 'AutoClipperApp';

// ── Broadcast to all renderer windows ────────────────────────────
function broadcast(channel, data) {
  BrowserWindow.getAllWindows().forEach(win => {
    if (!win.isDestroyed()) win.webContents.send(channel, data);
  });
}

// ── Lazy-load electron-updater to avoid crash if not installed ────
let autoUpdater = null;
function getUpdater() {
  if (autoUpdater) return autoUpdater;
  try {
    autoUpdater = require('electron-updater').autoUpdater;
    autoUpdater.autoDownload    = false; // Always ask user before downloading
    autoUpdater.autoInstallOnAppQuit = true;

    autoUpdater.on('checking-for-update', () =>
      broadcast('updater:status', { status: 'checking' }));

    autoUpdater.on('update-available', info =>
      broadcast('updater:status', { status: 'available', version: info.version, releaseNotes: info.releaseNotes }));

    autoUpdater.on('update-not-available', () =>
      broadcast('updater:status', { status: 'up-to-date' }));

    autoUpdater.on('error', err => {
      console.error('[Updater] Error:', err.message);
      broadcast('updater:status', { status: 'error', error: err.message });
    });

    autoUpdater.on('download-progress', progress =>
      broadcast('updater:status', { status: 'downloading', percent: Math.round(progress.percent) }));

    autoUpdater.on('update-downloaded', info =>
      broadcast('updater:status', { status: 'ready', version: info.version }));

    return autoUpdater;
  } catch {
    console.warn('[Updater] electron-updater not installed. Run: npm i electron-updater');
    return null;
  }
}

// ── Check if user has enabled auto-update ────────────────────────
async function isAutoUpdateEnabled() {
  const val = await keytar.getPassword(SERVICE_NAME, 'auto_update_enabled');
  return val !== 'false'; // Default: ON
}

// ── Run update check on startup (respects user toggle) ───────────
async function checkOnStartup() {
  const enabled = await isAutoUpdateEnabled();
  if (!enabled) return;
  const updater = getUpdater();
  if (updater) {
    setTimeout(() => updater.checkForUpdates().catch(() => {}), 5000); // Delay 5s after startup
  }
}

// ── IPC Handlers ─────────────────────────────────────────────────

ipcMain.handle('updater:setEnabled', async (_, enabled) => {
  await keytar.setPassword(SERVICE_NAME, 'auto_update_enabled', String(enabled));
  return { success: true, enabled };
});

ipcMain.handle('updater:getEnabled', async () => {
  const enabled = await isAutoUpdateEnabled();
  return { success: true, enabled };
});

ipcMain.handle('updater:checkNow', async () => {
  const updater = getUpdater();
  if (!updater) return { success: false, error: 'electron-updater not installed.' };
  try {
    await updater.checkForUpdates();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('updater:download', async () => {
  const updater = getUpdater();
  if (!updater) return { success: false, error: 'electron-updater not installed.' };
  try {
    await updater.downloadUpdate();
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('updater:installNow', () => {
  const updater = getUpdater();
  if (updater) updater.quitAndInstall(false, true);
  return { success: true };
});

module.exports = { checkOnStartup };
