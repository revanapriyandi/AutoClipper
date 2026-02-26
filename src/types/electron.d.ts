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
      // Database (Prisma)
      dbCreateProject: (opts: { title: string; sourcePath: string }) => Promise<unknown>;
      dbGetProjects: () => Promise<{ success: boolean; projects?: unknown[]; error?: string }>;
      dbGetProject: (id: string) => Promise<{ success: boolean; project?: unknown; error?: string }>;
      dbGetClipHistory: () => Promise<{ success: boolean; clips?: unknown[]; error?: string }>;
      dbGetScheduledJobs: () => Promise<{ success: boolean; jobs?: unknown[]; error?: string }>;
      dbGetThemePresets: () => Promise<{ success: boolean; presets?: { id: string; name: string; fontFamily: string; primaryColor: string; outlineColor: string; alignment: string; marginV: string }[]; error?: string }>;
      dbCreateThemePreset: (data: { name: string; fontFamily: string; primaryColor: string; outlineColor: string; alignment: string; marginV: string }) => Promise<{ success: boolean; preset?: unknown; error?: string }>;
      dbDeleteThemePreset: (id: string) => Promise<{ success: boolean; error?: string }>;
      dbGetAnalytics: () => Promise<{ success: boolean; analytics?: unknown[]; error?: string }>;
      dbUpdateAnalytics: (data: { clipId: string; platform: string; views?: number; likes?: number; comments?: number; shares?: number }) => Promise<{ success: boolean; analytics?: unknown; error?: string }>;
      // System Utilities

      openFilePicker: (filters?: { name: string; extensions: string[] }[]) => Promise<{ success: boolean; filePath?: string }>;
      showItemInFolder: (filePath: string) => Promise<{ success: boolean }>;
      openExternal: (url: string) => Promise<{ success: boolean }>;
      readVideoAsDataUrl: (filePath: string) => Promise<{ success: boolean; dataUrl?: string; error?: string }>;
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
      aiScore: (promptText: string, provider: string) => Promise<{ success: boolean; scores?: unknown; error?: string }>;
      // Rendering
      renderClip:  (options: unknown) => Promise<{ success: boolean; outputPath?: string; error?: string }>;
      uploadVideo: (opts: { platform: string; videoPath: string; title?: string; description?: string; tags?: string[]; pageId?: string }) => Promise<{ success: boolean; videoId?: string; url?: string; publishId?: string; error?: string }>;
      // Background Jobs
      enqueueJob: (type: string, payload: unknown, scheduledAt?: string | Date) => Promise<{ success: boolean; jobId?: string; error?: string }>;
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
    };
  }
}

export {};
