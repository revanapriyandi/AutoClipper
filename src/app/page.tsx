"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, FolderOpen, Clock, Tag, UploadCloud, X, FileVideo } from "lucide-react";
// Global window.electronAPI types are declared in src/types/electron.d.ts

interface Project {
  id: string;
  title: string;
  sourcePath: string;
  durationMs: number;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const [title, setTitle] = useState("");
  const [sourcePath, setSourcePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

  // Drag and Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string } | null>(null);

  const fetchProjects = async () => {
    try {
      const api = window.electronAPI;
      if (!api) throw new Error("Electron API not found");
      const data = await api.dbGetProjects();
      if (data.success && data.projects) setProjects(data.projects as Project[]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const path = (file as File & { path: string }).path; // In Electron, File object has a full path property
      if (path) {
        handleFileSelection(path, file.name);
      }
    }
  };

  const handleBrowseFile = async () => {
    if (window.electronAPI?.openFilePicker) {
      const res = await window.electronAPI.openFilePicker();
      if (res.success && res.filePath) {
        const name = res.filePath.split(/[\\/]/).pop() || "Video File";
        handleFileSelection(res.filePath, name);
      }
    }
  };

  const handleFileSelection = (path: string, name: string) => {
    setSourcePath(path);
    // Remove extension for default title
    const titleWithoutExt = name.replace(/\.[^/.]+$/, "");
    setTitle(titleWithoutExt);
    setSelectedFile({ path, name });
    setErrorMsg("");
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    setSourcePath("");
    setTitle("");
    setErrorMsg("");
  };

  const handleCreateProject = async () => {
    if (!title || !sourcePath) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const api = window.electronAPI;
      if (!api) throw new Error("Electron API not found");
      const data = await api.dbCreateProject({ title, sourcePath }) as { success: boolean, project?: Project, error?: string };
      if (!data.success) throw new Error(data.error || "Failed to create project");

      cancelSelection();
      fetchProjects();
    } catch (err: unknown) {
      setErrorMsg((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor: Record<string, string> = {
    DRAFT: "bg-muted text-muted-foreground",
    TRANSCRIBING: "bg-blue-500/20 text-blue-400",
    GENERATING: "bg-yellow-500/20 text-yellow-400",
    READY: "bg-green-500/20 text-green-400",
  };

  const isUploadActive = selectedFile !== null;

  return (
    <div className="grid gap-8 pb-10">
      {/* ── Header ──────────────────────────────────── */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
        <p className="text-muted-foreground text-sm mt-1">{t("description")}</p>
      </div>

      {/* ── Upload Area / Dropzone ─────────────────── */}
      {!isUploadActive ? (
        <Card 
          className={`border-dashed transition-all duration-200 ease-in-out ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border/60 hover:border-primary/50'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className={`flex flex-col items-center justify-center text-center p-12 ${(projects.length === 0 && !fetching) ? 'py-24' : ''}`}>
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <UploadCloud className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight mb-2">Drag & Drop Long Video Here</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
              Upload long-form podcasts, streams, or lectures (MP4, MKV, MOV). AutoClipper will analyze and extract the best moments.
            </p>
            <Button onClick={handleBrowseFile} size="lg" className="rounded-full shadow-lg">
              <FolderOpen className="mr-2 h-5 w-5" />
              Browse File to Upload
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Or drag and drop from your file explorer
            </p>
          </CardContent>
        </Card>
      ) : (
        /* ── Project Creation Form (Step 2) ────────── */
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="bg-muted/30 border-b relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
              onClick={cancelSelection}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <FileVideo className="h-5 w-5 text-primary" />
              Upload Video
            </CardTitle>
            <CardDescription>
              We found a video. Give it a name to start processing.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="font-semibold">{t("dialog.projectName")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("dialog.projectNamePlaceholder")}
                  className="bg-background"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourcePath" className="font-semibold">{t("dialog.videoSource")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="sourcePath"
                    value={sourcePath}
                    readOnly
                    className="flex-1 bg-muted font-mono text-xs opacity-70"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBrowseFile}
                    disabled={loading}
                  >
                    Change
                  </Button>
                </div>
              </div>
            </div>
            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm mt-4">
                {errorMsg}
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-muted/20 border-t justify-end gap-2 p-4">
            <Button variant="ghost" onClick={cancelSelection} disabled={loading}>
              {t("dialog.cancel")}
            </Button>
            <Button onClick={handleCreateProject} disabled={loading || !title || !sourcePath} className="min-w-[140px]">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("dialog.creating")}
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* ── Project Grid ────────────────────────────── */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">Recent Projects</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fetching ? (
            // Skeleton loading cards
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="pb-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-full mt-1" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))
          ) : projects.length === 0 ? (
            <Card className="col-span-full flex flex-col items-center justify-center py-12 border-dashed bg-muted/20">
              <p className="text-muted-foreground text-sm">No projects created yet. Upload a video above to begin.</p>
            </Card>
          ) : (
            projects.map((p) => (
              <Card key={p.id} className="flex flex-col hover:border-primary/50 transition-colors shadow-sm cursor-pointer group">
                <CardHeader className="pb-3">
                  <CardTitle className="line-clamp-1 text-base group-hover:text-primary transition-colors">{p.title}</CardTitle>
                  <CardDescription className="line-clamp-1 text-xs" title={p.sourcePath}>
                    {p.sourcePath.split(/[\\/]/).pop()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-1 flex flex-col justify-end">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.round(p.durationMs / 1000)}s
                    </span>
                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${statusColor[p.status] || "bg-muted text-muted-foreground"}`}>
                      <Tag className="h-2.5 w-2.5" />
                      {p.status}
                    </span>
                  </div>
                  <Link href={`/projects/detail?id=${p.id}`} className="w-full">
                    <Button variant="secondary" className="w-full" size="sm">
                      {t("project.open")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
