"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Film, Clock, Search, Download, DollarSign, Filter, MessageSquare, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HistoryClip {
  id: string;
  projectId: string;
  projectTitle?: string;
  startMs: number;
  endMs: number;
  status: string;
  scores: string;
  caption?: string;
  createdAt: string;
  assets?: { kind: string; storagePath: string }[];
}

const STATUS_BADGE: Record<string, { label: string; class: string }> = {
  PENDING:   { label: "Pending",   class: "bg-muted text-muted-foreground" },
  RENDERING: { label: "Rendering", class: "bg-blue-500/20 text-blue-400" },
  COMPLETED: { label: "Rendered",  class: "bg-green-500/20 text-green-400" },
  POSTED:    { label: "Posted",    class: "bg-violet-500/20 text-violet-400" },
};

// F17: Estimate API cost based on clip duration
function estimateApiCost(startMs: number, endMs: number): string {
  const durationSec = (endMs - startMs) / 1000;
  // Deepgram: ~$0.0043/min, approximate
  const transcribeCost = (durationSec / 60) * 0.0043;
  // LLM scoring: ~$0.001 per clip (gpt-mini estimate)
  const llmCost = 0.001;
  const total = transcribeCost + llmCost;
  return `$${total.toFixed(4)}`;
}

export default function HistoryPage() {
  const [clips, setClips] = useState<HistoryClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadingClipId, setUploadingClipId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const api = window.electronAPI;
        if (!api) throw new Error("Electron API not found");
        const data = await api.dbGetClipHistory();
        if (data.success && data.clips) setClips(data.clips as HistoryClip[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = clips.filter(c => {
    const matchSearch = !search ||
      c.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
      c.caption?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDuration = (startMs: number, endMs: number) =>
    `${((endMs - startMs) / 1000).toFixed(0)}s`;

  const getViralityScore = (scores: string): number | null => {
    try { return JSON.parse(scores)?.totalScore ?? null; }
    catch { return null; }
  };

  // F17: Export CSV
  const handleExportCSV = () => {
    const headers = ["Project", "Caption", "Duration", "Status", "Virality Score", "Est. API Cost", "Created At"];
    const rows = filtered.map(c => [
      c.projectTitle || "",
      c.caption || "",
      formatDuration(c.startMs, c.endMs),
      c.status,
      getViralityScore(c.scores) ?? "",
      estimateApiCost(c.startMs, c.endMs),
      new Date(c.createdAt).toLocaleString("id-ID"),
    ]);
    const csv = [headers, ...rows].map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clip_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCost = clips.reduce((acc, c) => {
    const durationSec = (c.endMs - c.startMs) / 1000;
    return acc + (durationSec / 60) * 0.0043 + 0.001;
  }, 0);

  const handleCreateReviewLink = async (clipId: string, projectId: string, localFilePath: string) => {
    if (!window.electronAPI?.supabaseCreateReviewLink) return;
    setUploadingClipId(clipId);
    try {
      const res = await window.electronAPI.supabaseCreateReviewLink({ clipId, projectId, localFilePath });
      if (res.success) {
        alert("Review link created successfully! Check the Approvals page.");
      } else {
        alert("Failed to create review link: " + res.error);
      }
    } catch (e: unknown) {
      alert("Error: " + (e as Error).message);
    }
    setUploadingClipId(null);
  };

  return (
    <div className="grid gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Film className="h-7 w-7 text-primary" /> Clip History
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Semua klip yang pernah dibuat oleh AutoClipper — beserta estimasi biaya API.
          </p>
        </div>
        <Button onClick={handleExportCSV} disabled={filtered.length === 0} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* F17: API Cost Summary */}
      {clips.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <span className="text-xs text-muted-foreground font-medium">Total Clips</span>
              <Film className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{clips.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <span className="text-xs text-muted-foreground font-medium">Posted</span>
              <Film className="h-4 w-4 text-violet-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold">{clips.filter(c => c.status === "POSTED").length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-1 pt-4 px-4">
              <span className="text-xs text-muted-foreground font-medium">Est. Total API Cost</span>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-2xl font-bold text-yellow-400">${totalCost.toFixed(4)}</div>
              <p className="text-[10px] text-muted-foreground">Deepgram + LLM estimate</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            className="pl-8 h-9 text-sm"
            placeholder="Search by project or caption..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {["all", "PENDING", "RENDERING", "COMPLETED", "POSTED"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border hover:border-primary/50"}`}
            >
              {s === "all" ? "All" : STATUS_BADGE[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Clip list */}
      <Card>
        <CardHeader className="bg-muted/20 border-b px-4 py-3">
          <div className="grid grid-cols-[1fr_80px_80px_80px_90px_80px_80px] gap-2 text-xs font-semibold text-muted-foreground">
            <span>Project / Caption</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Score</span>
            <span>API Cost Est.</span>
            <span>Created</span>
            <span>Actions</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-border">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-4 py-3">
                <Skeleton className="h-5 w-full" />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Film className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">No clips found.</p>
            </div>
          ) : (
            filtered.map(c => {
              const score = getViralityScore(c.scores);
              const badge = STATUS_BADGE[c.status] || { label: c.status, class: "bg-muted" };
              const renderedAsset = c.assets?.find(a => a.kind === "video");
              return (
                <div key={c.id} className="grid grid-cols-[1fr_80px_80px_80px_90px_80px_80px] gap-2 items-center px-4 py-3 hover:bg-muted/20 transition-colors text-xs">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">{c.projectTitle || "Unknown Project"}</p>
                    <p className="text-muted-foreground truncate">{c.caption || "—"}</p>
                  </div>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />{formatDuration(c.startMs, c.endMs)}
                  </span>
                  <Badge className={`text-[10px] px-1.5 py-0 w-fit ${badge.class}`}>{badge.label}</Badge>
                  <span className={score !== null ? (score >= 80 ? "text-green-400 font-bold" : score >= 60 ? "text-yellow-400 font-bold" : "text-muted-foreground") : "text-muted-foreground"}>
                    {score !== null ? `${score}/100` : "—"}
                  </span>
                  <span className="text-yellow-500 font-mono">{estimateApiCost(c.startMs, c.endMs)}</span>
                  <span className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString("id-ID")}</span>
                  <div className="flex items-center gap-1">
                    <Link href={`/projects/detail?id=${c.projectId}`}>
                      <Button variant="ghost" size="icon" className="h-6 w-6" title="Open Project">
                        <FolderOpen className="h-3 w-3" />
                      </Button>
                    </Link>
                    {renderedAsset && (
                      <>
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6"
                          title="Show in Folder"
                          onClick={() => window.electronAPI?.showItemInFolder(renderedAsset.storagePath)}
                        >
                          <Film className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost" size="icon" className="h-6 w-6 text-indigo-400 hover:text-indigo-300"
                          title="Generate Client Review Link"
                          onClick={() => handleCreateReviewLink(c.id, c.projectId, renderedAsset.storagePath)}
                          disabled={uploadingClipId === c.id}
                        >
                          {uploadingClipId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <MessageSquare className="h-3 w-3" />}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
