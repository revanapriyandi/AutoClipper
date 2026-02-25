"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Play, Download, Edit3, Send, Music, FolderOpen, ExternalLink } from "lucide-react";
import { ScoredCandidate } from "@/lib/ai/scoring";
import { enrichCandidates } from "@/lib/ai/enrichment";
import { generateCandidates } from "@/lib/ai/segmentation";
import { scoreCandidate } from "@/lib/ai/scoring";

// Global window.electronAPI types are declared in src/types/electron.d.ts

// ---- Types ----
interface ProjectRecord {
  id: string;
  title: string;
  sourcePath: string;
  durationMs: number;
  status: string;
}

// ---- Component ----
export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<ScoredCandidate[]>([]);
  const [status, setStatus] = useState("Loading project data...");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [outputPaths, setOutputPaths] = useState<Record<number, string>>({});
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        const api = window.electronAPI;
        if (!api) throw new Error("Electron API not found");
        const data = await api.dbGetProject(params.id) as { success: boolean, project?: ProjectRecord, error?: string };
        if (data.success && data.project) {
          setProject(data.project);
          setStatus("Ready. Click 'Auto-Cut Clips' to start the AI pipeline.");
          // Load video preview
          loadVideoPreview(data.project.sourcePath);
        } else {
          setStatus("Failed to load project: " + data.error);
        }
      } catch (err: unknown) {
        setStatus("Error loading project: " + (err instanceof Error ? err.message : "Unknown error"));
      }
    }
    loadProject();
  }, [params.id]);

  const loadVideoPreview = async (sourcePath: string) => {
    const api = window.electronAPI;
    if (!api?.readVideoAsDataUrl) return;
    const res = await api.readVideoAsDataUrl(sourcePath);
    if (res.success && res.dataUrl) setVideoSrc(res.dataUrl);
  };

  // ---- Subtitle Editor State ----
  const [editingClipIndex, setEditingClipIndex] = useState<number | null>(null);
  const [editedChunks, setEditedChunks] = useState<{
    startMs: number; endMs: number; text: string;
    words: { startMs: number; endMs: number; text: string }[];
  }[]>([]);

  // ---- Styling State ----
  const [fontName, setFontName] = useState("Arial");
  const [primaryColor, setPrimaryColor] = useState("&H0000FFFF");
  const [outlineColor, setOutlineColor] = useState("&H00000000");
  const [alignment, setAlignment] = useState("2");
  const [marginV, setMarginV] = useState("150");

  // ---- B-Roll & Music ----
  const [brollKeywordMap, setBrollKeywordMap] = useState<Record<number, string[]>>({});
  const [bgMusicPath, setBgMusicPath] = useState("");

  // ============================
  // REAL AI Pipeline
  // ============================
  const handleGenerateClips = async () => {
    if (!project) return;
    setLoading(true);
    setCandidates([]);

    const api = window.electronAPI;
    const isElectron = !!api;

    try {
      // ---- Step 1: Get API key ----
      let deepgramKey = "";
      if (isElectron && api.getKey) {
        const keyRes = await api.getKey("deepgram_key");
        deepgramKey = keyRes.value || "";
      }
      if (!deepgramKey) {
        setStatus("⚠️ Deepgram API Key belum diset di Settings. Menggunakan mock data...");
        loadMockData();
        return;
      }

      // ---- Step 2: Transcribe ----
      setStatus("🎙️ Extracting audio & transcribing with Deepgram...");
      const transcribeRes = await api!.aiTranscribe(project.sourcePath, deepgramKey);
      if (!transcribeRes.success || !transcribeRes.results) {
        throw new Error("Transcription failed: " + transcribeRes.error);
      }

      const words = transcribeRes.results.channels[0].alternatives[0].words;
      const segments = words.map((w: { word: string; start: number; end: number }) => ({
        start: w.start,
        end: w.end,
        text: w.word,
        words: [{ word: w.word, start: w.start, end: w.end, confidence: 1, punctuated_word: w.word }]
      }));

      // ---- Step 3: Segment ----
      setStatus("✂️ Segmenting transcript into viral clip candidates...");
      const rawCandidates = generateCandidates(segments, { minDurationSec: 15, idealDurationSec: 30, maxDurationSec: 60 });

      if (rawCandidates.length === 0) {
        setStatus("No clip candidates found. Try a longer video.");
        setLoading(false);
        return;
      }

      // ---- Step 4: Score top candidates (limited to 5 to save API calls) ----
      setStatus(`🤖 Scoring ${Math.min(rawCandidates.length, 5)} candidates with LLM...`);
      const toScore = rawCandidates.slice(0, 5);
      const scored: ScoredCandidate[] = [];

      for (const candidate of toScore) {
        const result = await scoreCandidate(candidate);
        if (result) scored.push(result);
      }

      scored.sort((a, b) => b.totalScore - a.totalScore);

      // ---- Step 5: Enrich ----
      setStatus("✨ Injecting emojis & B-Roll keywords...");
      const { enriched, brollKeywordMap: newMap } = enrichCandidates(scored);
      setCandidates(enriched);
      setBrollKeywordMap(newMap);
      setStatus(`✅ Done! ${enriched.length} clip(s) ready. Click 'Render 9:16' to export.`);

    } catch (err: unknown) {
      setStatus("❌ Error: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const { enriched, brollKeywordMap: newMap } = enrichCandidates([{
      startMs: 15000, endMs: 45000, wordCount: 42,
      transcriptText: "This is a viral hook that catches attention. It delivers value immediately and ends with a strong payoff that viewers will remember.",
      chunks: [
        { startMs: 15000, endMs: 20000, text: "This is a viral hook that catches attention.", words: [
          { startMs: 15000, endMs: 15800, text: "This" }, { startMs: 15800, endMs: 16200, text: "is" },
          { startMs: 16200, endMs: 16600, text: "a" }, { startMs: 16600, endMs: 17500, text: "viral" }, { startMs: 17500, endMs: 20000, text: "hook" }
        ]},
        { startMs: 20000, endMs: 30000, text: "It delivers value immediately.", words: [] },
        { startMs: 30000, endMs: 45000, text: "Ends with a strong payoff viewers remember.", words: [] },
      ],
      scores: { hook: 23, clarity: 20, payoff: 22, standalone: 24, explanation: "Strong viral hook with clear value." },
      totalScore: 89
    }]);
    setCandidates(enriched);
    setBrollKeywordMap(newMap);
    setLoading(false);
    setStatus("✅ Mock data loaded (add Deepgram key in Settings for real processing).");
  };

  // ============================
  // Render Clip
  // ============================
  const handleRender = async (clip: ScoredCandidate, index: number) => {
    if (!project) return;
    setStatus(`⚙️ Starting render for Clip #${index + 1}...`);

    const api = window.electronAPI;
    if (!api?.enqueueJob) {
      setStatus("Render requires Electron environment.");
      return;
    }

    const outputPath = project.sourcePath.replace(/\.[^/.]+$/, `_clip${index + 1}_${Date.now()}.mp4`);

    try {
      const res = await api.enqueueJob('RENDER', {
        sourcePath: project.sourcePath,
        outputPath,
        startMs: clip.startMs,
        endMs: clip.endMs,
        segments: clip.chunks.map(c => ({
          start: c.startMs / 1000, end: c.endMs / 1000, text: c.text,
          words: c.words.map(w => ({ start: w.startMs / 1000, end: w.endMs / 1000, text: w.text }))
        })),
        isVerticalTarget: true,
        bgMusicPath: bgMusicPath || null,
        style: { font: fontName, primaryColor, outlineColor, alignment: parseInt(alignment), marginV: parseInt(marginV) }
      });

      if (!res.success || !res.jobId) {
        setStatus("Failed to enqueue render: " + res.error);
        return;
      }

      const jobId = res.jobId;
      setStatus(`⏳ Render job ${jobId} queued. Processing...`);

      const interval = setInterval(async () => {
        const jobRes = await api.getJob(jobId);
        if (jobRes?.success && jobRes.job) {
          const job = jobRes.job;
          if (job.status === 'COMPLETED') {
            clearInterval(interval);
            setOutputPaths(prev => ({ ...prev, [index]: outputPath }));
            setStatus(`✅ Clip #${index + 1} rendered! Click 'Open File' to view it.`);
          } else if (job.status === 'FAILED') {
            clearInterval(interval);
            setStatus(`❌ Render failed: ${job.error}`);
          } else {
            setStatus(`⏳ Render status: ${job.status}...`);
          }
        }
      }, 2000);

    } catch (err: unknown) {
      setStatus("Error: " + (err instanceof Error ? err.message : "Unknown"));
    }
  };

  const handlePost = async (clip: ScoredCandidate) => {
    const api = window.electronAPI;
    if (!api?.enqueueJob) { setStatus("Post requires Electron."); return; }
    const res = await api.enqueueJob('POST', {
      transcriptText: clip.transcriptText,
      targetPlatform: "YouTube Shorts",
      scheduledTime: new Date(Date.now() + 86400000).toISOString()
    });
    setStatus(res.success ? `📅 Post job ${res.jobId} queued for tomorrow!` : `Failed: ${res.error}`);
  };

  const openEditor = (clip: ScoredCandidate, index: number) => {
    setEditingClipIndex(index);
    setEditedChunks([...clip.chunks]);
  };

  const saveSubtitles = () => {
    if (editingClipIndex !== null) {
      setCandidates(prev => {
        const next = [...prev];
        next[editingClipIndex].chunks = editedChunks;
        return next;
      });
    }
    setEditingClipIndex(null);
  };

  const updateChunk = (idx: number, field: string, value: string | number) => {
    setEditedChunks(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // ============================
  // Render
  // ============================
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{project ? project.title : "Project Studio"}</h2>
          <p className="text-muted-foreground text-sm">{project?.sourcePath}</p>
        </div>
        <Button onClick={handleGenerateClips} disabled={loading || !project}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          Auto-Cut Clips
        </Button>
      </div>

      {status && <p className="text-sm text-muted-foreground border p-2 rounded-md bg-muted/30">{status}</p>}

      {/* Background Music */}
      <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/40">
        <Music className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <div className="flex-1">
          <label className="text-xs font-semibold">Background Music (.mp3)</label>
          <div className="flex gap-2 mt-1">
            <Input className="h-7 text-xs flex-1" placeholder="C:\Music\lofi.mp3 (optional)" value={bgMusicPath} onChange={e => setBgMusicPath(e.target.value)} readOnly={!!(window.electronAPI)} />
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={async () => {
              const res = await window.electronAPI?.openFilePicker([{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }]);
              if (res?.success && res.filePath) setBgMusicPath(res.filePath);
            }}>
              <FolderOpen className="h-3 w-3 mr-1" /> Browse
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Video Player */}
        <Card>
          <CardHeader>
            <CardTitle>Video Preview</CardTitle>
            <CardDescription>Original Source — {project ? `${Math.round((project.durationMs || 0) / 1000)}s` : "loading..."}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center bg-black rounded-md min-h-[280px] items-center overflow-hidden p-0">
            {videoSrc ? (
              <video ref={videoRef} src={videoSrc} controls className="w-full max-h-[360px] rounded-md" />
            ) : (
              <p className="text-muted-foreground text-sm p-6 text-center">
                {project ? "Loading video preview..." : "Select a project to preview video."}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Clip Cards */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">AI Generated Clips</h3>
          {candidates.length === 0 && !loading && (
            <p className="text-sm text-muted-foreground border p-4 rounded-md">No clips generated yet. Click Auto-Cut to begin.</p>
          )}
          {candidates.map((c, i) => (
            <Card key={i}>
              <CardHeader className="py-3">
                <CardTitle className="text-md flex justify-between">
                  <span>Clip #{i + 1}</span>
                  <span className="text-blue-500">Score: {c.totalScore}/100</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 text-sm">
                <p className="mb-2 line-clamp-2 text-muted-foreground">&quot;{c.transcriptText}&quot;</p>
                {brollKeywordMap[i]?.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-2">
                    <span className="text-xs text-muted-foreground">B-Roll:</span>
                    {brollKeywordMap[i].map((kw, ki) => (
                      <span key={ki} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 justify-between items-center mt-4">
                  <span className="text-xs text-muted-foreground">{(c.startMs / 1000).toFixed(1)}s – {(c.endMs / 1000).toFixed(1)}s</span>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <Button variant="outline" size="sm" onClick={() => openEditor(c, i)}>
                      <Edit3 className="mr-1 h-3 w-3" /> Edit Subs
                    </Button>
                    <Button size="sm" onClick={() => handleRender(c, i)}>
                      <Download className="mr-1 h-3 w-3" /> Render 9:16
                    </Button>
                    {outputPaths[i] && (
                      <Button variant="secondary" size="sm" onClick={() => window.electronAPI?.showItemInFolder(outputPaths[i])}>
                        <ExternalLink className="mr-1 h-3 w-3" /> Open File
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handlePost(c)}>
                      <Send className="mr-1 h-3 w-3" /> Schedule Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subtitle Editor Dialog */}
      <Dialog open={editingClipIndex !== null} onOpenChange={(open) => !open && setEditingClipIndex(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Subtitles & Style</DialogTitle>
            <DialogDescription>Customize font, colors, positions, and adjust subtitle timings.</DialogDescription>
          </DialogHeader>

          {/* Style Controls */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 py-2 border-b">
            {[
              { label: "Font", value: fontName, setter: setFontName, options: [["Arial","Arial"],["Impact","Impact"],["Roboto","Roboto"],["Comic Sans MS","Comic Sans"]] },
              { label: "Karaoke Color", value: primaryColor, setter: setPrimaryColor, options: [["&H0000FFFF","Yellow"],["&H0000FF00","Green"],["&H00FF0000","Blue"],["&H00FFFFFF","White"]] },
              { label: "Outline", value: outlineColor, setter: setOutlineColor, options: [["&H00000000","Black"],["&H000000FF","Red"],["&H00FFFFFF","White"],["&H00808080","Gray"]] },
              { label: "Alignment", value: alignment, setter: setAlignment, options: [["2","Bottom"],["8","Top"],["5","Middle"]] },
            ].map(({ label, value, setter, options }) => (
              <div key={label}>
                <label className="text-xs font-semibold">{label}</label>
                <select className="w-full text-sm border rounded p-1 mt-1" value={value} onChange={e => setter(e.target.value)}>
                  {options.map(([val, name]) => <option key={val} value={val}>{name}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="text-xs font-semibold">Margin Y</label>
              <Input type="number" className="h-8 mt-1" value={marginV} onChange={e => setMarginV(e.target.value)} />
            </div>
          </div>

          {/* Timing Editor */}
          <div className="grid gap-2 py-4 max-h-[50vh] overflow-y-auto">
            {editedChunks.map((chunk, idx) => (
              <div key={idx} className="flex gap-2 items-center text-sm">
                <span className="w-6 text-muted-foreground">{idx + 1}.</span>
                <Input type="number" className="w-24 h-8" value={chunk.startMs} onChange={e => updateChunk(idx, 'startMs', parseInt(e.target.value) || 0)} />
                <span className="text-muted-foreground">–</span>
                <Input type="number" className="w-24 h-8" value={chunk.endMs} onChange={e => updateChunk(idx, 'endMs', parseInt(e.target.value) || 0)} />
                <Input className="flex-1 h-8" value={chunk.text} onChange={e => updateChunk(idx, 'text', e.target.value)} />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClipIndex(null)}>Cancel</Button>
            <Button onClick={saveSubtitles}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
