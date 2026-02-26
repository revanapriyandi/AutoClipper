/**
 * electron/main.js
 *
 * Entry point — BrowserWindow setup only.
 * All IPC handlers are in electron/handlers/*.js
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

// ── Environment & Database Path Setup (CRITICAL FOR PRODUCTION) ──
const isDev = !app.isPackaged;
const envPath = isDev
  ? path.join(__dirname, '../.env')
  : path.join(process.resourcesPath, '.env');
require('dotenv').config({ path: envPath });

// Electron userData is writable (e.g. AppData/Roaming/... or ~/.config/...)
const userDataPath = app.getPath('userData');
const dbFolder = path.join(userDataPath, 'db');
const targetDbPath = path.join(dbFolder, 'dev.db');

if (!require('fs').existsSync(dbFolder)) {
  require('fs').mkdirSync(dbFolder, { recursive: true });
}

// In production, if DB doesn't exist yet, copy the seeded one from package
if (!require('fs').existsSync(targetDbPath) && !isDev) {
  const sourceDbPath = path.join(__dirname, '../prisma/dev.db');
  if (require('fs').existsSync(sourceDbPath)) {
    require('fs').copyFileSync(sourceDbPath, targetDbPath);
  } else {
    console.error('Source DB not found at:', sourceDbPath);
  }
}

// Force Prisma to use this writable SQLite file dynamically!
process.env.DATABASE_URL = `file:${targetDbPath}`;

// ── Register all IPC handlers ──────────────────────────────────────────────

require('./handlers/keychain');
require('./handlers/system');
require('./handlers/ai');
require('./handlers/render');
require('./handlers/auth');
require('./handlers/upload');
require('./handlers/broll');
require('./handlers/caption');
require('./handlers/logger');
require('./handlers/facetrack');
require('./handlers/dubbing');            // Phase 5: Full ElevenLabs dubbing
const { checkOnStartup } = require('./handlers/updater');

require('./handlers/db');
require('./handlers/db_calendar_addon');  // Phase 6: Enhanced calendar
require('./handlers/db_theme_addon');
require('./handlers/db_analytics_addon');
require('./handlers/db_clipprofile_addon');
require('./handlers/ffmpeg');
require('./handlers/thumbnail');          // Phase 4: AI thumbnail generator
require('./handlers/insights');
require('./handlers/webhook');
require('./handlers/analytics_sync');     // Phase 2: Platform analytics sync
require('./handlers/compilation');        // Phase 7: Clip compilation

const { startAutopilotPoller } = require('./handlers/autopilot');        // Phase 3: Smart autopilot
const { pollJobQueue, prisma } = require('./handlers/jobs');             // Phase 1: Job queue
const { startAnalyticsSyncPoller } = require('./handlers/analytics_sync'); // Phase 2: Auto sync

// ── BrowserWindow ──────────────────────────────────────────────────────────

function createWindow() {
  const splashWindow = new BrowserWindow({
    width: 500,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html')).catch(err => {
      console.error('Failed to load out/index.html', err);
    });
  }

  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (!splashWindow.isDestroyed()) splashWindow.destroy();
      mainWindow.show();
      mainWindow.focus();
    }, 1500);
  });
}

app.whenReady().then(() => {
  createWindow();
  pollJobQueue();
  startAutopilotPoller();
  startAnalyticsSyncPoller(); // Phase 2: Start 6-hour analytics sync
  checkOnStartup();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', async () => {
  await prisma.$disconnect();
});
