"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Loader2, FolderOpen, Clock, Tag } from "lucide-react";
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
  const tc = useTranslations("common");

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sourcePath, setSourcePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);

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

  const handleCreateProject = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const api = window.electronAPI;
      if (!api) throw new Error("Electron API not found");
      const data = await api.dbCreateProject({ title, sourcePath }) as { success: boolean, project?: Project, error?: string };
      if (!data.success) throw new Error(data.error || "Failed to create project");

      setOpen(false);
      setTitle("");
      setSourcePath("");
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

  return (
    <div className="grid gap-6">
      {/* ── Header ──────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("title")}</h2>
          <p className="text-muted-foreground text-sm mt-1">{t("description")}</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("newProject")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("dialog.title")}</DialogTitle>
              <DialogDescription>{t("dialog.description")}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("dialog.projectName")}</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("dialog.projectNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sourcePath">{t("dialog.videoSource")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="sourcePath"
                    value={sourcePath}
                    onChange={(e) => setSourcePath(e.target.value)}
                    placeholder={t("dialog.videoSourcePlaceholder")}
                    className="flex-1"
                    readOnly={!!(typeof window !== "undefined" && window.electronAPI)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      if (window.electronAPI?.openFilePicker) {
                        const res = await window.electronAPI.openFilePicker();
                        if (res.success && res.filePath) setSourcePath(res.filePath);
                      }
                    }}
                  >
                    <FolderOpen className="h-4 w-4 mr-1" />
                    {t("dialog.browse")}
                  </Button>
                </div>
              </div>
              {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                {t("dialog.cancel")}
              </Button>
              <Button onClick={handleCreateProject} disabled={loading || !title || !sourcePath}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? t("dialog.creating") : t("dialog.create")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Project Grid ────────────────────────────── */}
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
          <Card className="col-span-full flex flex-col items-center justify-center py-16 border-dashed">
            <PlusCircle className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground text-sm">{t("noProjects")}</p>
          </Card>
        ) : (
          projects.map((p) => (
            <Card key={p.id} className="flex flex-col hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-base">{p.title}</CardTitle>
                <CardDescription className="line-clamp-1 text-xs" title={p.sourcePath}>
                  {p.sourcePath}
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
                <Link href={`/projects/${p.id}`} className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    {t("project.open")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Skeleton import note: uses shadcn Skeleton */}
      {!fetching && projects.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {projects.length} {projects.length === 1 ? "project" : "projects"} · {tc("loading").replace("...", "")}
        </p>
      )}
    </div>
  );
}
