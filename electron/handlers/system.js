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

ipcMain.handle('dialog:openDirectory', async (_, { title } = {}) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'],
    title: title || 'Select Folder',
  });
  if (result.canceled || !result.filePaths.length) return { success: false };
  return { success: true, dirPath: result.filePaths[0] };
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
    const mimeMap = { 
      mp4: 'video/mp4', mov: 'video/quicktime', avi: 'video/x-msvideo', mkv: 'video/x-matroska', webm: 'video/webm',
      mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg'
    };
    const mime = mimeMap[ext] || 'application/octet-stream';
    const buffer = fs.readFileSync(filePath);
    return { success: true, dataUrl: `data:${mime};base64,${buffer.toString('base64')}` };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

const { getAllDirs, setDir } = require('../paths');

ipcMain.handle('storage:getDirs', async () => {
  try {
    const dirs = await getAllDirs();
    return { success: true, dirs };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('storage:setDir', async (_, { category, dirPath }) => {
  try {
    await setDir(category, dirPath);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
