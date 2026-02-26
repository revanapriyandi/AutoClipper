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
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Scissors, Volume2,
  VolumeX, Type, Music, Palette, Layers, Zap, FlipHorizontal,
  FlipVertical, RotateCcw, Undo2, Redo2, Download,
  Plus, Trash2, Eye, EyeOff, AlignLeft, AlignCenter, AlignRight,
  Clapperboard, Sparkles,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TextLayer {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  x: number; // 0-100%
  y: number; // 0-100%
  fontSize: number;
  color: string;
  bgColor: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  visible: boolean;
  animation: 'none' | 'fade' | 'slide_up' | 'typewriter';
}

interface AudioTrack {
  path: string;
  volume: number; // 0-1
  fadeIn: boolean;
  fadeOut: boolean;
}

interface ColorFilter {
  brightness: number;  // -1 to 1
  contrast: number;    // -1 to 1
  saturation: number;  // -1 to 1
  hue: number;         // -180 to 180
  vignette: number;    // 0 to 1
  temperature: number; // -100 to 100 (warm/cool)
}

interface EditState {
  startMs: number;
  endMs: number;
  speed: number;
  flipH: boolean;
  flipV: boolean;
  rotate: number;
  format: '9:16' | '16:9' | '1:1' | '4:5';
  textLayers: TextLayer[];
  audioTrack: AudioTrack | null;
  colorFilter: ColorFilter;
  videoVolume: number;
  transition: 'none' | 'fade' | 'wipe' | 'zoom';
}

const DEFAULT_COLOR: ColorFilter = {
  brightness: 0, contrast: 0, saturation: 0, hue: 0, vignette: 0, temperature: 0,
};

const FONTS = ['Arial', 'Roboto', 'Impact', 'Georgia', 'Courier New', 'Pacifico', 'Oswald'];

const PRESETS = [
  { name: 'Original',  color: DEFAULT_COLOR },
  { name: 'Vivid',     color: { ...DEFAULT_COLOR, saturation: 0.4, contrast: 0.2 } },
  { name: 'Matte',     color: { ...DEFAULT_COLOR, brightness: -0.05, contrast: -0.15, saturation: -0.1 } },
  { name: 'Cold',      color: { ...DEFAULT_COLOR, temperature: -60, saturation: 0.1 } },
  { name: 'Warm',      color: { ...DEFAULT_COLOR, temperature: 60, brightness: 0.05 } },
  { name: 'B&W',       color: { ...DEFAULT_COLOR, saturation: -1 } },
  { name: 'Cinematic', color: { ...DEFAULT_COLOR, contrast: 0.25, saturation: -0.1, vignette: 0.4, temperature: -20 } },
  { name: 'Drama',     color: { ...DEFAULT_COLOR, contrast: 0.4, brightness: -0.1, saturation: 0.2, vignette: 0.6 } },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function msToTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

function generateId() { return Math.random().toString(36).slice(2, 9); }

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
  const [activePanel, setActivePanel] = useState<'text' | 'audio' | 'color' | 'effects' | 'transitions' | null>('color');
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<'in' | 'out' | null>(null);

  // Undo/Redo history
  const historyRef = useRef<EditState[]>([]);
  const historyIndexRef = useRef(-1);

  const [edit, setEditRaw] = useState<EditState>({
    startMs: initStart,
    endMs:   initEnd,
    speed: 1,
    flipH: false, flipV: false, rotate: 0,
    format: '9:16',
    textLayers: [],
    audioTrack: null,
    colorFilter: { ...DEFAULT_COLOR },
    videoVolume: 1,
    transition: 'none',
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
    if (!sourcePath || !api) { setLoading(false); return; }
    api.readVideoAsDataUrl(sourcePath).then(res => {
      if (res?.success && res.dataUrl) {
        setVideoUrl(res.dataUrl);
      }
      setLoading(false);
    });
  }, [sourcePath, api]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.currentTime = initStart / 1000;
    }
  }, [videoUrl, initStart]);

  // Sync playback
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onTime = () => {
      const absMs = v.currentTime * 1000;
      const relMs = absMs - edit.startMs;
      setCurrentTime(Math.max(0, relMs));
      if (absMs >= edit.endMs / edit.speed) {
        v.pause(); setPlaying(false);
        v.currentTime = edit.startMs / 1000;
        setCurrentTime(0);
      }
    };
    v.addEventListener('timeupdate', onTime);
    return () => { v.removeEventListener('timeupdate', onTime); };
  }, [edit.startMs, edit.endMs, edit.speed]);

  // Apply playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = edit.speed;
  }, [edit.speed]);

  // Apply video volume
  useEffect(() => {
    if (videoRef.current) videoRef.current.volume = edit.videoVolume;
  }, [edit.videoVolume]);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };

  const seekTo = (ms: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = (edit.startMs + ms) / 1000;
    setCurrentTime(ms);
  };

  // ── Timeline drag ─────────────────────────────────────────────────────────

  const handleTimelineDrag = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    const tl = timelineRef.current; if (!tl || !draggingHandle) return;
    e.preventDefault();
    const rect = tl.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const rawMs = initStart + ratio * (initEnd - initStart);
    setEditRaw(prev => {
      if (draggingHandle === 'in') {
        return { ...prev, startMs: Math.min(rawMs, prev.endMs - 500) };
      } else {
        return { ...prev, endMs: Math.max(rawMs, prev.startMs + 500) };
      }
    });
  }, [draggingHandle, initStart, initEnd]);

  const stopDrag = useCallback(() => {
    if (draggingHandle) {
      setEdit(prev => ({ ...prev })); // commit to history
      setDraggingHandle(null);
    }
  }, [draggingHandle, setEdit]);

  // ── Text layers ───────────────────────────────────────────────────────────
  const addTextLayer = () => {
    const layer: TextLayer = {
      id: generateId(), text: 'Text', startMs: currentTime, endMs: currentTime + 3000,
      x: 50, y: 80, fontSize: 48, color: '#FFFFFF', bgColor: 'transparent',
      fontFamily: 'Arial', bold: true, italic: false, align: 'center',
      visible: true, animation: 'fade',
    };
    setEdit(prev => ({ ...prev, textLayers: [...prev.textLayers, layer] }));
    setSelectedLayerId(layer.id);
  };

  const updateLayer = (id: string, patch: Partial<TextLayer>) => {
    setEdit(prev => ({
      ...prev,
      textLayers: prev.textLayers.map(l => l.id === id ? { ...l, ...patch } : l),
    }));
  };

  const deleteLayer = (id: string) => {
    setEdit(prev => ({ ...prev, textLayers: prev.textLayers.filter(l => l.id !== id) }));
    setSelectedLayerId(null);
  };

  // ── Color filter helper ───────────────────────────────────────────────────
  const updateColor = (key: keyof ColorFilter, val: number) => {
    setEdit(prev => ({ ...prev, colorFilter: { ...prev.colorFilter, [key]: val } }));
  };

  // ── Preview CSS filter ────────────────────────────────────────────────────
  const previewFilter = (() => {
    const c = edit.colorFilter;
    const b = 1 + c.brightness;
    const con = 1 + c.contrast;
    const sat = 1 + c.saturation;
    const temp = c.temperature;
    const sepiaAmount = temp > 0 ? temp / 200 : 0;
    return `brightness(${b}) contrast(${con}) saturate(${sat}) hue-rotate(${c.hue}deg) sepia(${sepiaAmount * 0.3})`;
  })();

  const previewTransform = (() => {
    const parts: string[] = [];
    if (edit.flipH) parts.push('scaleX(-1)');
    if (edit.flipV) parts.push('scaleY(-1)');
    if (edit.rotate) parts.push(`rotate(${edit.rotate}deg)`);
    return parts.join(' ') || 'none';
  })();

  // ── Active text layer ─────────────────────────────────────────────────────
  const selectedLayer = edit.textLayers.find(l => l.id === selectedLayerId) ?? null;
  const visibleLayers = edit.textLayers.filter(l => l.visible && currentTime >= l.startMs && currentTime <= l.endMs);

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
  const handleExport = async () => {
    if (!api?.enqueueJob) return;
    setExporting(true);
    setExportStatus('⏳ Mengirim ke antrian render...');

    const segments = edit.textLayers.map(l => ({
      start: (edit.startMs + l.startMs) / 1000,
      end:   (edit.startMs + l.endMs)   / 1000,
      text:  l.text,
      words: [],
    }));

    const payload = {
      jobId: `editor_${generateId()}`,
      sourcePath,
      startMs: edit.startMs,
      endMs:   edit.endMs,
      segments,
      format: edit.format,
      isVerticalTarget: edit.format === '9:16' || edit.format === '4:5',
      bgMusicPath: edit.audioTrack?.path || null,
      speed: edit.speed,
      flipH: edit.flipH,
      flipV: edit.flipV,
      rotate: edit.rotate,
      colorFilterString: buildFfmpegColorFilter(edit.colorFilter),
      videoVolume: edit.videoVolume,
      style: { font: 'Arial', primaryColor: '&H00FFFFFF', outlineColor: '&H00000000', alignment: 2, marginV: 120 },
    };

    const res = await api.enqueueJob('RENDER', payload);
    if (res?.success) {
      setExportStatus('✅ Berhasil! Klip sedang dirender di latar belakang.');
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

      {/* ── BODY ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT TOOL SIDEBAR */}
        <aside className="w-14 bg-[#1c1c1c] border-r border-white/10 flex flex-col items-center py-3 gap-1 shrink-0">
          {([
            { icon: <Palette />,     panel: 'color',       label: 'Color' },
            { icon: <Type />,        panel: 'text',        label: 'Text' },
            { icon: <Music />,       panel: 'audio',       label: 'Audio' },
            { icon: <Layers />,      panel: 'effects',     label: 'Effects' },
            { icon: <Zap />,         panel: 'transitions', label: 'Transitions' },
          ] as const).map(({ icon, panel, label }) => (
            <button
              key={panel}
              onClick={() => setActivePanel(activePanel === panel ? null : panel)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg w-10 text-[10px] transition-colors
                ${activePanel === panel ? 'bg-primary/20 text-primary' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
              title={label}
            >
              <span className="w-4 h-4">{icon}</span>
              <span>{label}</span>
            </button>
          ))}

          <div className="mt-auto flex flex-col gap-1">
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
          </div>
        </aside>

        {/* CENTER: PREVIEW + TIMELINE */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* VIDEO PREVIEW AREA */}
          <div className="flex-1 flex items-center justify-center bg-[#0d0d0d] p-4 overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center text-white/40">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
              </div>
            )}

            {/* Aspect-ratio frame */}
            <div
              className="relative bg-black overflow-hidden shadow-2xl"
              style={{
                height: '100%',
                aspectRatio: edit.format === '9:16' ? '9/16' :
                             edit.format === '1:1'  ? '1/1' :
                             edit.format === '4:5'  ? '4/5' : '16/9',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            >
              {/* Vignette overlay */}
              {edit.colorFilter.vignette > 0 && (
                <div
                  className="absolute inset-0 z-10 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, transparent ${50 - edit.colorFilter.vignette * 40}%, rgba(0,0,0,${edit.colorFilter.vignette * 0.8}) 100%)` }}
                />
              )}

              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ filter: previewFilter, transform: previewTransform }}
                muted={false}
                playsInline
              />

              {/* Text overlays preview */}
              {visibleLayers.map(l => (
                <div
                  key={l.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${l.x}%`, top: `${l.y}%`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: `${l.fontSize / 10}cqw`,
                    color: l.color,
                    backgroundColor: l.bgColor === 'transparent' ? 'transparent' : l.bgColor,
                    fontFamily: l.fontFamily,
                    fontWeight: l.bold ? 'bold' : 'normal',
                    fontStyle: l.italic ? 'italic' : 'normal',
                    textAlign: l.align,
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    maxWidth: '90%',
                    whiteSpace: 'pre-wrap',
                    padding: l.bgColor !== 'transparent' ? '4px 8px' : '0',
                    borderRadius: l.bgColor !== 'transparent' ? '4px' : '0',
                  }}
                >
                  {l.text}
                </div>
              ))}

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
          </div>

          {/* PLAYBACK CONTROLS */}
          <div className="bg-[#1a1a1a] border-t border-white/5 px-4 py-2 flex items-center gap-3 shrink-0">
            <Button variant="ghost" size="icon" className="text-white/70" onClick={() => seekTo(0)}>
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white/70" onClick={() => seekTo(edit.endMs - edit.startMs)}>
              <SkipForward className="h-4 w-4" />
            </Button>

            <span className="text-xs font-mono text-white/60 min-w-[90px]">
              {msToTime(currentTime)} / {msToTime(edit.endMs - edit.startMs)}
            </span>

            {/* Speed */}
            <div className="flex items-center gap-1.5 ml-2">
              {[0.25, 0.5, 1, 1.5, 2, 4].map(s => (
                <button key={s}
                  onClick={() => setEdit(p => ({ ...p, speed: s }))}
                  className={`px-1.5 py-0.5 rounded text-xs font-mono
                    ${edit.speed === s ? 'bg-primary text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {s}×
                </button>
              ))}
            </div>

            {/* Video Volume */}
            <div className="flex items-center gap-1.5 ml-2 min-w-[100px]">
              <button onClick={() => setEdit(p => ({ ...p, videoVolume: p.videoVolume > 0 ? 0 : 1 }))}>
                {edit.videoVolume === 0 ? <VolumeX className="h-4 w-4 text-white/40" /> : <Volume2 className="h-4 w-4 text-white/60" />}
              </button>
              <Slider
                value={[edit.videoVolume * 100]}
                onValueChange={([v]) => setEdit(p => ({ ...p, videoVolume: v / 100 }))}
                max={100} step={1} className="w-20"
              />
            </div>
          </div>

          {/* TIMELINE */}
          <div className="bg-[#161616] border-t border-white/10 px-4 pt-3 pb-4 shrink-0">
            <div className="text-xs text-white/30 mb-2 flex items-center gap-2">
              <Scissors className="h-3 w-3" /> Timeline — drag handles to trim
            </div>

            {/* Main video clip bar */}
            <div
              ref={timelineRef}
              className="relative h-10 bg-white/5 rounded-lg cursor-pointer overflow-visible"
              onPointerMove={handleTimelineDrag}
              onPointerUp={stopDrag}
              onPointerLeave={stopDrag}
              onClick={e => {
                if (draggingHandle) return;
                const rect = timelineRef.current!.getBoundingClientRect();
                const ratio = (e.clientX - rect.left) / rect.width;
                seekTo(ratio * (edit.endMs - edit.startMs));
              }}
            >
              {/* Clip region */}
              <div
                className="absolute top-0 h-full bg-primary/30 border border-primary/50 rounded-lg"
                style={{
                  left:  `${((edit.startMs - initStart) / (initEnd - initStart)) * 100}%`,
                  right: `${((initEnd - edit.endMs)    / (initEnd - initStart)) * 100}%`,
                }}
              />

              {/* IN handle */}
              <div
                className="absolute top-0 -translate-x-1/2 h-full w-3 bg-primary cursor-ew-resize rounded-l-lg flex items-center justify-center z-10"
                style={{ left: `${((edit.startMs - initStart) / (initEnd - initStart)) * 100}%` }}
                onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); setDraggingHandle('in'); }}
              >
                <div className="w-0.5 h-4 bg-white/70 rounded" />
              </div>

              {/* OUT handle */}
              <div
                className="absolute top-0 translate-x-1/2 h-full w-3 bg-primary cursor-ew-resize rounded-r-lg flex items-center justify-center z-10"
                style={{ right: `${((initEnd - edit.endMs) / (initEnd - initStart)) * 100}%` }}
                onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); setDraggingHandle('out'); }}
              >
                <div className="w-0.5 h-4 bg-white/70 rounded" />
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 h-full w-0.5 bg-white z-20 pointer-events-none"
                style={{ left: `${(currentTime / Math.max(1, edit.endMs - edit.startMs)) * 100}%` }}
              />

              {/* Text layer markers */}
              {edit.textLayers.map(l => (
                <div
                  key={l.id}
                  className="absolute top-1/2 -translate-y-1/2 h-2 rounded bg-yellow-400/70"
                  style={{
                    left:  `${(l.startMs / Math.max(1, edit.endMs - edit.startMs)) * 100}%`,
                    width: `${((l.endMs - l.startMs) / Math.max(1, edit.endMs - edit.startMs)) * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Duration labels */}
            <div className="flex justify-between text-[10px] text-white/20 mt-1">
              <span>{msToTime(initStart)}</span>
              <span>{msToTime(initEnd)}</span>
            </div>
          </div>
        </main>

        {/* RIGHT PANEL */}
        {activePanel && (
          <aside className="w-72 bg-[#1c1c1c] border-l border-white/10 flex flex-col overflow-y-auto shrink-0">
            
            {/* ── COLOR GRADING ─────────────────────────────────────────── */}
            {activePanel === 'color' && (
              <div className="p-4 space-y-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" /> Color Grading
                </h3>

                {/* Filter Presets */}
                <div>
                  <Label className="text-xs text-white/50 mb-2 block">Preset</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {PRESETS.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setEdit(prev => ({ ...prev, colorFilter: { ...p.color } }))}
                        className="text-center rounded overflow-hidden border border-white/10 hover:border-primary transition-colors"
                      >
                        <div className="h-10 w-full bg-gradient-to-br from-neutral-700 to-neutral-900"
                          style={{ filter: `brightness(${1 + p.color.brightness}) contrast(${1 + p.color.contrast}) saturate(${1 + p.color.saturation})` }} />
                        <div className="text-[9px] text-white/60 py-1">{p.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                {([
                  { key: 'brightness',  label: 'Brightness',  min: -1,   max: 1,   step: 0.01 },
                  { key: 'contrast',    label: 'Contrast',    min: -1,   max: 1,   step: 0.01 },
                  { key: 'saturation',  label: 'Saturation',  min: -1,   max: 1,   step: 0.01 },
                  { key: 'hue',         label: 'Hue',         min: -180, max: 180, step: 1    },
                  { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1    },
                  { key: 'vignette',    label: 'Vignette',    min: 0,    max: 1,   step: 0.01 },
                ] as const).map(({ key, label, min, max, step }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <Label className="text-xs text-white/60">{label}</Label>
                      <span className="text-xs font-mono text-white/40">
                        {edit.colorFilter[key].toFixed(key === 'hue' || key === 'temperature' ? 0 : 2)}
                      </span>
                    </div>
                    <Slider
                      value={[edit.colorFilter[key]]}
                      min={min} max={max} step={step}
                      onValueChange={([v]) => updateColor(key, v)}
                      className="w-full"
                    />
                  </div>
                ))}

                <Button
                  variant="outline" size="sm" className="w-full text-xs border-white/20"
                  onClick={() => setEdit(p => ({ ...p, colorFilter: { ...DEFAULT_COLOR } }))}
                >
                  <RotateCcw className="h-3 w-3 mr-1.5" /> Reset Color
                </Button>
              </div>
            )}

            {/* ── TEXT LAYERS ───────────────────────────────────────────── */}
            {activePanel === 'text' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" /> Text Overlays
                  </h3>
                  <Button size="sm" variant="outline" className="h-7 border-white/20 text-xs gap-1" onClick={addTextLayer}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>

                {/* Layer list */}
                <div className="space-y-2">
                  {edit.textLayers.length === 0 && (
                    <p className="text-xs text-white/30 text-center py-4">Belum ada text layer. Klik Add!</p>
                  )}
                  {edit.textLayers.map(l => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLayerId(l.id)}
                      className={`p-2 rounded-lg border cursor-pointer transition-colors
                        ${selectedLayerId === l.id ? 'border-primary bg-primary/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium truncate">{l.text || '(empty)'}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={e => { e.stopPropagation(); updateLayer(l.id, { visible: !l.visible }); }}>
                            {l.visible ? <Eye className="h-3.5 w-3.5 text-white/40" /> : <EyeOff className="h-3.5 w-3.5 text-white/20" />}
                          </button>
                          <button onClick={e => { e.stopPropagation(); deleteLayer(l.id); }}>
                            <Trash2 className="h-3.5 w-3.5 text-red-400/60 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] text-white/30 mt-0.5">
                        {msToTime(l.startMs)} → {msToTime(l.endMs)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Layer properties */}
                {selectedLayer && (
                  <div className="space-y-3 border-t border-white/10 pt-4">
                    <Label className="text-xs text-white/50">Selected Layer</Label>

                    <div>
                      <Label className="text-xs text-white/40">Text</Label>
                      <Input
                        value={selectedLayer.text}
                        onChange={e => updateLayer(selectedLayer.id, { text: e.target.value })}
                        className="mt-1 bg-white/5 border-white/20 text-white text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-white/40">Start (ms)</Label>
                        <Input type="number" value={selectedLayer.startMs}
                          onChange={e => updateLayer(selectedLayer.id, { startMs: parseInt(e.target.value) || 0 })}
                          className="mt-1 bg-white/5 border-white/20 text-white text-xs" />
                      </div>
                      <div>
                        <Label className="text-xs text-white/40">End (ms)</Label>
                        <Input type="number" value={selectedLayer.endMs}
                          onChange={e => updateLayer(selectedLayer.id, { endMs: parseInt(e.target.value) || 3000 })}
                          className="mt-1 bg-white/5 border-white/20 text-white text-xs" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-white/40">X (%)</Label>
                        <Slider value={[selectedLayer.x]} min={0} max={100}
                          onValueChange={([v]) => updateLayer(selectedLayer.id, { x: v })} />
                      </div>
                      <div>
                        <Label className="text-xs text-white/40">Y (%)</Label>
                        <Slider value={[selectedLayer.y]} min={0} max={100}
                          onValueChange={([v]) => updateLayer(selectedLayer.id, { y: v })} />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-white/40">Font Size</Label>
                      <Slider value={[selectedLayer.fontSize]} min={16} max={120}
                        onValueChange={([v]) => updateLayer(selectedLayer.id, { fontSize: v })} />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-white/40">Color</Label>
                        <input type="color" value={selectedLayer.color}
                          onChange={e => updateLayer(selectedLayer.id, { color: e.target.value })}
                          className="mt-1 w-full h-8 rounded border border-white/20 bg-transparent cursor-pointer" />
                      </div>
                      <div>
                        <Label className="text-xs text-white/40">BG Color</Label>
                        <input type="color" value={selectedLayer.bgColor === 'transparent' ? '#000000' : selectedLayer.bgColor}
                          onChange={e => updateLayer(selectedLayer.id, { bgColor: e.target.value })}
                          className="mt-1 w-full h-8 rounded border border-white/20 bg-transparent cursor-pointer" />
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-white/40 mb-1 block">Font</Label>
                      <select value={selectedLayer.fontFamily}
                        onChange={e => updateLayer(selectedLayer.id, { fontFamily: e.target.value })}
                        className="w-full bg-white/5 border border-white/20 rounded px-2 py-1.5 text-xs text-white">
                        {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button onClick={() => updateLayer(selectedLayer.id, { bold: !selectedLayer.bold })}
                        className={`px-2 py-1 rounded text-sm font-bold border ${selectedLayer.bold ? 'border-primary text-primary' : 'border-white/20 text-white/40'}`}>
                        B
                      </button>
                      <button onClick={() => updateLayer(selectedLayer.id, { italic: !selectedLayer.italic })}
                        className={`px-2 py-1 rounded text-sm italic border ${selectedLayer.italic ? 'border-primary text-primary' : 'border-white/20 text-white/40'}`}>
                        I
                      </button>
                      <div className="flex items-center gap-1 ml-auto">
                        {[['left', <AlignLeft key="l" className="h-3 w-3" />], ['center', <AlignCenter key="c" className="h-3 w-3" />], ['right', <AlignRight key="r" className="h-3 w-3" />]].map(([a, icon]) => (
                          <button key={String(a)} onClick={() => updateLayer(selectedLayer.id, { align: a as 'left'|'center'|'right' })}
                            className={`p-1.5 rounded border ${selectedLayer.align === a ? 'border-primary text-primary' : 'border-white/20 text-white/40'}`}>
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-white/40 mb-1 block">Animation</Label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {(['none', 'fade', 'slide_up', 'typewriter'] as const).map(a => (
                          <button key={a} onClick={() => updateLayer(selectedLayer.id, { animation: a })}
                            className={`py-1 px-2 rounded text-xs border transition-colors
                              ${selectedLayer.animation === a ? 'border-primary text-primary bg-primary/10' : 'border-white/20 text-white/40 hover:text-white'}`}>
                            {a === 'slide_up' ? 'Slide Up' : a.charAt(0).toUpperCase() + a.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── AUDIO ─────────────────────────────────────────────────── */}
            {activePanel === 'audio' && (
              <div className="p-4 space-y-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary" /> Audio Mixer
                </h3>

                <div className="space-y-2">
                  <Label className="text-xs text-white/60">Video Audio Volume</Label>
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-white/40" />
                    <Slider
                      value={[edit.videoVolume * 100]}
                      onValueChange={([v]) => setEdit(p => ({ ...p, videoVolume: v / 100 }))}
                      max={100} step={1} className="flex-1"
                    />
                    <span className="text-xs font-mono text-white/40 w-8">{Math.round(edit.videoVolume * 100)}%</span>
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-3">
                  <Label className="text-xs text-white/60">Background Music</Label>
                  {edit.audioTrack ? (
                    <div className="bg-white/5 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-primary" />
                          <span className="text-xs text-white/70 truncate max-w-[140px]">
                            {edit.audioTrack.path.split(/[\\/]/).pop()}
                          </span>
                        </div>
                        <button onClick={() => setEdit(p => ({ ...p, audioTrack: null }))}>
                          <Trash2 className="h-3.5 w-3.5 text-red-400/60 hover:text-red-400" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs text-white/40">Music Volume</Label>
                        <Slider
                          value={[edit.audioTrack.volume * 100]}
                          onValueChange={([v]) => setEdit(p => ({
                            ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, volume: v / 100 } : null
                          }))}
                          max={100} step={1}
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={edit.audioTrack.fadeIn}
                            onChange={e => setEdit(p => ({ ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, fadeIn: e.target.checked } : null }))}
                            className="accent-primary" />
                          <span className="text-xs text-white/60">Fade In</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input type="checkbox" checked={edit.audioTrack.fadeOut}
                            onChange={e => setEdit(p => ({ ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, fadeOut: e.target.checked } : null }))}
                            className="accent-primary" />
                          <span className="text-xs text-white/60">Fade Out</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline" size="sm" className="w-full border-white/20 border-dashed text-white/40 hover:text-white"
                      onClick={async () => {
                        const res = await api?.openFilePicker?.([{ name: 'Audio', extensions: ['mp3','aac','wav','m4a','ogg'] }]);
                        if (res?.success && res.filePath) {
                          setEdit(p => ({ ...p, audioTrack: { path: res.filePath!, volume: 0.15, fadeIn: true, fadeOut: true } }));
                        }
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Music File
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ── EFFECTS ───────────────────────────────────────────────── */}
            {activePanel === 'effects' && (
              <div className="p-4 space-y-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Effects
                </h3>

                <div className="space-y-2">
                  <Label className="text-xs text-white/60">Playback Speed</Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4].map(s => (
                      <button key={s}
                        onClick={() => setEdit(p => ({ ...p, speed: s }))}
                        className={`py-1.5 rounded text-xs font-mono border transition-colors
                          ${edit.speed === s ? 'border-primary bg-primary/20 text-primary' : 'border-white/15 text-white/40 hover:text-white hover:border-white/30'}`}
                      >
                        {s}×
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <Label className="text-xs text-white/60">Rotation</Label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 90, 180, 270].map(r => (
                      <button key={r}
                        onClick={() => setEdit(p => ({ ...p, rotate: r }))}
                        className={`py-1.5 rounded text-xs border transition-colors
                          ${edit.rotate === r ? 'border-primary bg-primary/20 text-primary' : 'border-white/15 text-white/40 hover:text-white'}`}
                      >
                        {r}°
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <Label className="text-xs text-white/60">Mirror</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEdit(p => ({ ...p, flipH: !p.flipH }))}
                      className={`py-2 rounded text-xs border flex items-center justify-center gap-2 transition-colors
                        ${edit.flipH ? 'border-primary bg-primary/20 text-primary' : 'border-white/15 text-white/40 hover:text-white'}`}
                    >
                      <FlipHorizontal className="h-3.5 w-3.5" /> Horizontal
                    </button>
                    <button
                      onClick={() => setEdit(p => ({ ...p, flipV: !p.flipV }))}
                      className={`py-2 rounded text-xs border flex items-center justify-center gap-2 transition-colors
                        ${edit.flipV ? 'border-primary bg-primary/20 text-primary' : 'border-white/15 text-white/40 hover:text-white'}`}
                    >
                      <FlipVertical className="h-3.5 w-3.5" /> Vertical
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── TRANSITIONS ───────────────────────────────────────────── */}
            {activePanel === 'transitions' && (
              <div className="p-4 space-y-5">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Transitions
                </h3>
                <p className="text-xs text-white/30">Select a transition to apply to the start of this clip.</p>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'none',  label: 'None',    emoji: '🚫' },
                    { key: 'fade',  label: 'Fade In',  emoji: '🌅' },
                    { key: 'wipe',  label: 'Wipe Left', emoji: '👈' },
                    { key: 'zoom',  label: 'Zoom In',  emoji: '🔍' },
                  ] as const).map(t => (
                    <button key={t.key}
                      onClick={() => setEdit(p => ({ ...p, transition: t.key }))}
                      className={`py-3 px-2 rounded-lg border flex flex-col items-center gap-1.5 text-xs transition-colors
                        ${edit.transition === t.key ? 'border-primary bg-primary/20 text-primary' : 'border-white/15 text-white/40 hover:text-white hover:border-white/30'}`}
                    >
                      <span className="text-xl">{t.emoji}</span>
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <Label className="text-xs text-white/60">Format & Export</Label>
                  <div className="space-y-1.5 rounded-lg bg-white/5 p-3 text-xs text-white/50">
                    <div className="flex justify-between"><span>Format</span><span className="text-white font-mono">{edit.format}</span></div>
                    <div className="flex justify-between"><span>Speed</span><span className="text-white font-mono">{edit.speed}×</span></div>
                    <div className="flex justify-between"><span>Duration</span><span className="text-white font-mono">{msToTime(edit.endMs - edit.startMs)}</span></div>
                    <div className="flex justify-between"><span>Text Layers</span><span className="text-white font-mono">{edit.textLayers.length}</span></div>
                    <div className="flex justify-between"><span>Flip H/V</span><span className="text-white font-mono">{edit.flipH ? 'Yes' : 'No'} / {edit.flipV ? 'Yes' : 'No'}</span></div>
                    <div className="flex justify-between"><span>Transition</span><span className="text-white font-mono capitalize">{edit.transition}</span></div>
                  </div>

                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 gap-2 mt-2"
                    onClick={handleExport} disabled={exporting}>
                    <Download className="h-4 w-4" />
                    {exporting ? 'Rendering...' : `Export ${edit.format}`}
                  </Button>
                </div>
              </div>
            )}

          </aside>
        )}
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
