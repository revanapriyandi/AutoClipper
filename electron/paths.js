/**
 * electron/paths.js
 *
 * Centralized helper to resolve configurable storage directories.
 * Handlers call `getDir('clips')` etc. — the user's custom setting is
 * respected if configured, otherwise the default inside userData is used.
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const prisma = require('./prisma');

const DEFAULTS = {
  clips:        path.join(app.getPath('userData'), 'clips'),
  brollCache:   path.join(app.getPath('userData'), 'broll-cache'),
  autopilot:    path.join(app.getPath('userData'), 'autopilot-downloads'),
};

const DB_KEYS = {
  clips:      'dir_clips',
  brollCache: 'dir_broll_cache',
  autopilot:  'dir_autopilot',
};

/**
 * Get the effective directory for a given category.
 * Falls back to the default if no custom path is set in the DB.
 */
async function getDir(category) {
  const key = DB_KEYS[category];
  if (!key) throw new Error(`Unknown directory category: ${category}`);

  try {
    const row = await prisma.settings.findUnique({ where: { key } });
    const dir = (row?.value?.trim()) ? row.value.trim() : DEFAULTS[category];
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  } catch {
    // On DB error fall back to default safely
    const dir = DEFAULTS[category];
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    return dir;
  }
}

/**
 * Save a custom directory path to the DB.
 */
async function setDir(category, dirPath) {
  const key = DB_KEYS[category];
  if (!key) throw new Error(`Unknown directory category: ${category}`);
  await prisma.settings.upsert({
    where: { key },
    update: { value: dirPath },
    create: { key, value: dirPath },
  });
}

/**
 * Get the configured defaults/current values for all categories (for the settings UI).
 */
async function getAllDirs() {
  const result = {};
  for (const [cat, key] of Object.entries(DB_KEYS)) {
    const row = await prisma.settings.findUnique({ where: { key } });
    result[cat] = {
      current: row?.value?.trim() || '',
      default: DEFAULTS[cat],
    };
  }
  return result;
}

module.exports = { getDir, setDir, getAllDirs, DEFAULTS, DB_KEYS };
