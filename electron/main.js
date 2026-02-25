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
    console.error("Source DB not found at:", sourceDbPath);
  }
}


// Force Prisma to use this writable SQLite file dynamically!
process.env.DATABASE_URL = `file:${targetDbPath}`;

// ── Register all IPC handlers ──────────────────────────────────────

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
const { checkOnStartup } = require('./handlers/updater');

require('./handlers/db');

const { pollJobQueue, prisma } = require('./handlers/jobs');


// ── BrowserWindow ──────────────────────────────────────────────────

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  pollJobQueue();
  checkOnStartup(); // Check for updates on startup (respects user toggle)

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
