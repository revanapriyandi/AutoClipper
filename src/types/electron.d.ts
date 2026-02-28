/**
 * Global type declarations for the Electron IPC bridge exposed via preload.js.
 * Single source of truth for `window.electronAPI` types.
 */

declare global {
  interface Window {
    electronAPI?: {
      // Secure Storage
      setKey: (account: string, password: string) => Promise<{ success: boolean; error?: string }>;
      getKey: (account: string) => Promise<{ success: boolean; value?: string; error?: string }>;
      deleteKey: (account: string) => Promise<{ success: boolean; error?: string }>;
      // Environment
      envSetDatabaseUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
      envGetDatabaseUrl: () => Promise<{ success: boolean; value?: string; error?: string }>;
      // Database      // DB
      dbCreateProject:   (title: string, sourcePath: string) => Promise<{ success: boolean; project?: unknown; error?: string }>;
      dbGetProjects:     () => Promise<{ success: boolean; projects?: unknown[]; error?: string }>;
      dbGetProject:      (id: string) => Promise<{ success: boolean; project?: unknown; error?: string }>;
      dbGetClipHistory:  () => Promise<{ success: boolean; clips?: unknown[]; error?: string }>;
      dbDeleteProject:   (id: string) => Promise<{ success: boolean; error?: string }>;
      dbSaveProjectClips: (data: { projectId: string; candidates: unknown[]; brollKeywordMap?: Record<number, string[]> }) => Promise<{ success: boolean; error?: string }>;
      dbGetProjectClips:  (projectId: string) => Promise<{ success: boolean; candidates?: unknown[]; error?: string }>;
      dbUpdateClipChunks: (data: { clipId: string; chunks: unknown[]; transcriptText?: string }) => Promise<{ success: boolean; error?: string }>;
      dbAddLog: (data: { level: string; category: string; message: string; details?: unknown }) => Promise<{ success: boolean }>;
      dbGetLogs: (opts?: { limit?: number; level?: string; category?: string }) => Promise<{ success: boolean; logs?: unknown[]; error?: string }>;

      // Video Downloader
      downloadVideoUrl: (url: string) => Promise<{ success: boolean; filePath?: string; error?: string }>;
      onDownloadProgress: (callback: (percent: number) => void) => void;

      // Brand Kits
      dbGetWorkspaces:   () => Promise<{ success: boolean; workspaces?: unknown[]; error?: string }>;
      dbCreateBrandKit:  (data: { workspaceId: string, name: string, fontFamily: string, primaryColor: string }) => Promise<{ success: boolean; kit?: unknown; error?: string }>;
      dbUpdateBrandKit:  (data: { id: string, name?: string, fontFamily?: string, primaryColor?: string }) => Promise<{ success: boolean; kit?: unknown; error?: string }>;
      dbDeleteBrandKit:  (id: string) => Promise<{ success: boolean; error?: string }>;
      brandUploadAsset:  (data: { kitId: string, type: 'watermark' | 'logo', sourcePath: string }) => Promise<{ success: boolean; kit?: unknown; error?: string }>;

      // Theme Presets: () => Promise<{ success: boolean; presets?: { id: string; name: string; fontFamily: string; primaryColor: string; outlineColor: string; alignment: string; marginV: string }[]; error?: string }>;
      dbCreateThemePreset: (data: { name: string; fontFamily: string; primaryColor: string; outlineColor: string; alignment: string; marginV: string }) => Promise<{ success: boolean; preset?: unknown; error?: string }>;
      dbDeleteThemePreset: (id: string) => Promise<{ success: boolean; error?: string }>;
      dbGetAnalytics: () => Promise<{ success: boolean; analytics?: unknown[]; error?: string }>;
      dbUpdateAnalytics: (data: { clipId: string; platform: string; views?: number; likes?: number; comments?: number; shares?: number }) => Promise<{ success: boolean; analytics?: unknown; error?: string }>;
      // System Utilities
      openFilePicker: (filters?: { name: string; extensions: string[] }[]) => Promise<{ success: boolean; filePath?: string }>;
      dialogOpenFile: (opts?: unknown) => Promise<{ success: boolean; filePath?: string }>;
      showItemInFolder: (filePath: string) => Promise<{ success: boolean }>;
      openExternal: (url: string) => Promise<{ success: boolean }>;
      readVideoAsDataUrl: (filePath: string) => Promise<{ success: boolean; dataUrl?: string; error?: string }>;
      thumbnailGenerateAI: (opts: unknown) => Promise<{ success: boolean; variants?: unknown[]; error?: string }>;
      // AI Tools
      aiGetConfig: () => Promise<unknown>;
      aiTranscribe: (
        videoPath: string,
        deepgramKey: string
      ) => Promise<{
        success: boolean;
        results?: {
          channels: [{
            alternatives: [{
              words: { word: string; start: number; end: number }[];
              transcript: string;
            }];
          }];
        };
        error?: string;
      }>;
      aiScore: (opts: { promptText: string; provider: string; sourcePath?: string; visionEnabled?: boolean; startMs?: number; endMs?: number }) => Promise<{ success: boolean; scores?: unknown; error?: string }>;
      aiTranslate: (opts: { segments: {id: string, start: number, end: number, text: string}[], targetLanguage: string }) => Promise<{ success: boolean; segments?: {id: string, start: number, end: number, text: string}[]; error?: string }>;
      aiGenerateImage: (opts: { prompt: string; provider?: string }) => Promise<{ success: boolean; base64?: string; provider?: string; error?: string }>;
      // Rendering
      renderClip:  (options: unknown) => Promise<{ success: boolean; outputPath?: string; error?: string }>;
      uploadVideo: (opts: { platform: string; videoPath: string; title?: string; description?: string; tags?: string[]; pageId?: string }) => Promise<{ success: boolean; videoId?: string; url?: string; publishId?: string; error?: string }>;
      // Background Jobs
      enqueueJob: (type: string, payload: unknown, scheduledAt?: string | Date) => Promise<{ success: boolean; jobId?: string; error?: string }>;
      jobEnqueue: (opts: unknown) => Promise<{ success: boolean; jobId?: string; error?: string }>;
      jobGetAll:  (opts?: unknown) => Promise<{ success: boolean; jobs?: unknown[]; error?: string }>;
      getJob: (jobId: string) => Promise<{ success: boolean; job?: { id: string; status: string; error?: string } }>;
      // OAuth
      authLogin:   (provider: string) => Promise<{ success: boolean; error?: string }>;
      authStatus:  (provider: string) => Promise<{ success: boolean; connected: boolean }>;
      // Push Events
      onRenderProgress: (callback: (data: { jobId: string; percent: number }) => void) => () => void;
      onNotification:   (callback: (data: { title: string; body: string }) => void) => () => void;
      onUpdaterStatus:  (callback: (data: { status: string; version?: string; percent?: number; error?: string }) => void) => () => void;
      // B-Roll
      brollSearch:     (opts: { keywords: string | string[]; orientation?: string; perPage?: number }) => Promise<{ success: boolean; videos?: unknown[]; error?: string }>;
      brollDownload:   (opts: { videoId: number; downloadUrl: string }) => Promise<{ success: boolean; localPath?: string; error?: string }>;
      brollListCache:  () => Promise<{ success: boolean; files?: unknown[]; cacheDir?: string }>;
      brollClearCache: () => Promise<{ success: boolean; cleared?: number }>;
      // Caption
      captionGenerate: (opts: { transcriptText: string; topic?: string; platforms?: string[] }) => Promise<{ success: boolean; caption?: { hook: string; caption: string; hashtags: string[]; cta: string; fullPost: string }; error?: string }>;
      
      // Supabase (Approval Portal)
      supabaseCreateReviewLink: (opts: { projectId: string; clipId?: string; localFilePath: string }) => Promise<{ success: boolean; reviewLink?: unknown; error?: string }>;
      supabaseGetReviewLinks: (opts: { projectId?: string }) => Promise<{ success: boolean; links?: unknown[]; error?: string }>;
      supabaseDeleteReviewLink: (opts: { id: string }) => Promise<{ success: boolean; error?: string }>;
      supabaseUpdateReviewStatus: (opts: { id: string; status: string; comments?: string }) => Promise<{ success: boolean; link?: unknown; error?: string }>;

      // Logger
      loggerSetEnabled: (enabled: boolean) => Promise<{ success: boolean; enabled: boolean }>;
      loggerGetEnabled: () => Promise<{ success: boolean; enabled: boolean }>;
      loggerGetLogs:    (opts?: { lines?: number }) => Promise<{ success: boolean; logs?: unknown[]; logDir?: string }>;
      loggerClearLogs:  () => Promise<{ success: boolean; cleared?: number }>;
      // Auto-Update
      updaterSetEnabled: (enabled: boolean) => Promise<{ success: boolean; enabled: boolean }>;
      updaterGetEnabled: () => Promise<{ success: boolean; enabled: boolean }>;
      updaterCheckNow:   () => Promise<{ success: boolean; error?: string }>;
      updaterDownload:   () => Promise<{ success: boolean; error?: string }>;
      updaterInstallNow: () => Promise<{ success: boolean }>;
      // Face Tracking
      facetrackSetEnabled: (enabled: boolean) => Promise<{ success: boolean; enabled: boolean }>;
      facetrackGetEnabled: () => Promise<{ success: boolean; enabled: boolean }>;
      facetrackDetect:     (opts: { videoPath: string; width?: number; height?: number }) => Promise<{ success: boolean; xOffset?: number; error?: string }>;
      // AI Dubbing
      dubbingSetEnabled:   (enabled: boolean) => Promise<{ success: boolean; enabled: boolean }>;
      dubbingGetEnabled:   () => Promise<{ success: boolean; enabled: boolean }>;
      dubbingGetVoices:    () => Promise<{ success: boolean; voices?: { id: string; name: string; previewUrl: string }[]; error?: string }>;
      dubbingTranslate:    (opts: { text: string; targetLanguage: string }) => Promise<{ success: boolean; translated?: string; provider?: string; error?: string }>;
      dubbingSynthesize:   (opts: { text: string; voiceId?: string; outputPath?: string }) => Promise<{ success: boolean; audioPath?: string; error?: string }>;
      dubbingMergeAudio:   (opts: { videoPath: string; audioPath: string; outputPath?: string; keepOriginalAudio?: boolean }) => Promise<{ success: boolean; outputPath?: string; error?: string }>;
      // Autopilot
      autopilotGetConfig:  () => Promise<{ success: boolean; config?: { id: string; keywords: string; targetPlatform: string; maxDailyDownloads: number; isActive: boolean }; error?: string }>;
      autopilotSaveConfig: (data: { keywords: string; targetPlatform: string; maxDailyDownloads: number; isActive: boolean }) => Promise<{ success: boolean; config?: unknown; error?: string }>;
      autopilotToggle:     (isActive: boolean) => Promise<{ success: boolean; config?: unknown; error?: string }>;
      autopilotRunNow:     () => Promise<{ success: boolean; project?: unknown; videoTitle?: string; error?: string }>;
      // Storage Paths
      openDirectoryPicker: (opts?: { title?: string }) => Promise<{ success: boolean; dirPath?: string }>;
      storageDirsGet:      () => Promise<{ success: boolean; dirs?: Record<string, { current: string; default: string }>; error?: string }>;
      storageDirsSet:      (category: string, dirPath: string) => Promise<{ success: boolean; error?: string }>;
      
      // Menu Events
      onCompilationProgress: (callback: (data: { jobId: string; percent: number }) => void) => () => void;
      onMenuNavigate: (callback: (route: string) => void) => () => void;
      onMenuNewProject: (callback: () => void) => () => void;
      onMenuOpenSettings: (callback: () => void) => () => void;

      // FFmpeg (Waveform)
      getWaveform: (sourcePath: string, width?: number, height?: number) => Promise<{ success: boolean; dataUrl?: string }>;
      onMenuOpenSettings: (callback: () => void) => () => void;
    };
  }
}

export {};
