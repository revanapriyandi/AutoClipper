// Minimal preload for splash window — exposes only status listener
const { ipcRenderer, contextBridge } = require('electron');
contextBridge.exposeInMainWorld('splashAPI', {
  onStatus: (cb) => ipcRenderer.on('splash:status', (_e, msg) => cb(msg)),
});
