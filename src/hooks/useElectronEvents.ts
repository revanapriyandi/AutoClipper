"use client";

import { useEffect, useState, useCallback } from "react";

interface RenderProgressData { jobId: string; percent: number }
interface NotificationData   { title: string; body: string }

/**
 * useRenderProgress — subscribes to FFmpeg render:progress events from Electron.
 * Returns current render percent (0–100) for a given jobId.
 */
export function useRenderProgress(jobId: string | null) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    if (!jobId || !window.electronAPI?.onRenderProgress) return;
    const unsub = window.electronAPI.onRenderProgress((data: RenderProgressData) => {
      if (data.jobId === jobId) setPercent(data.percent);
    });
    return () => { if (typeof unsub === "function") unsub(); };
  }, [jobId]);

  return percent;
}

/**
 * useNotifications — subscribes to app:notification events from Electron.
 * Shows a browser Notification and calls the optional callback.
 */
export function useNotifications(onNotify?: (n: NotificationData) => void) {
  const handler = useCallback((n: NotificationData) => {
    // Browser Notification API (shown in OS)
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(n.title, { body: n.body });
    }
    onNotify?.(n);
  }, [onNotify]);

  useEffect(() => {
    Notification.requestPermission().catch(() => {});
    if (!window.electronAPI?.onNotification) return;
    const unsub = window.electronAPI.onNotification(handler);
    return () => { if (typeof unsub === "function") unsub(); };
  }, [handler]);
}
