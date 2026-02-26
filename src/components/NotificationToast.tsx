"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface Toast {
  id: string;
  title: string;
  body: string;
  type: "success" | "error" | "info";
}

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onNotification) return;

    const cleanup = api.onNotification((data: { title: string; body: string }) => {
      const type: Toast["type"] =
        data.title.includes("✅") ? "success" :
        data.title.includes("❌") ? "error" : "info";

      const toast: Toast = {
        id: Date.now().toString(),
        title: data.title.replace(/[✅❌⚠️ℹ️]/g, "").trim(),
        body: data.body,
        type,
      };

      setToasts(prev => [...prev, toast]);

      // Auto-remove after 5s
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== toast.id));
      }, 5000);
    });

    return cleanup;
  }, []);

  const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-xl border shadow-lg
            backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-300
            ${toast.type === "success" ? "bg-green-950/90 border-green-700/50 text-green-100" : ""}
            ${toast.type === "error"   ? "bg-red-950/90 border-red-700/50 text-red-100"     : ""}
            ${toast.type === "info"    ? "bg-background/95 border-border text-foreground"   : ""}
          `}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === "success" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
            {toast.type === "error"   && <AlertCircle  className="h-4 w-4 text-red-400"   />}
            {toast.type === "info"    && <Info          className="h-4 w-4 text-blue-400"  />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{toast.title || "AutoClipper"}</p>
            {toast.body && <p className="text-xs opacity-80 mt-0.5 break-words">{toast.body}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

// Global render progress store — used through a non-component hook
export function useRenderProgress() {
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const api = window.electronAPI;
    if (!api?.onRenderProgress) return;

    const cleanup = api.onRenderProgress((data: { jobId: string; percent: number }) => {
      setProgress(prev => ({ ...prev, [data.jobId]: data.percent }));
    });

    return cleanup;
  }, []);

  return progress;
}
