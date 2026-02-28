"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, FolderOpen, Clock, UploadCloud, X, FileVideo, Search, Link2, DownloadCloud } from "lucide-react";

interface Project {
  id: string;
  title: string;
  sourcePath: string;
  durationMs: number;
  status: string;
  tags?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [title, setTitle] = useState("");
  const [sourcePath, setSourcePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [projectTags, setProjectTags] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string } | null>(null);

  // Download state
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchProjects = async () => {
    try {
      const api = window.electronAPI;
      if (!api) { console.warn("Electron API not found (Web mode)"); return; }
      const data = await api.dbGetProjects();
      if (data.success && data.projects) setProjects(data.projects as Project[]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Listen for download progress updates from backend
  useEffect(() => {
    if (window.electronAPI?.onDownloadProgress) {
      window.electronAPI.onDownloadProgress((percent: number) => {
        setDownloadProgress(percent);
      });
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    if (e.dataTransfer.files?.length > 0) {
      const file = e.dataTransfer.files[0];
      const path = (file as File & { path: string }).path;
      if (path) handleFileSelection(path, file.name);
    }
  };

  const handleBrowseFile = async () => {
    if (window.electronAPI?.openFilePicker) {
      const res = await window.electronAPI.openFilePicker();
      if (res.success && res.filePath) {
        const name = res.filePath.split(/[\/\\]/).pop() || "Video File";
        handleFileSelection(res.filePath, name);
      }
    }
  };

  const handleDownloadUrl = async () => {
    if (!downloadUrl.trim()) return;
    setIsDownloading(true);
    setErrorMsg("");
    setDownloadProgress(0);

    try {
      if (!window.electronAPI?.downloadVideoUrl) throw new Error("Video downloader not available");
      const res = await window.electronAPI.downloadVideoUrl(downloadUrl.trim());
      if (!res.success) throw new Error(res.error || "Download failed");
      
      const filePath = res.filePath;
      if (filePath) {
        const name = "Downloaded Video: " + downloadUrl.split('/').pop() || "video.mp4";
        handleFileSelection(filePath, name);
        setDownloadUrl("");
      }
    } catch (err: unknown) {
      setErrorMsg((err as Error).message);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleFileSelection = (path: string, name: string) => {
    setSourcePath(path);
    setTitle(name.replace(/\.[^/.]+$/, ""));
    setSelectedFile({ path, name });
    setErrorMsg("");
  };

  const cancelSelection = () => { setSelectedFile(null); setSourcePath(""); setTitle(""); setErrorMsg(""); setStatusMsg(""); };

  const handleCreateProject = async () => {
    if (!title || !sourcePath) return;
    setLoading(true); setErrorMsg("");
    try {
      const api = window.electronAPI;
      if (!api) { console.warn("Electron API not found (Web mode)"); return; }
      const data = await api.dbCreateProject(title, sourcePath) as { success: boolean; project?: Project; error?: string };
      if (!data.success) throw new Error(data.error || "Failed to create project");
      if (projectTags.trim() && data.project?.id) {
        await (api as unknown as { dbUpdateProjectTags?: (d: { id: string; tags: string }) => Promise<unknown> })?.dbUpdateProjectTags?.({ id: data.project.id, tags: projectTags.trim() });
      }
      
      if (data.project?.id) {
        setStatusMsg("⏳ Memisahkan audio dari video...");
        try {
          await (api as unknown as { aiExtractAudio?: (path: string, id: string) => Promise<unknown> })?.aiExtractAudio?.(sourcePath, data.project.id);
        } catch (e) {
          console.warn("Background audio extraction failed, but continuing project creation", e);
        }
      }

      cancelSelection(); setProjectTags(""); fetchProjects();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
      setStatusMsg("");
    }
  };

  const statusColor: Record<string, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    TRANSCRIBING: "bg-blue-500/20 text-blue-400",
    GENERATING: "bg-yellow-500/20 text-yellow-400",
    READY: "bg-green-500/20 text-green-400",
  };

  const isUploadActive = selectedFile !== null;
  const allTags = Array.from(new Set(projects.flatMap(p => (p.tags || "").split(",").map(t => t.trim()).filter(Boolean))));
  const filteredProjects = projects.filter(p => {
    const matchSearch = search === "" || p.title.toLowerCase().includes(search.toLowerCase());
    const matchTag = tagFilter === "" || (p.tags || "").split(",").map(t => t.trim()).includes(tagFilter);
    return matchSearch && matchTag;
  });

  return (
    <div className="flex flex-col gap-3 h-full">

      {/* ── Page header ── */}
      <div>
        <h1 className="text-sm font-semibold">{t("title")}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{t("description")}</p>
      </div>

      {/* ── Drop zone / Upload panel ── */}
      {!isUploadActive ? (
        <div className="flex flex-col gap-3">
          <div
            className={`border rounded flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-dashed border-border hover:border-primary/40 hover:bg-muted/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseFile}
          >
            <div className="p-1.5 bg-primary/10 rounded shrink-0">
              <UploadCloud className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Drop video file here to import</p>
              <p className="text-[11px] text-muted-foreground">MP4, MKV, MOV — AutoClipper will extract the best moments</p>
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs shrink-0" onClick={e => { e.stopPropagation(); handleBrowseFile(); }}>
              <FolderOpen className="h-3 w-3 mr-1" />Browse
            </Button>
          </div>
          
          <div className="flex flex-col gap-1.5 p-3 border border-border rounded bg-card/30">
            <Label className="text-[11px] font-semibold text-muted-foreground">ATAU IMPOR DARI URL</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Paste YouTube, TikTok, or Vimeo link here..." 
                  className="pl-9 h-8 text-xs bg-background" 
                  value={downloadUrl}
                  onChange={(e) => setDownloadUrl(e.target.value)}
                  disabled={isDownloading}
                  onKeyDown={(e) => e.key === 'Enter' && handleDownloadUrl()}
                />
              </div>
              <Button 
                size="sm" 
                className="h-8 text-xs min-w-[100px]" 
                disabled={!downloadUrl || isDownloading}
                onClick={handleDownloadUrl}
              >
                {isDownloading ? (
                  <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> {downloadProgress > 0 ? `${downloadProgress.toFixed(1)}%` : "Loading..."}</>
                ) : (
                  <><DownloadCloud className="mr-1.5 h-3.5 w-3.5" /> Download</>
                )}
              </Button>
            </div>
            {isDownloading && downloadProgress > 0 && (
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${downloadProgress}%` }} 
                />
              </div>
            )}
            {errorMsg && !isUploadActive && (
               <div className="px-2.5 py-1.5 mt-1 bg-destructive/10 border border-destructive/20 text-destructive rounded text-[11px] break-all">{errorMsg}</div>
            )}
          </div>
        </div>
      ) : (
        /* ── Project form ── */
        <div className="border border-border rounded bg-card">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2 min-w-0">
              <FileVideo className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="text-xs font-medium">New Project</span>
              <span className="text-[11px] text-muted-foreground font-mono truncate" title={sourcePath}>{sourcePath.split(/[\/\\]/).pop()}</span>
            </div>
            <button onClick={cancelSelection} disabled={loading} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="p-3 grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="title" className="text-[11px]">{t("dialog.projectName")}</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder={t("dialog.projectNamePlaceholder")} className="h-7 text-xs" autoFocus />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sourcePath" className="text-[11px]">{t("dialog.videoSource")}</Label>
              <div className="flex gap-1.5">
                <Input id="sourcePath" value={sourcePath} readOnly className="h-7 flex-1 font-mono text-[11px] text-muted-foreground" />
                <Button type="button" variant="outline" className="h-7 text-xs px-2" onClick={handleBrowseFile} disabled={loading}>Change</Button>
              </div>
            </div>
          </div>
          {statusMsg && <div className="mx-3 mb-3 px-2.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded text-[11px] flex items-center gap-2 shadow-sm font-medium"><Loader2 className="h-3.5 w-3.5 animate-spin" />{statusMsg}</div>}
          {errorMsg && <div className="mx-3 mb-3 px-2.5 py-1.5 bg-destructive/10 border border-destructive/20 text-destructive rounded text-[11px]">{errorMsg}</div>}
          <div className="flex items-center justify-end gap-1.5 px-3 py-2 border-t border-border bg-muted/20">
            <Button variant="ghost" className="h-7 text-xs" onClick={cancelSelection} disabled={loading}>{t("dialog.cancel")}</Button>
            <Button className="h-7 text-xs min-w-20" onClick={handleCreateProject} disabled={loading || !title || !sourcePath}>
              {loading ? <><Loader2 className="mr-1 h-3 w-3 animate-spin" />{t("dialog.creating")}</> : "Create Project"}
            </Button>
          </div>
        </div>
      )}

      {/* ── Projects section ── */}
      <div className="flex flex-col gap-1.5 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-widest">Recent Projects</h2>
          <div className="flex items-center gap-1.5">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setTagFilter(prev => prev === tag ? "" : tag)}
                className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                  tagFilter === tag ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >#{tag}</button>
            ))}
            <div className="relative">
              <Search className="absolute left-1.5 top-1.5 h-3 w-3 text-muted-foreground" />
              <Input className="pl-5 h-6 w-36 text-[11px]" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {/* File-explorer style list */}
        <div className="border border-border rounded overflow-hidden flex-1 min-h-0 overflow-y-auto">
          {/* Column headers */}
          <div className="grid text-[10px] uppercase tracking-widest text-muted-foreground/50 font-medium px-3 py-1.5 border-b border-border bg-muted/20 sticky top-0"
            style={{ gridTemplateColumns: '1fr 8rem 4.5rem 5.5rem 5rem' }}>
            <span>Project</span><span>File</span><span>Duration</span><span>Status</span><span></span>
          </div>

          {fetching ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grid items-center px-3 py-2 border-b border-border/40" style={{ gridTemplateColumns: '1fr 8rem 4.5rem 5.5rem 5rem' }}>
                <Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-4/5" /><Skeleton className="h-3 w-8" /><Skeleton className="h-4 w-14 rounded" /><Skeleton className="h-5 w-14 rounded" />
              </div>
            ))
          ) : filteredProjects.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-xs text-muted-foreground">No projects — drop a video file above to get started.</p>
            </div>
          ) : (
            filteredProjects.map(p => (
              <div key={p.id} className="grid items-center px-3 py-1.5 border-b border-border/40 hover:bg-muted/30 transition-colors group cursor-default"
                style={{ gridTemplateColumns: '1fr 8rem 4.5rem 5.5rem 5rem' }}>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{p.title}</p>
                  {p.tags && (
                    <div className="flex gap-1 mt-0.5">
                      {p.tags.split(",").map(t => t.trim()).filter(Boolean).map(tag => (
                        <span key={tag} className="text-[9px] px-1 py-px bg-muted rounded text-muted-foreground cursor-pointer hover:bg-primary/10" onClick={() => setTagFilter(tag)}>#{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground truncate pr-2" title={p.sourcePath}>{p.sourcePath.split(/[\/\\]/).pop()}</span>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />{Math.round((p.durationMs || 0) / 1000)}s
                </span>
                  <span className={`text-[10px] px-1.5 py-px rounded font-medium w-fit ${statusColor[p.status] || "bg-muted text-muted-foreground"}`}>{p.status}</span>
                  <div className="flex justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${p.title}"?`)) {
                          window.electronAPI?.dbDeleteProject(p.id).then(res => {
                            if (res.success) fetchProjects();
                            else alert(res.error || "Failed to delete project");
                          });
                        }
                      }}
                      title="Delete Project"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                    <Link href={`/projects/detail?id=${p.id}`}>
                      <Button variant="ghost" size="sm" className="h-6 text-[11px] px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {t("project.open")}
                      </Button>
                    </Link>
                  </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
