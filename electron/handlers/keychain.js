/**
 * electron/handlers/keychain.js
 * keytar:set / keytar:get / keytar:delete IPC handlers
 */
const { ipcMain } = require('electron');
const keytar = require('keytar');
const SERVICE_NAME = 'AutoClipperApp';

ipcMain.handle('keytar:set', async (_, { account, password }) => {
  try {
    await keytar.setPassword(SERVICE_NAME, account, password);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('keytar:get', async (_, { account }) => {
  try {
    const value = await keytar.getPassword(SERVICE_NAME, account);
    return { success: true, value };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('keytar:delete', async (_, { account }) => {
  try {
    const result = await keytar.deletePassword(SERVICE_NAME, account);
    return { success: result };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
