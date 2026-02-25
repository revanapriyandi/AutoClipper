/**
 * electron/handlers/system.js
 * dialog:openFile / shell:showItemInFolder / shell:openExternal / file:readAsDataUrl
 */
const { ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.handle('dialog:openFile', async (_, { filters } = {}) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: filters || [{ name: 'Video Files', extensions: ['mp4', 'mov', 'avi', 'mkv', 'webm'] }],
  });
  if (result.canceled || !result.filePaths.length) return { success: false };
  return { success: true, filePath: result.filePaths[0] };
});

ipcMain.handle('shell:showItemInFolder', async (_, filePath) => {
  shell.showItemInFolder(filePath);
  return { success: true };
});

ipcMain.handle('shell:openExternal', async (_, url) => {
  await shell.openExternal(url);
  return { success: true };
});

ipcMain.handle('file:readAsDataUrl', async (_, filePath) => {
  try {
    const ext = path.extname(filePath).slice(1).toLowerCase();
    const mimeMap = { mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska', webm: 'video/webm' };
    const mime = mimeMap[ext] || 'video/mp4';
    const buffer = fs.readFileSync(filePath);
    return { success: true, dataUrl: `data:${mime};base64,${buffer.toString('base64')}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
