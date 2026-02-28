'use client';
/**
 * /app/editor/page.tsx
 * 
 * CapCut-style non-destructive video editor.
 * Opens with ?projectId=…&clipIndex=…&startMs=…&endMs=…&source=…
 * All editing state lives in React; export calls the existing render:clip IPC.
 */

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Palette, Zap, FlipHorizontal,
  FlipVertical, RotateCcw, Undo2, Redo2, Download, Clapperboard, Globe
} from 'lucide-react';

import { MultiExportModal } from './components/MultiExportModal';
import { ThumbnailModal } from './components/ThumbnailModal';
import { EditState, ColorFilter, DEFAULT_COLOR, generateId, msToTime, TimelineData, Track, VideoClip } from './types';
import { ResizablePanelGroup } from './components/ResizablePanel';
import { PreviewEngine } from './components/PreviewEngine';
import { MultiTrackTimeline } from './components/MultiTrackTimeline';
import { AIToolsPanel } from './components/AIToolsPanel';
import { TrackPropertiesPanel } from './components/TrackPropertiesPanel';

// ─── Helper ───────────────────────────────────────────────────────────────────

// ─── Main Component ───────────────────────────────────────────────────────────

function EditorInner() {
  const params = useSearchParams();
  const router = useRouter();
  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;

  const clipIndex  = parseInt(params.get('clipIndex') || '0', 10);
  const sourcePath = params.get('source')     || '';
  const initStart  = parseInt(params.get('startMs') || '0', 10);
  const initEnd    = parseInt(params.get('endMs')   || '60000', 10);

  const videoRef   = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [exportQuality, setExportQuality] = useState<'high' | 'medium' | 'fast'>('medium');
  const [showMultiExport, setShowMultiExport] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [activePanel, setActivePanel] = useState<'ai' | 'text' | 'audio' | 'color' | 'effects' | 'transitions' | 'keyframes' | 'image' | null>('color');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Undo/Redo history
  const historyRef = useRef<EditState[]>([]);
  const historyIndexRef = useRef(-1);

  const [timeline, setTimeline] = useState<TimelineData>(() => {
    // Basic migration from old EditState to new TimelineData
    const duration = initEnd - initStart;

    const initialVideoClip: VideoClip = {
      id: `clip_${generateId()}`,
      type: 'video',
      trackId: `trk_${generateId()}`,
      timelineStartMs: 0,
      timelineEndMs: duration,
      mediaStartMs: initStart,
      mediaEndMs: initEnd,
      sourcePath: sourcePath,
      name: 'Main Video',
      scale: 1.0,
      x: 50, y: 50, rotation: 0, flipH: false, flipV: false,
      speed: 1, volume: 1, muted: false,
      colorFilter: { ...DEFAULT_COLOR },
      keyframes: [], transition: 'none'
    };

    const videoTrack: Track = {
      id: initialVideoClip.trackId,
      type: 'video',
      name: 'Video 1',
      clips: [initialVideoClip],
      locked: false, muted: false, hidden: false
    };

    return {
      id: generateId(),
      durationMs: duration || 60000,
      tracks: [videoTrack],
      format: '9:16'
    };
  });

  // Keep old edit state around for legacy panels until they are migrated
  const [edit, setEditRaw] = useState<EditState>({
    startMs: initStart,
    endMs:   initEnd,
    speed: 1,
    flipH: false, flipV: false, rotate: 0,
    format: '9:16',
    textLayers: [],
    brollLayers: [],
    audioTrack: null,
    colorFilter: { ...DEFAULT_COLOR },
    videoVolume: 1,
    muteOriginal: false,
    transition: 'none',
    sfxEnabled: false,
    enhanceAudio: false,
    audioDucking: true,
    keyframes: [],
  });

  // Push state to undo history
  const setEdit = useCallback((updater: (prev: EditState) => EditState | EditState) => {
    setEditRaw(prev => {
      const next = typeof updater === 'function' ? (updater as (p: EditState) => EditState)(prev) : updater;
      // Trim forward history when branching
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
      historyRef.current.push(next);
      historyIndexRef.current = historyRef.current.length - 1;
      return next;
    });
  }, []);

  const undo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current--;
      setEditRaw(historyRef.current[historyIndexRef.current]);
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current++;
      setEditRaw(historyRef.current[historyIndexRef.current]);
    }
  };

  // ── Load video ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!api) {
        // Fallback for web environment when testing without Electron API
        setVideoUrl('');
        setLoading(false);
        return;
    }
    if (!sourcePath) { setLoading(false); return; }
    api.readVideoAsDataUrl(sourcePath).then(res => {
      if (res?.success && res.dataUrl) {
        setVideoUrl(res.dataUrl);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [sourcePath, api]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.currentTime = initStart / 1000;
    }
  }, [videoUrl, initStart]);

  useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handleClipSelected = (e: any) => setSelectedLayerId(e.detail.id);
      window.addEventListener('editor-clip-selected', handleClipSelected);
      return () => window.removeEventListener('editor-clip-selected', handleClipSelected);
  }, []);

  // Sync playback
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
        if (playing) {
            const deltaMs = now - lastTime;
            setCurrentTime(prev => {
                const nextTime = prev + deltaMs;
                if (nextTime >= timeline.durationMs) {
                    setPlaying(false);
                    return 0; // Loop or stop
                }
                return nextTime;
            });
        }
        lastTime = now;
        animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [playing, timeline.durationMs]);

  const togglePlay = () => setPlaying(prev => !prev);
  const seekTo = (ms: number) => setCurrentTime(ms);

  // Suppress warnings: Legacy state variables not used by multi-track timeline right now,
  // but kept for future migration reference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tlRef = timelineRef;

  // ── Build FFmpeg color filter string ─────────────────────────────────────
  function buildFfmpegColorFilter(c: ColorFilter): string {
    const parts: string[] = [];
    if (c.brightness !== 0 || c.contrast !== 0 || c.saturation !== 0) {
      const b = c.brightness;
      const con = 1 + c.contrast;
      const sat = 1 + c.saturation;
      parts.push(`eq=brightness=${b}:contrast=${con}:saturation=${sat}`);
    }
    if (c.hue !== 0) parts.push(`hue=h=${c.hue}`);
    if (c.temperature !== 0) {
      // Approximate warm/cool with color channel curves
      const t = c.temperature / 200;
      if (t > 0) parts.push(`colorchannelmixer=rr=${1+t*0.1}:bb=${1-t*0.1}`);
      else       parts.push(`colorchannelmixer=rr=${1+t*0.1}:bb=${1-t*0.1}`);
    }
    if (c.vignette > 0) parts.push(`vignette=angle=${Math.PI * c.vignette / 2}`);
    return parts.join(',');
  }

  // ── Export ────────────────────────────────────────────────────────────────
  const prepareExportPayload = async () => {
    if (!api) return null;
    const wsRes = await api.dbGetWorkspaces();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultKit = (wsRes?.workspaces as any[])?.[0]?.kits?.[0];

    // Extract text clips for the old payload structure (backward compatibility for rendering)
    const textClips = timeline.tracks.filter(t => t.type === 'text').flatMap(t => t.clips) as import('./types').TextClip[];
    const segments = textClips.map(l => ({
      start: l.timelineStartMs / 1000,
      end:   l.timelineEndMs / 1000,
      text:  l.text,
      words: [],
    }));

    // Find main video clip to drive legacy backend parameters
    const videoTracks = timeline.tracks.filter(t => t.type === 'video');
    const firstVideoClip = videoTracks[0]?.clips[0] as VideoClip | undefined;

    return {
      jobId: `editor_${generateId()}`,
      sourcePath: firstVideoClip?.sourcePath || sourcePath,
      startMs: firstVideoClip?.mediaStartMs || 0,
      endMs:   firstVideoClip?.mediaEndMs || timeline.durationMs,
      timeline: timeline, // Pass full multi-track timeline for advanced rendering
      segments, // Legacy support
      format: timeline.format,
      isVerticalTarget: timeline.format === '9:16' || timeline.format === '4:5',
      speed: firstVideoClip?.speed || 1,
      flipH: firstVideoClip?.flipH || false,
      flipV: firstVideoClip?.flipV || false,
      rotate: firstVideoClip?.rotation || 0,
      colorFilterString: firstVideoClip ? buildFfmpegColorFilter(firstVideoClip.colorFilter) : '',
      videoVolume: firstVideoClip?.volume ?? 1,
      muteOriginal: firstVideoClip?.muted ?? false,
      brandKit: defaultKit,
      quality: exportQuality,

      // Fallbacks for legacy payload shape
      bgMusicPath: null,
      bgMusicOptions: null,
      sfxEnabled: false,
      enhanceAudio: false,
      audioDucking: true,
      keyframes: firstVideoClip?.keyframes || [],
      brollLayers: [],
      stickers: timeline.tracks.filter(t => t.type === 'sticker').flatMap(t => t.clips),
      style: { font: 'Arial', primaryColor: '&H00FFFFFF', outlineColor: '&H00000000', alignment: 2, marginV: 120 },
    };
  };

  const handleExport = async () => {
    if (!api?.enqueueJob) return;
    setExporting(true);
    setExportStatus('⏳ Mengirim ke antrian render...');

    const payload = await prepareExportPayload();
    if (!payload) return;

    const res = await api.enqueueJob('RENDER', payload);
    if (res?.success) {
      setExportStatus('✅ Berhasil! Klip sedang dirender di latar belakang.');
    } else {
      setExportStatus('❌ Gagal: ' + (res?.error || 'Unknown error'));
    }
    setTimeout(() => { setExporting(false); setExportStatus(''); }, 4000);
  };

  const handleMultiExport = async (targetLanguages: string[], enableDubbing: boolean) => {
    if (!api?.enqueueJob) return;
    setExporting(true);
    setShowMultiExport(false);
    setExportStatus(`⏳ Mengirim tugas Multi-Bahasa (${targetLanguages.length} bahasa) ke antrian...`);

    const basePayload = await prepareExportPayload();
    if (!basePayload) return;

    const res = await api.enqueueJob('RENDER_MULTILINGUAL', { basePayload, targetLanguages, enableDubbing });
    if (res?.success) {
      setExportStatus('✅ Berhasil! Tugas Multi-Bahasa ditambahkan ke antrian.');
    } else {
      setExportStatus('❌ Gagal: ' + (res?.error || 'Unknown error'));
    }
    setTimeout(() => { setExporting(false); setExportStatus(''); }, 4000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-[#111] text-white select-none overflow-hidden">

      {/* ── TOP BAR ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#1c1c1c] border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-white/70 hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Clapperboard className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">
            Editor — Clip #{clipIndex + 1}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={undo} className="text-white/60" title="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} className="text-white/60" title="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-white/20 mx-1" />
          {/* Aspect Ratio */}
          {(['9:16','16:9','1:1','4:5'] as const).map(f => (
            <Button key={f} size="sm" variant={edit.format === f ? 'default' : 'ghost'}
              className={`px-2.5 py-1 text-xs font-mono ${edit.format === f ? 'bg-primary text-primary-foreground' : 'text-white/60'}`}
              onClick={() => setEdit(p => ({ ...p, format: f }))}>
              {f}
            </Button>
          ))}
          <div className="h-4 w-px bg-white/20 mx-1" />
          <select 
            className="text-xs bg-[#1c1c1c] border border-white/20 rounded-md px-2 py-1 outline-none focus:border-primary/50 text-white/80 h-8"
            value={exportQuality}
            onChange={e => setExportQuality(e.target.value as 'high'|'medium'|'fast')}
          >
            <option value="high">High Quality</option>
            <option value="medium">Medium</option>
            <option value="fast">Fast (Proxy)</option>
          </select>
          <Button
            size="sm" className="bg-amber-600 hover:bg-amber-500 gap-1.5 ml-1"
            onClick={() => setShowMultiExport(true)} disabled={exporting}
          >
            <Globe className="h-4 w-4" />
            Batch AI
          </Button>
          <Button
            variant="outline"
            size="sm" className="bg-indigo-600 text-white border-transparent hover:bg-indigo-500 hover:text-white"
            onClick={() => setShowThumbnail(true)}
          >
             Thumbnail
          </Button>
          <Button
            size="sm" className="bg-primary hover:bg-primary/90 gap-1.5"
            onClick={handleExport} disabled={exporting}
          >
            <Download className="h-4 w-4" />
            Export {edit.format}
          </Button>
        </div>
      </header>

      {exportStatus && (
        <div className="px-4 py-1.5 bg-primary/20 border-b border-primary/30 text-xs text-center text-primary-foreground/90">
          {exportStatus}
        </div>
      )}

      {showMultiExport && (
         <MultiExportModal 
            open={showMultiExport} 
            onOpenChange={setShowMultiExport} 
            onExport={(langs, dub) => handleMultiExport(langs, dub)} 
         />
      )}

      {showThumbnail && (
         <ThumbnailModal 
            open={showThumbnail} 
            onOpenChange={setShowThumbnail} 
            sourcePath={sourcePath} 
            startMs={edit.startMs} 
            endMs={edit.endMs} 
            clipId={`editor_${clipIndex}`} 
         />
      )}

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" initialSizes={[7, 73, 20]}>

        {/* LEFT TOOL SIDEBAR */}
        <aside className="w-full h-full bg-[#1c1c1c] border-r border-white/10 flex flex-col items-center py-3 gap-1 shrink-0 overflow-y-auto overflow-x-hidden">
          {([
            { icon: <Zap />,         panel: 'ai',          label: 'AI Tools' },
            { icon: <Palette />,     panel: 'color',       label: 'Properties' },
          ] as const).map(({ icon, panel, label }) => (
            <button
              key={panel}
              onClick={() => setActivePanel(activePanel === panel ? null : (panel as typeof activePanel))}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg w-10 text-[10px] transition-colors
                ${activePanel === panel ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              title={label}
            >
              <span className="w-4 h-4">{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          {/* Legacy buttons disabled/hidden for now until migrated to TimelineData */}
          <div className="mt-auto flex flex-col gap-1 opacity-20 pointer-events-none" title="Migrating to multi-track...">
            <button
              onClick={() => setEdit(p => ({ ...p, flipH: !p.flipH }))}
              className={`p-2 rounded-lg text-[10px] flex flex-col items-center gap-0.5 
                ${edit.flipH ? 'text-primary bg-primary/20' : 'text-white/40 hover:text-white'}`}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
              <span>Flip H</span>
            </button>
            <button
              onClick={() => setEdit(p => ({ ...p, flipV: !p.flipV }))}
              className={`p-2 rounded-lg text-[10px] flex flex-col items-center gap-0.5
                ${edit.flipV ? 'text-primary bg-primary/20' : 'text-white/40 hover:text-white'}`}
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4" />
              <span>Flip V</span>
            </button>
            <button
              onClick={() => setEdit(p => ({ ...p, rotate: (p.rotate - 90 + 360) % 360 }))}
              className="p-2 rounded-lg text-[10px] text-white/40 hover:text-white flex flex-col items-center gap-0.5"
              title="Rotate 90°"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Rotate</span>
            </button>
            <button
              onClick={() => setActivePanel('keyframes')}
              className={`p-2 rounded-lg text-[10px] flex flex-col items-center gap-0.5 ${activePanel === 'keyframes' ? 'bg-primary text-primary-foreground' : 'text-white/40 hover:text-white'}`}
            >
              <Zap className="w-4 h-4" />
              <span>Motion</span>
            </button>
          </div>
        </aside>

        {/* CENTER: PREVIEW + TIMELINE */}
        <main className="flex-1 flex flex-col overflow-hidden h-full">
         <ResizablePanelGroup direction="vertical" initialSizes={[60, 40]}>

          <div className="flex flex-col flex-1 overflow-hidden">

          {/* VIDEO PREVIEW AREA */}
          <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] p-4 overflow-hidden relative">
             <PreviewEngine
                timeline={timeline}
                currentTime={currentTime}
                playing={playing}
                format={timeline.format}
                onEnded={() => setPlaying(false)}
             />

             {/* Click-to-play overlay */}
             {!playing && !loading && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
                    <Play className="h-7 w-7 text-white fill-white" />
                  </div>
                </button>
             )}
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="bg-[#1a1a1a] border-t border-white/5 px-4 py-2 flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" className="text-white/70" onClick={() => seekTo(0)}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70" onClick={() => seekTo(timeline.durationMs)}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <span className="text-xs font-mono text-white/60 min-w-[90px]">
              {msToTime(currentTime)} / {msToTime(timeline.durationMs)}
            </span>
          </div>

          </div>

          {/* TIMELINE */}
          <div className="bg-[#161616] border-t border-white/10 flex-1 overflow-y-auto">
             <MultiTrackTimeline
                timeline={timeline}
                setTimeline={setTimeline}
                currentTime={currentTime}
                seekTo={seekTo}
             />
          </div>
         </ResizablePanelGroup>
        </main>

        {/* RIGHT PANEL */}
        {activePanel ? (
          <aside className="w-full h-full bg-[#1c1c1c] border-l border-white/10 flex flex-col overflow-y-auto shrink-0">
            {/* ── TRACK PROPERTIES (Replaces old individual panels) ──────── */}
            {activePanel === 'color' && <TrackPropertiesPanel timeline={timeline} setTimeline={setTimeline} selectedClipId={selectedLayerId} />}

            {/* ── AI TOOLS ──────────────────────────────────────────────── */}
            {activePanel === 'ai' && <AIToolsPanel timeline={timeline} setTimeline={setTimeline} sourcePath={sourcePath} />}

            {/* Legacy panels intentionally removed from render to avoid interacting with orphaned state. */}
          </aside>
        ) : <div />}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen bg-[#111] items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <EditorInner />
    </Suspense>
  );
}
