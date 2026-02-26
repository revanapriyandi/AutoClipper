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
  dbGetScheduledJobs:  ()          => ipcRenderer.invoke('db:getScheduledJobs'),
  // Autopilot
  autopilotGetConfig:  ()          => ipcRenderer.invoke('autopilot:getConfig'),
  autopilotSaveConfig: (data)      => ipcRenderer.invoke('autopilot:saveConfig', data),
  autopilotToggle:     (active)    => ipcRenderer.invoke('autopilot:toggle', active),
  autopilotRunNow:     ()          => ipcRenderer.invoke('autopilot:runNow'),

  
  dbGetThemePresets:   ()          => ipcRenderer.invoke('db:getThemePresets'),
  dbCreateThemePreset: (data)      => ipcRenderer.invoke('db:createThemePreset', data),
  dbDeleteThemePreset: (id)        => ipcRenderer.invoke('db:deleteThemePreset', id),

  dbGetAnalytics:      ()          => ipcRenderer.invoke('db:getAnalytics'),
  dbUpdateAnalytics:   (data)      => ipcRenderer.invoke('db:updateAnalytics', data),
  // System

  openFilePicker:      (filters)   => ipcRenderer.invoke('dialog:openFile', { filters }),
  openDirectoryPicker: (opts)      => ipcRenderer.invoke('dialog:openDirectory', opts || {}),
  storageDirsGet:      ()          => ipcRenderer.invoke('storage:getDirs'),
  storageDirsSet:      (cat, dir)  => ipcRenderer.invoke('storage:setDir', { category: cat, dirPath: dir }),

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
  facetrackSetEnabled: (enabled) => ipcRenderer.invoke('facetrack:setEnabled', enabled),
  facetrackGetEnabled: ()        => ipcRenderer.invoke('facetrack:getEnabled'),
  facetrackDetect:     (opts)    => ipcRenderer.invoke('facetrack:detect', opts),
  
  // AI Dubbing
  dubbingSetEnabled:   (enabled) => ipcRenderer.invoke('dubbing:setEnabled', enabled),
  dubbingGetEnabled:   ()        => ipcRenderer.invoke('dubbing:getEnabled'),
  
  // FFmpeg
  ffmpegCheckInstallation: ()    => ipcRenderer.invoke('ffmpeg:checkInstallation'),
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
  // F5: Thumbnail generation & SRT export
  generateThumbnail: (opts)  => ipcRenderer.invoke('thumbnail:generate', opts),
  exportSrt:         (opts)  => ipcRenderer.invoke('export:srt', opts),
  // F11: AI insights
  insightsAnalyze:   (data)  => ipcRenderer.invoke('insights:analyze', data),
  // F16: Clip Profiles
  dbGetClipProfiles:    ()       => ipcRenderer.invoke('db:getClipProfiles'),
  dbCreateClipProfile:  (data)   => ipcRenderer.invoke('db:createClipProfile', data),
  dbDeleteClipProfile:  (id)     => ipcRenderer.invoke('db:deleteClipProfile', id),
  // F3: Project tags
  dbUpdateProjectTags:  (data)   => ipcRenderer.invoke('db:updateProjectTags', data),
  // F13: Batch render
  renderBatch:          (jobs)   => ipcRenderer.invoke('render:batch', jobs),
  // F19: Webhook
  webhookGetConfig:  ()         => ipcRenderer.invoke('webhook:getConfig'),
  webhookSetConfig:  (data)     => ipcRenderer.invoke('webhook:setConfig', data),
  webhookSend:       (data)     => ipcRenderer.invoke('webhook:send', data),
});

