"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  RefreshCw, RotateCcw, X, CheckCircle2, Clock, Loader2,
  AlertCircle, ListTodo, Play, Ban
} from "lucide-react";

interface Job {
  id: string;
  type: string;
  status: string;
  attempts: number;
  error?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface JobProgress {
  jobId: string;
  percent: number;
  label: string;
}

interface JobStatusChange {
  jobId: string;
  status: string;
  error?: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  QUEUED:        { label: "Queued",      color: "bg-muted text-muted-foreground",       icon: Clock },
  PROCESSING:    { label: "Processing",  color: "bg-blue-500/20 text-blue-400",          icon: Loader2 },
  RETRY_PENDING: { label: "Retrying",    color: "bg-yellow-500/20 text-yellow-400",      icon: RotateCcw },
  COMPLETED:     { label: "Completed",   color: "bg-green-500/20 text-green-400",        icon: CheckCircle2 },
  FAILED:        { label: "Failed",      color: "bg-red-500/20 text-red-400",            icon: AlertCircle },
  CANCELLED:     { label: "Cancelled",   color: "bg-muted/50 text-muted-foreground/60",  icon: Ban },
};

const TYPE_LABELS: Record<string, string> = {
  RENDER: "🎬 Render",
  POST:   "📤 Post",
  COMPILATION: "🎬 Compilation",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<Record<string, JobProgress>>({});
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const api = window.electronAPI as unknown as {
        jobGetAll?: (opts?: { status?: string }) => Promise<{ success: boolean; jobs?: Job[]; total?: number }>;
      };
      const res = await api.jobGetAll?.({});
      if (res?.success && res.jobs) setJobs(res.jobs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();

    const api = window.electronAPI as unknown as {
      onJobProgress?: (cb: (d: JobProgress) => void) => () => void;
      onJobStatusChanged?: (cb: (d: JobStatusChange) => void) => () => void;
    };

    const unsubProgress = api.onJobProgress?.((data) => {
      setProgress(prev => ({ ...prev, [data.jobId]: data }));
    });

    const unsubStatus = api.onJobStatusChanged?.((data) => {
      setJobs(prev => prev.map(j => j.id === data.jobId ? { ...j, status: data.status, error: data.error } : j));
      if (data.status === 'COMPLETED' || data.status === 'FAILED') {
        setTimeout(() => {
          setProgress(prev => { const copy = { ...prev }; delete copy[data.jobId]; return copy; });
        }, 3000);
      }
    });

    return () => {
      unsubProgress?.();
      unsubStatus?.();
    };
  }, [loadJobs]);

  const handleRetry = async (jobId: string) => {
    const api = window.electronAPI as unknown as {
      jobRetry?: (opts: { jobId: string }) => Promise<{ success: boolean }>;
    };
    await api.jobRetry?.({ jobId });
    loadJobs();
  };

  const handleCancel = async (jobId: string) => {
    const api = window.electronAPI as unknown as {
      jobCancel?: (opts: { jobId: string }) => Promise<{ success: boolean }>;
    };
    await api.jobCancel?.({ jobId });
    setJobs(prev => prev.filter(j => j.id !== jobId));
  };

  const filteredJobs = statusFilter === "ALL" ? jobs : jobs.filter(j => j.status === statusFilter);

  const counts = jobs.reduce((acc, j) => {
    acc[j.status] = (acc[j.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const FILTERS = ["ALL", "QUEUED", "PROCESSING", "RETRY_PENDING", "COMPLETED", "FAILED"];

  return (
    <div className="grid gap-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ListTodo className="h-7 w-7 text-primary" />
            Job Queue
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Monitor render and upload jobs in real-time. {jobs.length} total jobs.
          </p>
        </div>
        <Button onClick={loadJobs} disabled={loading} variant="outline" size="sm" className="gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: "QUEUED", label: "Queued", color: "text-muted-foreground" },
          { key: "PROCESSING", label: "Processing", color: "text-blue-400" },
          { key: "RETRY_PENDING", label: "Retrying", color: "text-yellow-400" },
          { key: "COMPLETED", label: "Completed", color: "text-green-400" },
          { key: "FAILED", label: "Failed", color: "text-red-400" },
        ].map(({ key, label, color }) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all ${statusFilter === key ? "border-primary" : "hover:border-primary/40"}`}
            onClick={() => setStatusFilter(prev => prev === key ? "ALL" : key)}
          >
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{counts[key] || 0}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              statusFilter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {f === "ALL" ? `All (${jobs.length})` : `${f} (${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Job List */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-1/3 mb-2" />
                <Skeleton className="h-3 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 flex flex-col items-center text-center text-muted-foreground">
              <Play className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No jobs found. Render or post a clip to create jobs.</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map(job => {
            const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG.QUEUED;
            const Icon = cfg.icon;
            const jobProgress = progress[job.id];

            return (
              <Card key={job.id} className="transition-all hover:border-primary/30">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-muted">
                      <Icon className={`h-4 w-4 ${job.status === "PROCESSING" ? "animate-spin" : ""} ${cfg.color.split(" ")[1]}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {TYPE_LABELS[job.type] || job.type}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono">{job.id.slice(0, 12)}…</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`text-[10px] px-2 ${cfg.color}`}>{cfg.label}</Badge>
                    {job.status === "FAILED" && (
                      <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => handleRetry(job.id)}>
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    )}
                    {(job.status === "QUEUED" || job.status === "RETRY_PENDING") && (
                      <Button size="icon" variant="outline" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleCancel(job.id)}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pb-3 px-4 space-y-2">
                  {/* Progress bar (only when processing) */}
                  {job.status === "PROCESSING" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{jobProgress?.label || "Processing…"}</span>
                        <span>{jobProgress?.percent ?? 0}%</span>
                      </div>
                      <Progress value={jobProgress?.percent ?? 0} className="h-1.5" />
                    </div>
                  )}

                  {/* Error message */}
                  {job.error && (
                    <p className="text-xs text-red-400 bg-red-500/10 px-2 py-1.5 rounded border border-red-500/20 break-all">
                      {job.error}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                    <span>Attempt {job.attempts}/{3}</span>
                    <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
                    {job.scheduledAt && (
                      <span className="text-yellow-400">Scheduled: {new Date(job.scheduledAt).toLocaleString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
