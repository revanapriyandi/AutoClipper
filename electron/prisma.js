const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');

// ─────────────────────────────────────────────────────────────
// Database path — in production: user's AppData, in dev: prisma/dev.db
// ─────────────────────────────────────────────────────────────
const isPackaged = app.isPackaged;
const dbDir = isPackaged ? app.getPath('userData') : path.join(__dirname, '..', 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

// Copy seed DB to userData on first launch (packaged only)
if (isPackaged && !fs.existsSync(dbPath)) {
  try {
    const sourceDb = path.join(process.resourcesPath, 'prisma', 'dev.db');
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
      console.log('[Prisma] Seeded initial database from bundle.');
    }
  } catch (err) {
    console.error('[Prisma] Error copying bundled DB:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// Auto-push schema if DB is fresh/empty (e.g. after a reset that
// deleted the file, or on first dev run).
// ─────────────────────────────────────────────────────────────
function ensureSchema() {
  try {
    global.splashStatus?.('Memeriksa database...');
    const Database = require('better-sqlite3');
    const db = new Database(dbPath);
    const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='Job'`).get();
    db.close();
    if (!row) {
      global.splashStatus?.('Mengerjakan skema database...');
      console.log('[Prisma] Tables missing — running prisma db push...');
      const { execSync } = require('child_process');
      const projectRoot = path.join(__dirname, '..');
      execSync('npx prisma db push', {
        cwd: projectRoot,
        env: { ...process.env, DATABASE_URL: 'file:' + dbPath.replace(/\\/g, '/') },
        stdio: 'pipe',
        shell: true,
      });
      global.splashStatus?.('Skema database siap!');
      console.log('[Prisma] Schema pushed successfully.');
    }
  } catch (err) {
    console.error('[Prisma] ensureSchema error (non-fatal):', err.message);
  }
}

ensureSchema();

// ─────────────────────────────────────────────────────────────
// Prisma v7 uses Driver Adapters.
// @prisma/adapter-better-sqlite3 accepts a `file:` URL string.
// ─────────────────────────────────────────────────────────────
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('./prisma-client');

// Normalize to forward slashes and build a file: URL
const dbUrl = 'file:' + dbPath.replace(/\\/g, '/');
console.log('[Prisma] Connecting to SQLite at:', dbUrl);

global.splashStatus?.('Menghubungkan ke database...');
const adapter = new PrismaBetterSqlite3({ url: dbUrl });
const client = new PrismaClient({ adapter });

console.log('[Prisma] PrismaClient initialized successfully.');
global.splashStatus?.('Database terhubung!');

// Export the client as default, and also expose dbPath for schema repair
module.exports = client;
module.exports.dbPath = dbPath;
