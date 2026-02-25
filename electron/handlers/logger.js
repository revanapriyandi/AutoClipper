/**
 * electron/handlers/logger.js
 *
 * File-based error logging with:
 * - Toggle on/off (user preference via keytar)
 * - Daily log rotation (max 7 files kept)
 * - IPC: logger:getLogs, logger:clearLogs, logger:setEnabled
 */
const { ipcMain } = require('electron');
const fs   = require('fs');
const path = require('path');
const os   = require('os');
const keytar = require('keytar');

const SERVICE_NAME = 'AutoClipperApp';
const LOG_DIR = path.join(os.homedir(), '.autoclipper', 'logs');
const MAX_LOG_FILES = 7;

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

// ── Helpers ──────────────────────────────────────────────────────

function todayLogPath() {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(LOG_DIR, `autoclipper-${date}.log`);
}

function rotateLogs() {
  try {
    const files = fs.readdirSync(LOG_DIR)
      .filter(f => f.endsWith('.log'))
      .sort()                          // Oldest first
      .reverse();                      // Newest first
    // Delete files beyond MAX_LOG_FILES
    for (const old of files.slice(MAX_LOG_FILES)) {
      fs.unlinkSync(path.join(LOG_DIR, old));
    }
  } catch {}
}

let loggingEnabled = true; // In-memory cache

async function isLoggingEnabled() {
  const val = await keytar.getPassword(SERVICE_NAME, 'logging_enabled');
  loggingEnabled = val !== 'false';
  return loggingEnabled;
}

/**
 * Write a structured log line to today's log file.
 * Called from the main process and IPC.
 */
function writeLog(level, source, message, extra = {}) {
  if (!loggingEnabled) return;
  try {
    const line = JSON.stringify({
      ts: new Date().toISOString(),
      level,      // 'info' | 'warn' | 'error'
      source,     // e.g. 'ai', 'render', 'upload'
      message,
      ...extra,
    }) + '\n';
    fs.appendFileSync(todayLogPath(), line, 'utf8');
  } catch {}
}

// ── IPC Handlers ─────────────────────────────────────────────────

// Toggle logging on/off
ipcMain.handle('logger:setEnabled', async (_, enabled) => {
  await keytar.setPassword(SERVICE_NAME, 'logging_enabled', String(enabled));
  loggingEnabled = enabled;
  return { success: true, enabled };
});

// Check current status
ipcMain.handle('logger:getEnabled', async () => {
  const enabled = await isLoggingEnabled();
  return { success: true, enabled };
});

// Get last N lines from all logs (newest first)
ipcMain.handle('logger:getLogs', async (_, { lines = 200 } = {}) => {
  try {
    const files = fs.readdirSync(LOG_DIR)
      .filter(f => f.endsWith('.log'))
      .sort().reverse();              // Latest files first

    const allLines = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(LOG_DIR, file), 'utf8');
      const parsed = content.trim().split('\n').reverse().map(l => {
        try { return JSON.parse(l); } catch { return null; }
      }).filter(Boolean);
      allLines.push(...parsed);
      if (allLines.length >= lines) break;
    }

    return { success: true, logs: allLines.slice(0, lines), logDir: LOG_DIR };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Clear all logs
ipcMain.handle('logger:clearLogs', async () => {
  try {
    const files = fs.readdirSync(LOG_DIR).filter(f => f.endsWith('.log'));
    for (const f of files) fs.unlinkSync(path.join(LOG_DIR, f));
    return { success: true, cleared: files.length };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Auto-rotate on startup
rotateLogs();
// Preload enabled state
isLoggingEnabled();

module.exports = { writeLog };
