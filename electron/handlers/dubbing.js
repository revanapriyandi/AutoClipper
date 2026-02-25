const { ipcMain } = require('electron');
const keytar = require('keytar');

const SERVICE_NAME = 'AutoClipperApp';

let dubbingEnabled = false; // In-memory cache

async function isDubbingEnabled() {
  const val = await keytar.getPassword(SERVICE_NAME, 'dubbing_enabled');
  dubbingEnabled = val === 'true'; // Default is false because it relates to external paid API
  return dubbingEnabled;
}

// ── IPC Handlers ─────────────────────────────────────────────────

// Toggle dubbing on/off
ipcMain.handle('dubbing:setEnabled', async (_, enabled) => {
  await keytar.setPassword(SERVICE_NAME, 'dubbing_enabled', String(enabled));
  dubbingEnabled = enabled;
  return { success: true, enabled };
});

// Check current status
ipcMain.handle('dubbing:getEnabled', async () => {
  const enabled = await isDubbingEnabled();
  return { success: true, enabled };
});

// Preload enabled state
isDubbingEnabled();

module.exports = { isDubbingEnabled, dubbingEnabled };
