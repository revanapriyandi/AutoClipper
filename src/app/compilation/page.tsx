"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Film, Star, Clock, Loader2, CheckSquare, Square,
  Play, Trophy, Sparkles, FolderOpen
} from "lucide-react";

interface ClipItem {
  id: string;
  projectTitle: string;
  caption?: string;
  startMs: number;
  endMs: number;
  score: number;
  hasVideo: boolean;
  createdAt: string;
}

interface CompilationProgress {
  percent: number;
  timemark: string;
}

export default function CompilationPage() {
  const [clips, setClips] = useState<ClipItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [outputName, setOutputName] = useState("my_compilation");
  const [topN, setTopN] = useState(10);
  const [building, setBuilding] = useState(false);
  const [buildingBestOf, setBuildingBestOf] = useState(false);
  const [progress, setProgress] = useState<CompilationProgress | null>(null);
  const [result, setResult] = useState<{ success: boolean; outputPath?: string; error?: string; clipCount?: number } | null>(null);

  const loadClips = useCallback(async () => {
    setLoading(true);
    try {
      const api = window.electronAPI as unknown as {
        compilationGetClips?: () => Promise<{ success: boolean; clips?: ClipItem[] }>;
      };
      const res = await api.compilationGetClips?.();
      if (res?.success && res.clips) setClips(res.clips);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClips();

    const api = window.electronAPI as unknown as {
      onCompilationProgress?: (cb: (d: CompilationProgress) => void) => () => void;
    };

    const unsub = api.onCompilationProgress?.((data) => {
      setProgress(data);
    });

    return () => unsub?.();
  }, [loadClips]);

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(clips.map(c => c.id)));
  const clearAll = () => setSelected(new Set());

  const handleBuild = async () => {
    if (selected.size === 0) return;
    setBuilding(true);
    setResult(null);
    setProgress(null);

    try {
      const api = window.electronAPI as unknown as {
        compilationCreate?: (opts: { clipIds: string[]; outputName: string }) => Promise<{ success: boolean; outputPath?: string; error?: string; clipCount?: number }>;
      };
      const res = await api.compilationCreate?.({ clipIds: Array.from(selected), outputName });
      setResult(res || { success: false, error: "No response" });
    } catch (e) {
      setResult({ success: false, error: (e as Error).message });
    } finally {
      setBuilding(false);
    }
  };

  const handleBestOf = async () => {
    setBuildingBestOf(true);
    setResult(null);
    setProgress(null);

    try {
      const api = window.electronAPI as unknown as {
        compilationBestOf?: (opts: { topN: number; outputName: string }) => Promise<{ success: boolean; outputPath?: string; error?: string; clipCount?: number; selectedClipIds?: string[] }>;
      };
      const res = await api.compilationBestOf?.({ topN, outputName: `bestof_${outputName}` });
      setResult(res || { success: false, error: "No response" });
      if (res?.success && res.selectedClipIds) {
        setSelected(new Set(res.selectedClipIds));
      }
    } catch (e) {
      setResult({ success: false, error: (e as Error).message });
    } finally {
      setBuildingBestOf(false);
    }
  };

  const durationMs = (c: ClipItem) => c.endMs - c.startMs;
  const totalDuration = clips
    .filter(c => selected.has(c.id))
    .reduce((acc, c) => acc + durationMs(c), 0);

  const fmtMs = (ms: number) => {
    const s = Math.round(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };

  const isProcessing = building || buildingBestOf;

  return (
    <div className="grid gap-6 pb-10">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Film className="h-7 w-7 text-primary" />
          Clip Compilation
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Combine multiple rendered clips into one video. Select manually or let AI pick the best ones.
        </p>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Manual compilation */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              Manual Selection
            </CardTitle>
            <CardDescription>Choose clips from the list below, then build.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="outputName" className="text-xs">Output Filename</Label>
              <Input
                id="outputName"
                value={outputName}
                onChange={e => setOutputName(e.target.value)}
                placeholder="my_compilation"
                className="text-sm"
                disabled={isProcessing}
              />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{selected.size} clips selected</span>
              {selected.size > 0 && <span>• {fmtMs(totalDuration)} total</span>}
            </div>
            <Button
              onClick={handleBuild}
              disabled={selected.size === 0 || isProcessing}
              className="w-full gap-2"
            >
              {building ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Build Compilation ({selected.size} clips)
            </Button>
          </CardContent>
        </Card>

        {/* Auto best-of */}
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-400" />
              Auto Best-Of
              <Badge className="text-[10px] bg-yellow-400/20 text-yellow-400">AI</Badge>
            </CardTitle>
            <CardDescription>Automatically select highest-scoring clips by AI virality score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="topN" className="text-xs">Number of Top Clips</Label>
              <Input
                id="topN"
                type="number"
                min={1}
                max={50}
                value={topN}
                onChange={e => setTopN(parseInt(e.target.value) || 10)}
                className="text-sm w-24"
                disabled={isProcessing}
              />
            </div>
            <Button
              onClick={handleBestOf}
              disabled={isProcessing || clips.length === 0}
              variant="outline"
              className="w-full gap-2 border-yellow-500/40 hover:border-yellow-500/70"
            >
              {buildingBestOf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-yellow-400" />}
              Generate Best-Of (Top {topN})
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      {isProcessing && progress && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Building compilation…</span>
              <span>{progress.percent}%</span>
            </div>
            <Progress value={progress.percent} className="h-2" />
            {progress.timemark && <p className="text-xs text-muted-foreground">Timemark: {progress.timemark}</p>}
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {result && (
        <Card className={result.success ? "border-green-500/40 bg-green-500/5" : "border-red-500/40 bg-red-500/5"}>
          <CardContent className="p-4">
            {result.success ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-green-400">✅ Compilation ready! {result.clipCount} clips merged.</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground font-mono flex-1 truncate">{result.outputPath}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1 text-xs"
                    onClick={() => (window.electronAPI as unknown as { showItemInFolder?: (p: string) => void }).showItemInFolder?.(result.outputPath!)}
                  >
                    <FolderOpen className="h-3 w-3" /> Show
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-red-400">❌ {result.error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Clip List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Available Clips ({clips.length})</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="text-xs gap-1" onClick={selectAll} disabled={isProcessing}>
              <CheckSquare className="h-3 w-3" /> Select All
            </Button>
            <Button size="sm" variant="outline" className="text-xs gap-1" onClick={clearAll} disabled={isProcessing}>
              <Square className="h-3 w-3" /> Clear
            </Button>
          </div>
        </div>

        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-10 w-full" /></CardContent></Card>
          ))
        ) : clips.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No rendered clips found. Render clips from your projects first.
            </CardContent>
          </Card>
        ) : (
          clips.map(clip => (
            <Card
              key={clip.id}
              className={`cursor-pointer transition-all ${selected.has(clip.id) ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
              onClick={() => !isProcessing && toggleSelect(clip.id)}
            >
              <CardContent className="p-3 flex items-center gap-3">
                <Checkbox
                  checked={selected.has(clip.id)}
                  onCheckedChange={() => !isProcessing && toggleSelect(clip.id)}
                  className="shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{clip.projectTitle}</p>
                  <p className="text-xs text-muted-foreground truncate">{clip.caption || "No caption"}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {fmtMs(durationMs(clip))}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400" />
                    {Math.round(clip.score)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
