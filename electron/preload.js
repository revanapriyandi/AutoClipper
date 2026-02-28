const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Secure Storage ──────────────────────────────────────────────────────────
  setKey:              (account, password) => ipcRenderer.invoke('keytar:set',  { account, password }),
  getKey:              (account)           => ipcRenderer.invoke('keytar:get',  { account }),
  deleteKey:           (account)           => ipcRenderer.invoke('keytar:delete', { account }),
  
  // ── Environment ─────────────────────────────────────────────────────────────
  envSetDatabaseUrl:   (url)               => ipcRenderer.invoke('env:setDatabaseUrl', url),
  envGetDatabaseUrl:   ()                  => ipcRenderer.invoke('env:getDatabaseUrl'),

  // ── Database ────────────────────────────────────────────────────────────────
  // ── Database ────────────────────────────────────────────────────────────────
  dbCreateProject:     (title, sourcePath) => ipcRenderer.invoke('db:createProject', { title, sourcePath }),
  dbGetProjects:       ()          => ipcRenderer.invoke('db:getProjects'),
  dbGetProject:        (id)        => ipcRenderer.invoke('db:getProject', id),
  dbGetClipHistory:    ()          => ipcRenderer.invoke('db:getClipHistory'),
  dbDeleteProject:     (id)        => ipcRenderer.invoke('db:deleteProject', id),
  dbSaveProjectClips:  (data)      => ipcRenderer.invoke('db:saveProjectClips', data),
  dbGetProjectClips:   (projectId) => ipcRenderer.invoke('db:getProjectClips', projectId),
  dbUpdateClipChunks:  (data)      => ipcRenderer.invoke('db:updateClipChunks', data),
  dbAddLog:            (data)      => ipcRenderer.invoke('db:addLog', data),
  dbGetLogs:           (opts)      => ipcRenderer.invoke('db:getLogs', opts),
  
  // ── Video Downloader ────────────────────────────────────────────────────────
  downloadVideoUrl:    (url)       => ipcRenderer.invoke('app:download-url', url),
  onDownloadProgress:  (callback)  => {
    // Remove existing listeners to prevent duplicates
    ipcRenderer.removeAllListeners('download:progress');
    ipcRenderer.on('download:progress', (event, percent) => callback(percent));
  },
  
  // Workspaces & Brand Kits
  dbGetWorkspaces:     ()          => ipcRenderer.invoke('db:getWorkspaces'),
  dbCreateBrandKit:    (data)      => ipcRenderer.invoke('db:createBrandKit', data),
  dbUpdateBrandKit:    (data)      => ipcRenderer.invoke('db:updateBrandKit', data),
  dbDeleteBrandKit:    (id)        => ipcRenderer.invoke('db:deleteBrandKit', id),
  brandUploadAsset:    (data)      => ipcRenderer.invoke('brand:uploadAsset', data),

  // ── Autopilot ───────────────────────────────────────────────────────────────
  autopilotGetConfig:  ()          => ipcRenderer.invoke('autopilot:getConfig'),
  autopilotSaveConfig: (data)      => ipcRenderer.invoke('autopilot:saveConfig', data),
  autopilotToggle:     (active)    => ipcRenderer.invoke('autopilot:toggle', active),
  autopilotRunNow:     ()          => ipcRenderer.invoke('autopilot:runNow'),
  autopilotGetHistory: ()          => ipcRenderer.invoke('autopilot:getHistory'),

  // ── Theme Presets ───────────────────────────────────────────────────────────
  dbGetThemePresets:   ()          => ipcRenderer.invoke('db:getThemePresets'),
  dbCreateThemePreset: (data)      => ipcRenderer.invoke('db:createThemePreset', data),
  dbDeleteThemePreset: (id)        => ipcRenderer.invoke('db:deleteThemePreset', id),

  // ── Analytics ───────────────────────────────────────────────────────────────
  dbGetAnalytics:      ()          => ipcRenderer.invoke('db:getAnalytics'),
  dbUpdateAnalytics:   (data)      => ipcRenderer.invoke('db:updateAnalytics', data),
  analyticsSyncAll:    ()          => ipcRenderer.invoke('analytics:syncAll'),
  analyticsSyncPlatform: (platform) => ipcRenderer.invoke('analytics:syncPlatform', { platform }),

  // ── System ──────────────────────────────────────────────────────────────────
  openFilePicker:      (filters)   => ipcRenderer.invoke('dialog:openFile', { filters }),
  openDirectoryPicker: (opts)      => ipcRenderer.invoke('dialog:openDirectory', opts || {}),
  storageDirsGet:      ()          => ipcRenderer.invoke('storage:getDirs'),
  storageDirsSet:      (cat, dir)  => ipcRenderer.invoke('storage:setDir', { category: cat, dirPath: dir }),
  showItemInFolder:    (filePath)  => ipcRenderer.invoke('shell:showItemInFolder', filePath),
  openExternal:        (url)       => ipcRenderer.invoke('shell:openExternal', url),
  readVideoAsDataUrl:  (filePath)  => ipcRenderer.invoke('file:readAsDataUrl', filePath),

  // ── AI ──────────────────────────────────────────────────────────────────────
  aiGetConfig:         ()                         => ipcRenderer.invoke('ai:getConfig'),
  aiExtractAudio:      (sourcePath, projectId)    => ipcRenderer.invoke('ai:extractAudio', sourcePath, projectId),
  thumbnailGenerateAI: (opts)                     => ipcRenderer.invoke('thumbnail:generateAI', opts),
  aiTranscribe:        (videoPath, deepgramKey, projectId) => ipcRenderer.invoke('ai:transcribe', videoPath, deepgramKey, projectId),
  aiScore:             (opts)     => ipcRenderer.invoke('ai:score', opts),
  aiTranslate:         (opts)                     => ipcRenderer.invoke('ai:translate', opts),
  aiGenerateImage:     (opts)                     => ipcRenderer.invoke('ai:generateImage', opts),

  // ── Rendering ───────────────────────────────────────────────────────────────
  renderClip:          (options) => ipcRenderer.invoke('render:clip', options),
  uploadVideo:         (opts)    => ipcRenderer.invoke('upload:video', opts),
  renderBatch:         (jobs)    => ipcRenderer.invoke('render:batch', jobs),

  // ── B-Roll ──────────────────────────────────────────────────────────────────
  brollSearch:         (opts)    => ipcRenderer.invoke('broll:search', opts),
  brollDownload:       (opts)    => ipcRenderer.invoke('broll:download', opts),
  brollListCache:      ()        => ipcRenderer.invoke('broll:listCache'),
  brollClearCache:     ()        => ipcRenderer.invoke('broll:clearCache'),

  // ── Caption ─────────────────────────────────────────────────────────────────
  captionGenerate:     (opts)    => ipcRenderer.invoke('caption:generate', opts),

  // ── Supabase (Client Approval) ──────────────────────────────────────────────
  supabaseCreateReviewLink: (opts) => ipcRenderer.invoke('supabase:createReviewLink', opts),
  supabaseGetReviewLinks:   (opts) => ipcRenderer.invoke('supabase:getReviewLinks', opts),
  supabaseDeleteReviewLink: (opts) => ipcRenderer.invoke('supabase:deleteReviewLink', opts),
  supabaseUpdateReviewStatus: (opts) => ipcRenderer.invoke('supabase:updateReviewStatus', opts),

  // ── Logging ─────────────────────────────────────────────────────────────────
  loggerSetEnabled:    (en)      => ipcRenderer.invoke('logger:setEnabled', en),
  loggerGetEnabled:    ()        => ipcRenderer.invoke('logger:getEnabled'),
  loggerGetLogs:       (opts)    => ipcRenderer.invoke('logger:getLogs', opts),
  loggerClearLogs:     ()        => ipcRenderer.invoke('logger:clearLogs'),

  // ── Auto-Update ─────────────────────────────────────────────────────────────
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

  // ── Face Tracking ────────────────────────────────────────────────────────────
  facetrackSetEnabled: (enabled) => ipcRenderer.invoke('facetrack:setEnabled', enabled),
  facetrackGetEnabled: ()        => ipcRenderer.invoke('facetrack:getEnabled'),
  facetrackDetect:     (opts)    => ipcRenderer.invoke('facetrack:detect', opts),

  // ── Dubbing (Phase 5 — Full ElevenLabs Pipeline) ────────────────────────────
  dubbingSetEnabled:   (enabled) => ipcRenderer.invoke('dubbing:setEnabled', enabled),
  dubbingGetEnabled:   ()        => ipcRenderer.invoke('dubbing:getEnabled'),
  dubbingGetVoices:    ()        => ipcRenderer.invoke('dubbing:getVoices'),
  dubbingTranslate:    (opts)    => ipcRenderer.invoke('dubbing:translate', opts),
  dubbingSynthesize:   (opts)    => ipcRenderer.invoke('dubbing:synthesize', opts),
  dubbingMergeAudio:   (opts)    => ipcRenderer.invoke('dubbing:mergeAudio', opts),

  // ── FFmpeg ────────────────────────────────────────────────────────────────────
  ffmpegCheckInstallation: ()    => ipcRenderer.invoke('ffmpeg:checkInstallation'),
  getWaveform:           (sourcePath, width, height) => ipcRenderer.invoke('ffmpeg:getWaveform', { sourcePath, width, height }),

  // ── Jobs (Phase 1 — Queue Dashboard) ─────────────────────────────────────────
  enqueueJob:          (type, payload) => ipcRenderer.invoke('job:enqueue', { type, payload }),
  getJob:              (jobId)         => ipcRenderer.invoke('job:get', { jobId }),
  jobGetAll:           (opts)          => ipcRenderer.invoke('job:getAll', opts),
  jobRetry:            (opts)          => ipcRenderer.invoke('job:retry', opts),
  jobCancel:           (opts)          => ipcRenderer.invoke('job:cancel', opts),

  // ── OAuth ─────────────────────────────────────────────────────────────────────
  authLogin:           (provider) => ipcRenderer.invoke('auth:login', provider),
  authStatus:          (provider) => ipcRenderer.invoke('auth:status', provider),

  // ── Thumbnail (Phase 4 — AI Generator) ───────────────────────────────────────
  generateThumbnail:    (opts)  => ipcRenderer.invoke('thumbnail:generate', opts),
  generateAIThumbnail:  (opts)  => ipcRenderer.invoke('thumbnail:generateAI', opts),
  exportSrt:            (opts)  => ipcRenderer.invoke('export:srt', opts),

  // ── AI Insights ───────────────────────────────────────────────────────────────
  insightsAnalyze:      (data)  => ipcRenderer.invoke('insights:analyze', data),

  // ── Clip Profiles ─────────────────────────────────────────────────────────────
  dbGetClipProfiles:    ()       => ipcRenderer.invoke('db:getClipProfiles'),
  dbCreateClipProfile:  (data)   => ipcRenderer.invoke('db:createClipProfile', data),
  dbDeleteClipProfile:  (id)     => ipcRenderer.invoke('db:deleteClipProfile', id),

  // ── Project Tags ──────────────────────────────────────────────────────────────
  dbUpdateProjectTags:  (data)   => ipcRenderer.invoke('db:updateProjectTags', data),

  // ── Webhook ───────────────────────────────────────────────────────────────────
  webhookGetConfig:  ()         => ipcRenderer.invoke('webhook:getConfig'),
  webhookSetConfig:  (data)     => ipcRenderer.invoke('webhook:setConfig', data),
  webhookSend:       (data)     => ipcRenderer.invoke('webhook:send', data),

  // ── Compilation (Phase 7) ─────────────────────────────────────────────────────
  compilationCreate:    (opts)  => ipcRenderer.invoke('compilation:create', opts),
  compilationBestOf:    (opts)  => ipcRenderer.invoke('compilation:bestOf', opts),
  compilationGetClips:  ()      => ipcRenderer.invoke('compilation:getClips'),

  // ── Calendar (Phase 6) ────────────────────────────────────────────────────────
  calendarGetMonth:         (opts) => ipcRenderer.invoke('calendar:getMonth', opts),
  calendarReschedule:       (opts) => ipcRenderer.invoke('calendar:reschedule', opts),
  calendarGetOptimalTimes:  ()     => ipcRenderer.invoke('calendar:getOptimalTimes'),

  // ── Push Events (renderer subscribes) ────────────────────────────────────────
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
  onJobProgress: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('job:progress', handler);
    return () => ipcRenderer.removeListener('job:progress', handler);
  },
  onJobStatusChanged: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('job:statusChanged', handler);
    return () => ipcRenderer.removeListener('job:statusChanged', handler);
  },
  onCompilationProgress: (callback) => {
    const handler = (_, data) => callback(data);
    ipcRenderer.on('compilation:progress', handler);
    return () => ipcRenderer.removeListener('compilation:progress', handler);
  },

  // ── Menu Events ─────────────────────────────────────────────────────────────
  onMenuNavigate: (callback) => {
    const handler = (_, route) => callback(route);
    ipcRenderer.on('menu:navigate', handler);
    return () => ipcRenderer.removeListener('menu:navigate', handler);
  },
  onMenuNewProject: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('menu:newProject', handler);
    return () => ipcRenderer.removeListener('menu:newProject', handler);
  },
  onMenuOpenSettings: (callback) => {
    const handler = () => callback();
    ipcRenderer.on('menu:openSettings', handler);
    return () => ipcRenderer.removeListener('menu:openSettings', handler);
  },

  // ── App Reset ───────────────────────────────────────────────────────────────
  appReset: (options) => ipcRenderer.invoke('app:reset', options),

  // ── AI Alternative Auth ──────────────────────────────────────────────────────
  detectGeminiCli:    ()        => ipcRenderer.invoke('app:detect-gemini-cli'),
  checkGcloudAdc:     ()        => ipcRenderer.invoke('app:check-gcloud-adc'),
  googleAiOAuthLogin: (opts)    => ipcRenderer.invoke('app:google-ai-oauth-login', opts),
  checkAwsCreds:      ()        => ipcRenderer.invoke('app:check-aws-creds'),
  testConnection:     (opts)    => ipcRenderer.invoke('app:test-connection', opts),
});
