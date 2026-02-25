const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

// Menghindari konflik akses ASAR Read-Only pada environment produksi
const isPackaged = app.isPackaged;
const dbDir = isPackaged ? app.getPath('userData') : path.join(__dirname, '..', 'prisma');
const dbPath = path.join(dbDir, 'dev.db');

if (isPackaged && !fs.existsSync(dbPath)) {
  try {
    const sourceDb = path.join(process.resourcesPath, 'prisma', 'dev.db');
    if (fs.existsSync(sourceDb)) {
      fs.copyFileSync(sourceDb, dbPath);
    }
  } catch (err) {
    console.error('[Prisma] Fatal error copying bundled DB to userland:', err);
  }
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: `file:${dbPath}` }
  }
});

module.exports = prisma;
