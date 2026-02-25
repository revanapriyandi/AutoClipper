"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderOpen, Film, Clock, Search } from "lucide-react";

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
  PENDING:    { label: "Pending",    class: "bg-muted text-muted-foreground" },
  RENDERING:  { label: "Rendering", class: "bg-blue-500/20 text-blue-400" },
  COMPLETED:  { label: "Rendered",  class: "bg-green-500/20 text-green-400" },
  POSTED:     { label: "Posted",    class: "bg-violet-500/20 text-violet-400" },
};

export default function HistoryPage() {
  const [clips, setClips] = useState<HistoryClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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

  const filtered = clips.filter(c =>
    !search ||
    c.projectTitle?.toLowerCase().includes(search.toLowerCase()) ||
    c.caption?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDuration = (startMs: number, endMs: number) =>
    `${Math.round((endMs - startMs) / 1000)}s`;

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clip History</h2>
          <p className="text-muted-foreground text-sm mt-1">Semua klip yang pernah dibuat di seluruh proyek.</p>
        </div>
        <div className="flex items-center gap-2 w-64">
          <Search className="h-4 w-4 text-muted-foreground absolute ml-2" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari klip..."
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-4 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-3 w-1/2" /></CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="col-span-full flex flex-col items-center justify-center py-16 border-dashed">
          <Film className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground text-sm">
            {search ? `Tidak ada klip untuk "${search}"` : "Belum ada klip yang dirender."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(clip => {
            let scores: Record<string, number> = {};
            try { scores = JSON.parse(clip.scores); } catch {}
            const st = STATUS_BADGE[clip.status] || STATUS_BADGE.PENDING;
            const videoAsset = clip.assets?.find(a => a.kind === "video");

            return (
              <Card key={clip.id} className="flex flex-col hover:border-primary/40 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium line-clamp-1">
                      {clip.projectTitle || `Project ${clip.projectId.slice(0, 8)}`}
                    </CardTitle>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.class}`}>
                      {st.label}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(clip.startMs, clip.endMs)}
                    </span>
                    {scores.total !== undefined && (
                      <span className="flex items-center gap-1">
                        ⭐ {Math.round(scores.total * 10) / 10}
                      </span>
                    )}
                    <span className="text-muted-foreground/60">
                      {new Date(clip.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  {clip.caption && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{clip.caption}</p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Link href={`/projects/${clip.projectId}`}>
                      <Button variant="outline" size="sm" className="text-xs h-7">
                        <FolderOpen className="h-3 w-3 mr-1" /> Buka Studio
                      </Button>
                    </Link>
                    {videoAsset && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => window.electronAPI?.showItemInFolder(videoAsset.storagePath)}
                      >
                        <Film className="h-3 w-3 mr-1" /> File
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} dari {clips.length} klip ditampilkan
        </p>
      )}
    </div>
  );
}
