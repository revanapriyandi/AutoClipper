/**
 * electron/main.js
 *
 * Entry point — BrowserWindow setup, app branding, native menu, tray icon.
 * All IPC handlers are in electron/handlers/*.js
 */

const { app, BrowserWindow, Menu, Tray, shell, dialog, nativeImage } = require('electron');
const path = require('path');

// ── App Identity ─────────────────────────────────────────────────────────────
app.setName('AutoClipper');

// ── Environment & Database Path Setup (CRITICAL FOR PRODUCTION) ───────────────
const isDev = !app.isPackaged;
const envPath = isDev
  ? path.join(__dirname, '../.env')
  : path.join(process.resourcesPath, '.env');
require('dotenv').config({ path: envPath });

const userDataPath = app.getPath('userData');
const dbFolder     = path.join(userDataPath, 'db');
const targetDbPath = path.join(dbFolder, 'dev.db');

if (!require('fs').existsSync(dbFolder)) {
  require('fs').mkdirSync(dbFolder, { recursive: true });
}

if (!require('fs').existsSync(targetDbPath) && !isDev) {
  const sourceDbPath = path.join(__dirname, '../prisma/dev.db');
  if (require('fs').existsSync(sourceDbPath)) {
    require('fs').copyFileSync(sourceDbPath, targetDbPath);
  }
}

process.env.DATABASE_URL = `file:${targetDbPath}`;

// ── Register all IPC handlers ─────────────────────────────────────────────────
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
require('./handlers/dubbing');
const { checkOnStartup } = require('./handlers/updater');

require('./handlers/db');
require('./handlers/db_calendar_addon');
require('./handlers/db_theme_addon');
require('./handlers/db_analytics_addon');
require('./handlers/db_clipprofile_addon');
require('./handlers/ffmpeg');
require('./handlers/thumbnail');
require('./handlers/insights');
require('./handlers/webhook');
require('./handlers/analytics_sync');
require('./handlers/compilation');

const { startAutopilotPoller }      = require('./handlers/autopilot');
const { pollJobQueue, prisma }       = require('./handlers/jobs');
const { startAnalyticsSyncPoller }  = require('./handlers/analytics_sync');

// ── Icon paths ────────────────────────────────────────────────────────────────
const ICON_PATH_WIN  = path.join(__dirname, '../build/icon.ico');
const ICON_PATH_PNG  = path.join(__dirname, '../build/icon.png');
const ICON_PATH      = process.platform === 'win32' ? ICON_PATH_WIN : ICON_PATH_PNG;

// ── Native Application Menu ───────────────────────────────────────────────────
function buildMenu(mainWindow) {
  const isMac = process.platform === 'darwin';

  const template = [
    // macOS: App menu
    ...(isMac ? [{
      label: 'AutoClipper',
      submenu: [
        { label: 'Tentang AutoClipper', role: 'about' },
        { type: 'separator' },
        { label: 'Sembunyikan AutoClipper', role: 'hide' },
        { label: 'Sembunyikan Lainnya',     role: 'hideOthers' },
        { label: 'Tampilkan Semua',         role: 'unhide' },
        { type: 'separator' },
        { label: 'Keluar AutoClipper',      role: 'quit' },
      ],
    }] : []),

    // File
    {
      label: 'File',
      submenu: [
        {
          label: 'Tambah Video Baru',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:newProject'),
        },
        { type: 'separator' },
        {
          label: 'Pengaturan',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow.webContents.send('menu:openSettings'),
        },
        { type: 'separator' },
        isMac ? { label: 'Tutup Jendela', role: 'close' } : { label: 'Keluar', role: 'quit' },
      ],
    },

    // Edit
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo',  role: 'undo',  accelerator: 'CmdOrCtrl+Z' },
        { label: 'Redo',  role: 'redo',  accelerator: 'Shift+CmdOrCtrl+Z' },
        { type: 'separator' },
        { label: 'Cut',   role: 'cut' },
        { label: 'Copy',  role: 'copy' },
        { label: 'Paste', role: 'paste' },
        { label: 'Pilih Semua', role: 'selectAll' },
      ],
    },

    // View
    {
      label: 'Tampilan',
      submenu: [
        {
          label: 'Dashboard',
          accelerator: 'CmdOrCtrl+1',
          click: () => mainWindow.webContents.send('menu:navigate', '/'),
        },
        {
          label: 'Autopilot',
          accelerator: 'CmdOrCtrl+2',
          click: () => mainWindow.webContents.send('menu:navigate', '/autopilot'),
        },
        {
          label: 'Kalender',
          accelerator: 'CmdOrCtrl+3',
          click: () => mainWindow.webContents.send('menu:navigate', '/calendar'),
        },
        {
          label: 'Analitik',
          accelerator: 'CmdOrCtrl+4',
          click: () => mainWindow.webContents.send('menu:navigate', '/analytics'),
        },
        {
          label: 'Job Queue',
          accelerator: 'CmdOrCtrl+5',
          click: () => mainWindow.webContents.send('menu:navigate', '/jobs'),
        },
        { type: 'separator' },
        { label: 'Perkecil', role: 'minimize' },
        { label: 'Perbesar', role: 'zoom' },
        { type: 'separator' },
        { label: 'Reload', role: 'reload', visible: isDev },
        { label: 'Dev Tools', role: 'toggleDevTools', visible: isDev },
      ],
    },

    // Bantuan
    {
      label: 'Bantuan',
      submenu: [
        {
          label: 'Dokumentasi',
          click: () => shell.openExternal('https://github.com/revanapriyandi/AutoClipper#readme'),
        },
        {
          label: 'Laporkan Bug',
          click: () => shell.openExternal('https://github.com/revanapriyandi/AutoClipper/issues'),
        },
        { type: 'separator' },
        {
          label: 'Tentang AutoClipper',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'AutoClipper',
              message: 'AutoClipper',
              detail: `Versi: ${app.getVersion()}\nElectron: ${process.versions.electron}\nNode: ${process.versions.node}\n\nAI-powered video clipper & social publisher.\n© 2024 revanapriyandi`,
              icon: nativeImage.createFromPath(ICON_PATH_PNG),
              buttons: ['OK'],
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ── System Tray ───────────────────────────────────────────────────────────────
let tray = null;

function createTray(mainWindow) {
  // Tray icon harus 16×16 (Windows) atau 22×22 (Linux/Mac)
  const trayIcon = nativeImage.createFromPath(ICON_PATH_PNG).resize({ width: 16, height: 16 });
  tray = new Tray(trayIcon);
  tray.setToolTip('AutoClipper');

  const trayMenu = Menu.buildFromTemplate([
    {
      label: 'Buka AutoClipper',
      click: () => { mainWindow.show(); mainWindow.focus(); },
    },
    { type: 'separator' },
    {
      label: 'Autopilot',
      click: () => { mainWindow.show(); mainWindow.webContents.send('menu:navigate', '/autopilot'); },
    },
    {
      label: 'Job Queue',
      click: () => { mainWindow.show(); mainWindow.webContents.send('menu:navigate', '/jobs'); },
    },
    { type: 'separator' },
    { label: 'Keluar', click: () => { app.isQuitting = true; app.quit(); } },
  ]);

  tray.setContextMenu(trayMenu);

  // Double-click tray icon → restore window
  tray.on('double-click', () => { mainWindow.show(); mainWindow.focus(); });
}

// ── BrowserWindow ─────────────────────────────────────────────────────────────
function createWindow() {
  // Splash screen
  const splashWindow = new BrowserWindow({
    width: 500,
    height: 350,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    icon: ICON_PATH,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));

  // Main window
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    title: 'AutoClipper',
    icon: ICON_PATH,
    backgroundColor: '#09090b',   // Match app dark bg → avoids white flash
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      spellcheck: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html')).catch(err => {
      console.error('Failed to load out/index.html', err);
    });
  }

  // Build native menu & tray after window exists
  buildMenu(mainWindow);
  createTray(mainWindow);

  // Show window after splash
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      if (!splashWindow.isDestroyed()) splashWindow.destroy();
      mainWindow.show();
      mainWindow.focus();
    }, 1500);
  });

  // Minimize to tray instead of closing (Windows/Linux)
  mainWindow.on('close', (event) => {
    if (!app.isQuitting && process.platform !== 'darwin') {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  pollJobQueue();
  startAutopilotPoller();
  startAnalyticsSyncPoller();
  checkOnStartup();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', async () => {
  await prisma.$disconnect();
});
