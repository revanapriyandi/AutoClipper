"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Zap, Play, Loader2, Save, Bot, Clock, Download, CheckCircle2, AlertCircle,
  FolderOpen, BarChart3, RefreshCw, Activity
} from "lucide-react";

interface AutopilotConfig {
  isActive: boolean;
  keywords: string;
  targetPlatform: string;
  maxDailyDownloads: number;
  minViews: number;
  maxAgeDays: number;
  sourceType: string;
  playlistUrl?: string;
  rssUrl?: string;
}

interface AutopilotStats {
  totalDownloads: number;
  totalClips: number;
  totalPosted: number;
  lastRun?: string;
}

interface LogEntry {
  time: string;
  level: "info" | "success" | "error";
  message: string;
}

export default function AutopilotPage() {
  const [config, setConfig] = useState<AutopilotConfig>({
    isActive: false,
    keywords: "podcast clips, motivation, interview highlights",
    targetPlatform: "youtube",
    maxDailyDownloads: 3,
    minViews: 10000,
    maxAgeDays: 30,
    sourceType: "search",
    playlistUrl: "",
    rssUrl: "",
  });
  const [stats, setStats] = useState<AutopilotStats>({ totalDownloads: 0, totalClips: 0, totalPosted: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [progress, setProgress] = useState(0);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const api = typeof window !== "undefined" ? window.electronAPI : undefined;

  const addLog = (message: string, level: LogEntry["level"] = "info") => {
    const entry: LogEntry = { time: new Date().toLocaleTimeString("id-ID"), level, message };
    setLogs(prev => [...prev.slice(-99), entry]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  useEffect(() => {
    const load = async () => {
      if (!api?.autopilotGetConfig) return;
      const res = await api.autopilotGetConfig();
      if (res?.success && res.config) {
        const cfg = res.config as AutopilotConfig & { id?: string };
        setConfig({
          isActive: cfg.isActive ?? false,
          keywords: cfg.keywords ?? "",
          targetPlatform: cfg.targetPlatform ?? "youtube",
          maxDailyDownloads: cfg.maxDailyDownloads ?? 3,
          minViews: cfg.minViews ?? 10000,
          maxAgeDays: cfg.maxAgeDays ?? 30,
          sourceType: cfg.sourceType ?? "search",
          playlistUrl: cfg.playlistUrl ?? "",
          rssUrl: cfg.rssUrl ?? "",
        });
      }

      // Load stats from history
      try {
        const histRes = await (api as unknown as { dbGetProjects?: () => Promise<{ success: boolean; projects?: { id: string; createdAt: string }[] }> })?.dbGetProjects?.();
        if (histRes?.success && histRes.projects) {
          setStats({
            totalDownloads: histRes.projects.length,
            totalClips: 0,
            totalPosted: 0,
            lastRun: histRes.projects[0]?.createdAt,
          });
        }
      } catch {}

      addLog("Autopilot dashboard loaded.", "info");
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const res = await api?.autopilotSaveConfig?.(config);
    setSaving(false);
    if (res?.success) {
      setMsg({ text: "✅ Konfigurasi tersimpan!", type: "success" });
      addLog("Configuration saved.", "success");
    } else {
      setMsg({ text: `❌ ${res?.error || "Gagal menyimpan"}`, type: "error" });
    }
    setTimeout(() => setMsg(null), 3000);
  };

  const handleToggle = async () => {
    const newActive = !config.isActive;
    setConfig(prev => ({ ...prev, isActive: newActive }));
    const res = await api?.autopilotToggle?.(newActive);
    if (!res?.success) {
      setConfig(prev => ({ ...prev, isActive: !newActive }));
      addLog(`Failed to toggle: ${res?.error}`, "error");
    } else {
      addLog(newActive ? "🤖 Autopilot activated. Bot is now monitoring." : "⏹️ Autopilot deactivated.", newActive ? "success" : "info");
    }
  };

  const handleRunNow = async () => {
    setRunning(true);
    setProgress(10);
    addLog("⏳ Starting search cycle...", "info");
    setMsg({ text: "🔍 Mencari konten viral...", type: "info" });

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 5, 90));
    }, 1000);

    const res = await api?.autopilotRunNow?.();
    clearInterval(progressInterval);
    setProgress(100);
    setRunning(false);

    if (res?.success) {
      addLog(`✅ Success! Project "${res.videoTitle}" created.`, "success");
      setStats(prev => ({ ...prev, totalDownloads: prev.totalDownloads + 1 }));
      setMsg({ text: `✅ Project "${res.videoTitle}" dibuat!`, type: "success" });
    } else {
      addLog(`❌ Failed: ${res?.error || "Unknown error"}`, "error");
      setMsg({ text: `❌ ${res?.error || "Gagal"}`, type: "error" });
    }
    setTimeout(() => { setProgress(0); setMsg(null); }, 4000);
  };

  const logColor = {
    info: "text-muted-foreground",
    success: "text-green-400",
    error: "text-red-400",
  };

  return (
    <div className="grid gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-7 w-7 text-yellow-500" />
            Autopilot
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Bot otomatis mencari, mengunduh, dan memotong konten viral — tanpa intervensi manual.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={config.isActive ? "default" : "secondary"} className={config.isActive ? "bg-yellow-500 text-black" : ""}>
            {config.isActive ? "🟢 Active" : "⛔ Inactive"}
          </Badge>
          <button
            type="button"
            onClick={handleToggle}
            className={`relative inline-flex h-7 w-12 shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 cursor-pointer focus:outline-none ${config.isActive ? "bg-yellow-500" : "bg-input"}`}
          >
            <span className={`pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${config.isActive ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Downloads", value: stats.totalDownloads, icon: Download, color: "text-blue-400" },
          { label: "Clips Generated", value: stats.totalClips, icon: Bot, color: "text-violet-400" },
          { label: "Posted to Social", value: stats.totalPosted, icon: CheckCircle2, color: "text-green-400" },
          { label: "Last Run", value: stats.lastRun ? new Date(stats.lastRun).toLocaleDateString("id-ID") : "Never", icon: Clock, color: "text-yellow-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Config */}
        <Card>
          <CardHeader className="bg-muted/20 border-b">
            <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4" /> Configuration</CardTitle>
            <CardDescription>Tentukan kata kunci dan platform target untuk bot.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            <div className="space-y-2">
              <Label className="font-semibold text-sm">Keywords / Niche</Label>
              <Input
                value={config.keywords}
                onChange={e => setConfig(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="podcast clips, motivation, interview..."
              />
              <p className="text-xs text-muted-foreground">Pisahkan dengan koma. Bot memilih satu secara acak tiap siklus.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Source Type</Label>
                <select
                  value={config.sourceType}
                  onChange={e => setConfig(prev => ({ ...prev, sourceType: e.target.value }))}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="search">🔍 YouTube Search</option>
                  <option value="playlist">📋 YouTube Playlist</option>
                  <option value="rss">📡 RSS / Podcast Feed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="font-semibold text-sm">Max Downloads/Hari</Label>
                <Input
                  type="number" min={1} max={20}
                  value={config.maxDailyDownloads}
                  onChange={e => setConfig(prev => ({ ...prev, maxDailyDownloads: Number(e.target.value) }))}
                />
              </div>
            </div>
            {/* Playlist URL */}
            {config.sourceType === "playlist" && (
              <div className="space-y-2">
                <Label className="font-semibold text-sm">YouTube Playlist URL</Label>
                <Input
                  value={config.playlistUrl || ""}
                  onChange={e => setConfig(prev => ({ ...prev, playlistUrl: e.target.value }))}
                  placeholder="https://youtube.com/playlist?list=..."
                />
              </div>
            )}
            {/* RSS URL */}
            {config.sourceType === "rss" && (
              <div className="space-y-2">
                <Label className="font-semibold text-sm">RSS / Podcast Feed URL</Label>
                <Input
                  value={config.rssUrl || ""}
                  onChange={e => setConfig(prev => ({ ...prev, rssUrl: e.target.value }))}
                  placeholder="https://feeds.example.com/podcast.rss"
                />
              </div>
            )}
            {/* Smart Filters */}
            {config.sourceType === "search" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Min Views</Label>
                  <Input
                    type="number" min={0}
                    value={config.minViews}
                    onChange={e => setConfig(prev => ({ ...prev, minViews: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-semibold text-sm">Max Age (days)</Label>
                  <Input
                    type="number" min={1} max={365}
                    value={config.maxAgeDays}
                    onChange={e => setConfig(prev => ({ ...prev, maxAgeDays: Number(e.target.value) }))}
                  />
                </div>
              </div>
            )}

            {msg && (
              <div className={`text-sm px-3 py-2 rounded-lg font-medium flex items-center gap-2 ${msg.type === "success" ? "bg-green-500/10 text-green-400" : msg.type === "error" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>
                {msg.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : msg.type === "error" ? <AlertCircle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                {msg.text}
              </div>
            )}

            {running && progress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t bg-muted/20 gap-3 flex justify-between p-4">
            <Button variant="outline" onClick={handleRunNow} disabled={running}>
              {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Play className="h-4 w-4 mr-2" />}
              Run Now
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Config
            </Button>
          </CardFooter>
        </Card>

        {/* Live Activity Log */}
        <Card>
          <CardHeader className="bg-muted/20 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><Activity className="h-4 w-4" /> Live Activity Log</CardTitle>
                <CardDescription>Real-time log aktivitas bot autopilot.</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setLogs([])} title="Clear logs">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[320px] overflow-y-auto p-4 font-mono text-xs space-y-1 bg-black/20 rounded-b-lg">
              {logs.length === 0 ? (
                <p className="text-muted-foreground/50 text-center pt-8">No activity yet. Run Autopilot to see logs here.</p>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className={`flex gap-2 ${logColor[log.level]}`}>
                    <span className="text-muted-foreground/50 shrink-0">{log.time}</span>
                    <span>{log.message}</span>
                  </div>
                ))
              )}
              <div ref={logsEndRef} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Chart Placeholder */}
      <Card className="border-dashed bg-muted/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" /> Download History</CardTitle>
          <CardDescription>Riwayat download otomatis akan muncul di sini setelah bot berjalan.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32 text-muted-foreground/40">
          <div className="text-center">
            <FolderOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Run autopilot to see download history</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
