const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Secure Storage
  setKey:              (account, password) => ipcRenderer.invoke('keytar:set',  { account, password }),
  getKey:              (account)           => ipcRenderer.invoke('keytar:get',  { account }),
  deleteKey:           (account)           => ipcRenderer.invoke('keytar:delete', { account }),
  // DB (Prisma direct from isolated main process)
  dbCreateProject:     (opts)      => ipcRenderer.invoke('db:createProject', opts),
  dbGetProjects:       ()          => ipcRenderer.invoke('db:getProjects'),
  dbGetProject:        (id)        => ipcRenderer.invoke('db:getProject', id),
  dbGetClipHistory:    ()          => ipcRenderer.invoke('db:getClipHistory'),
  // System

  openFilePicker:      (filters)   => ipcRenderer.invoke('dialog:openFile', { filters }),
  showItemInFolder:    (filePath)  => ipcRenderer.invoke('shell:showItemInFolder', filePath),
  openExternal:        (url)       => ipcRenderer.invoke('shell:openExternal', url),
  readVideoAsDataUrl:  (filePath)  => ipcRenderer.invoke('file:readAsDataUrl', filePath),
  // AI
  aiGetConfig:         ()                         => ipcRenderer.invoke('ai:getConfig'),
  aiTranscribe:        (videoPath, deepgramKey)   => ipcRenderer.invoke('ai:transcribe', { videoPath, deepgramKey }),
  aiScore:             (promptText, provider)     => ipcRenderer.invoke('ai:score', { promptText, provider }),
  // Rendering
  renderClip:          (options) => ipcRenderer.invoke('render:clip', options),
  uploadVideo:         (opts)    => ipcRenderer.invoke('upload:video', opts),
  // B-Roll
  brollSearch:         (opts)    => ipcRenderer.invoke('broll:search', opts),
  brollDownload:       (opts)    => ipcRenderer.invoke('broll:download', opts),
  brollListCache:      ()        => ipcRenderer.invoke('broll:listCache'),
  brollClearCache:     ()        => ipcRenderer.invoke('broll:clearCache'),
  // Caption
  captionGenerate:     (opts)    => ipcRenderer.invoke('caption:generate', opts),
  // Logging
  loggerSetEnabled:    (en)      => ipcRenderer.invoke('logger:setEnabled', en),
  loggerGetEnabled:    ()        => ipcRenderer.invoke('logger:getEnabled'),
  loggerGetLogs:       (opts)    => ipcRenderer.invoke('logger:getLogs', opts),
  loggerClearLogs:     ()        => ipcRenderer.invoke('logger:clearLogs'),
  // Auto-Update
  updaterSetEnabled:   (en)      => ipcRenderer.invoke('updater:setEnabled', en),
  updaterGetEnabled:   ()        => ipcRenderer.invoke('updater:getEnabled'),
  updaterCheckNow:     ()        => ipcRenderer.invoke('updater:checkNow'),
  updaterDownload:     ()        => ipcRenderer.invoke('updater:download'),
  updaterInstallNow:   ()        => ipcRenderer.invoke('updater:installNow'),
  onUpdaterStatus: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('updater:status', handler);
    return () => ipcRenderer.removeListener('updater:status', handler);
  },
  // Face Tracking
  facetrackSetEnabled: (en)      => ipcRenderer.invoke('facetrack:setEnabled', en),
  facetrackGetEnabled: ()        => ipcRenderer.invoke('facetrack:getEnabled'),
  facetrackDetect:     (opts)    => ipcRenderer.invoke('facetrack:detect', opts),
  // Jobs
  enqueueJob:          (type, payload) => ipcRenderer.invoke('job:enqueue', { type, payload }),
  getJob:              (jobId)         => ipcRenderer.invoke('job:get', { jobId }),
  // OAuth
  authLogin:           (provider) => ipcRenderer.invoke('auth:login', provider),
  authStatus:          (provider) => ipcRenderer.invoke('auth:status', provider),
  // ── Push events (renderer subscribes) ──────────────────────
  onRenderProgress: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('render:progress', handler);
    return () => ipcRenderer.removeListener('render:progress', handler);
  },
  onNotification: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('app:notification', handler);
    return () => ipcRenderer.removeListener('app:notification', handler);
  },
});

