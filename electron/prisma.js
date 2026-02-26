const { app } = require('electron');
const path = require('path');
const fs = require('fs');

// In packaged app, Prisma client is at electron/prisma-client/ (inside app.asar).
// We need to resolve the correct library path for native binaries.
const isPackaged = app.isPackaged;

// Database path — in production: user's AppData, in dev: prisma/dev.db
const dbDir = isPackaged ? app.getPath('userData') : path.join(__dirname, '..', 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

// Copy seed DB to userData on first launch
if (isPackaged && !fs.existsSync(dbPath)) {
  try {
    // Try to copy a bundled seed DB if present
    const sourceDb = path.join(process.resourcesPath, 'prisma', 'dev.db');
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
    }
  } catch (err) {
    console.error('[Prisma] Error copying bundled DB:', err);
  }
}

// Set the library path for the Prisma query engine native binary
// so it can be found even when unpacked from ASAR
if (isPackaged) {
  const unpacked = path.join(process.resourcesPath, 'app.asar.unpacked');
  process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
    unpacked,
    'electron',
    'prisma-client',
    'libquery_engine-windows.dll.node' // Windows; other platforms handled below
  );
  // Override per-platform
  if (process.platform === 'darwin') {
    const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
      unpacked, 'electron', 'prisma-client',
      `libquery_engine-darwin-${arch}.dylib.node`
    );
  } else if (process.platform === 'linux') {
    process.env.PRISMA_QUERY_ENGINE_LIBRARY = path.join(
      unpacked, 'electron', 'prisma-client',
      'libquery_engine-debian-openssl-3.0.x.so.node'
    );
  }
}

// Require the Prisma client from the custom output path
// (relative to this file: electron/prisma-client)
const { PrismaClient } = require('./prisma-client');

const prisma = new PrismaClient({
  datasources: {
    db: { url: `file:${dbPath}` }
  }
});

module.exports = prisma;
