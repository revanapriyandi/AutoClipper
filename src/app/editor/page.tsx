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
import {
  ArrowLeft, Play, Pause, SkipBack, SkipForward, Scissors, Volume2,
  VolumeX, Type, Music, Palette, Layers, Zap, FlipHorizontal,
  FlipVertical, RotateCcw, Undo2, Redo2, Download, Clapperboard, Globe, Image as ImageIcon
} from 'lucide-react';

import { TextPanel } from './components/TextPanel';
import { ColorPanel } from './components/ColorPanel';
import { AudioPanel } from './components/AudioPanel';
import { EffectsPanel } from './components/EffectsPanel';
import { TransitionsPanel } from './components/TransitionsPanel';
import { KeyframePanel } from './components/KeyframePanel';
import { ImagePanel } from './components/ImagePanel';
import { MultiExportModal } from './components/MultiExportModal';
import { ThumbnailModal } from './components/ThumbnailModal';
import { EditState, ColorFilter, DEFAULT_COLOR, generateId, msToTime } from './types';

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
  const audioRef   = useRef<HTMLAudioElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');
  const [showMultiExport, setShowMultiExport] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(false);
  const [waveformUrl, setWaveformUrl] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'text' | 'audio' | 'color' | 'effects' | 'transitions' | 'keyframes' | 'image' | null>('color');
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
    if (!sourcePath || !api) { setLoading(false); return; }
    api.readVideoAsDataUrl(sourcePath).then(res => {
      if (res?.success && res.dataUrl) {
        setVideoUrl(res.dataUrl);
      }
      setLoading(false);
    });
    
    // Fetch Waveform
    if (api.getWaveform) {
      api.getWaveform(sourcePath, 800, 100).then((res: { success: boolean; dataUrl?: string }) => {
        if (res?.success && res.dataUrl) setWaveformUrl(res.dataUrl);
      }).catch((e: Error) => console.error("Waveform error:", e));
    }
  }, [sourcePath, api]);

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
      videoRef.current.currentTime = initStart / 1000;
    }
  }, [videoUrl, initStart]);

  // Load bg audio
  useEffect(() => {
    if (edit.audioTrack?.path && api?.readVideoAsDataUrl) {
      api.readVideoAsDataUrl(edit.audioTrack.path).then(res => {
         if (res?.success && res.dataUrl) setAudioUrl(res.dataUrl);
      });
    } else {
      setAudioUrl('');
    }
  }, [edit.audioTrack?.path, api]);

  // Sync playback
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const onTime = () => {
      const absMs = v.currentTime * 1000;
      const relMs = absMs - edit.startMs;
      setCurrentTime(Math.max(0, relMs));
      
      const a = audioRef.current;
      if (a && !a.paused && Math.abs(a.currentTime - v.currentTime) > 0.3) {
          a.currentTime = v.currentTime;
      }

      if (absMs >= edit.endMs / edit.speed) {
        v.pause(); if (a) a.pause();
        setPlaying(false);
        v.currentTime = edit.startMs / 1000;
        if (a) a.currentTime = edit.startMs / 1000;
        setCurrentTime(0);
      }
    };
    v.addEventListener('timeupdate', onTime);
    return () => { v.removeEventListener('timeupdate', onTime); };
  }, [edit.startMs, edit.endMs, edit.speed]);

  // Apply playback speed
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = edit.speed;
    if (audioRef.current) audioRef.current.playbackRate = edit.speed;
  }, [edit.speed]);

  // Apply video volume & muteOriginal
  useEffect(() => {
    if (videoRef.current) {
        videoRef.current.volume = edit.muteOriginal ? 0 : edit.videoVolume;
    }
  }, [edit.videoVolume, edit.muteOriginal]);

  // Apply audio track volume
  useEffect(() => {
    if (audioRef.current && edit.audioTrack) {
        audioRef.current.volume = edit.audioTrack.volume;
    }
  }, [edit.audioTrack, edit.audioTrack?.volume]);

  const togglePlay = () => {
    const v = videoRef.current; if (!v) return;
    const a = audioRef.current;
    if (playing) { 
        v.pause(); if (a) a.pause();
        setPlaying(false); 
    }
    else { 
        v.play(); if (a) a.play();
        setPlaying(true); 
    }
  };

  const seekTo = (ms: number) => {
    const v = videoRef.current; if (!v) return;
    v.currentTime = (edit.startMs + ms) / 1000;
    if (audioRef.current) audioRef.current.currentTime = (edit.startMs + ms) / 1000;
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

    // Keyframes interpolation
    let currentZoom = 1;
    let currentPanX = 0;
    let currentPanY = 0;

    for (const kf of edit.keyframes) {
      if (currentTime >= kf.startMs && currentTime <= kf.endMs) {
        const progress = (currentTime - kf.startMs) / (kf.endMs - kf.startMs);
        currentZoom = kf.zoomBase + progress * (kf.zoomTarget - kf.zoomBase);
        currentPanX = kf.panX; // currently static pan in FFmpeg setup
        currentPanY = kf.panY;
        break; // apply first matching
      } else if (currentTime > kf.endMs) {
         currentZoom = kf.zoomTarget; // hold last frame if past it
      }
    }

    if (currentZoom !== 1 || currentPanX !== 0 || currentPanY !== 0) {
       parts.push(`translate(${currentPanX}%, ${currentPanY}%)`);
       parts.push(`scale(${currentZoom})`);
    }

    return parts.join(' ') || 'none';
  })();

  // ── Active text layer ─────────────────────────────────────────────────────
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

    const wsRes = await api.dbGetWorkspaces();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultKit = (wsRes?.workspaces as any[])?.[0]?.kits?.[0]; // Auto-apply first found brand kit globally 

    const payload = {
      jobId: `editor_${generateId()}`,
      sourcePath,
      startMs: edit.startMs,
      endMs:   edit.endMs,
      segments,
      format: edit.format,
      isVerticalTarget: edit.format === '9:16' || edit.format === '4:5',
      bgMusicPath: edit.audioTrack?.path || null,
      bgMusicOptions: edit.audioTrack || null,
      speed: edit.speed,
      flipH: edit.flipH,
      flipV: edit.flipV,
      rotate: edit.rotate,
      colorFilterString: buildFfmpegColorFilter(edit.colorFilter),
      videoVolume: edit.videoVolume,
      muteOriginal: edit.muteOriginal,
      sfxEnabled: edit.sfxEnabled,
      enhanceAudio: edit.enhanceAudio,
      audioDucking: edit.audioDucking,
      keyframes: edit.keyframes,
      brollLayers: edit.brollLayers,
      style: { font: 'Arial', primaryColor: '&H00FFFFFF', outlineColor: '&H00000000', alignment: 2, marginV: 120 },
      brandKit: defaultKit,
      stickers: edit.stickers,
    };

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

    const segments = edit.textLayers.map(l => ({
      start: (edit.startMs + l.startMs) / 1000,
      end:   (edit.startMs + l.endMs)   / 1000,
      text:  l.text,
      words: [],
    }));

    const wsRes = await api.dbGetWorkspaces();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const defaultKit = (wsRes?.workspaces as any[])?.[0]?.kits?.[0];

    const basePayload = {
      jobId: `editor_m_${generateId()}`,
      sourcePath,
      startMs: edit.startMs,
      endMs: edit.endMs,
      segments,
      format: edit.format,
      isVerticalTarget: edit.format === '9:16' || edit.format === '4:5',
      bgMusicPath: edit.audioTrack?.path || null,
      bgMusicOptions: edit.audioTrack || null,
      speed: edit.speed,
      flipH: edit.flipH,
      flipV: edit.flipV,
      rotate: edit.rotate,
      colorFilterString: buildFfmpegColorFilter(edit.colorFilter),
      videoVolume: edit.videoVolume,
      muteOriginal: edit.muteOriginal,
      sfxEnabled: edit.sfxEnabled,
      enhanceAudio: edit.enhanceAudio,
      audioDucking: edit.audioDucking,
      keyframes: edit.keyframes,
      brollLayers: edit.brollLayers,
      style: { font: 'Arial', primaryColor: '&H00FFFFFF', outlineColor: '&H00000000', alignment: 2, marginV: 120 },
      brandKit: defaultKit,
      stickers: edit.stickers,
    };

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
          <Button
            size="sm" className="bg-amber-600 hover:bg-amber-500 gap-1.5"
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

        {/* LEFT TOOL SIDEBAR */}
        <aside className="w-14 bg-[#1c1c1c] border-r border-white/10 flex flex-col items-center py-3 gap-1 shrink-0">
          {([
            { icon: <Palette />,     panel: 'color',       label: 'Color' },
            { icon: <ImageIcon />,   panel: 'image',       label: 'AI Image' },
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
                muted={edit.muteOriginal}
                playsInline
              />

              {audioUrl && (
                  <audio ref={audioRef} src={audioUrl} loop={false} />
              )}

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

              {/* Sticker overlays preview */}
              {(edit.stickers || []).filter(s => {
                const absTime = edit.startMs + currentTime;
                return absTime >= s.startMs && absTime <= s.endMs;
              }).map(stk => (
                <div
                  key={stk.id}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${stk.x}%`, top: `${stk.y}%`,
                    transform: `translate(-50%, -50%) scale(${stk.scale})`,
                    width: '30%', // Default relative width
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stk.src} alt="Sticker" className="w-full h-auto object-contain drop-shadow-2xl" />
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

              {/* Waveform Background Overlay */}
              {waveformUrl && (
                <div
                  className="absolute inset-x-0 bottom-0 h-10 opacity-30 pointer-events-none"
                  style={{
                     backgroundImage: `url(${waveformUrl})`,
                     backgroundSize: '100% 100%',
                     backgroundRepeat: 'no-repeat',
                     mixBlendMode: 'screen'
                  }}
                />
              )}

              {/* Playhead */}
              <div
                className="absolute top-0 h-full w-0.5 bg-red-500 z-20 pointer-events-none"
                style={{ left: `${(currentTime / Math.max(1, edit.endMs - edit.startMs)) * 100}%`, boxShadow: '0 0 4px red' }}
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

            {/* Audio Track Indication */}
            {edit.audioTrack && (
              <div className="relative h-6 mt-2 bg-primary/10 rounded overflow-hidden border border-primary/20 flex items-center shrink-0">
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 4px, var(--primary) 4px, var(--primary) 8px)' }}></div>
                <div className="px-2 text-[10px] text-primary/80 font-mono truncate z-10 flex items-center gap-1.5 w-full">
                  <Music className="w-3 h-3 shrink-0" />
                  <span className="truncate">{edit.audioTrack.path.split(/[\\/]/).pop()}</span>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT PANEL */}
        {activePanel && (
          <aside className="w-72 bg-[#1c1c1c] border-l border-white/10 flex flex-col overflow-y-auto shrink-0">
            {/* ── COLOR GRADING ─────────────────────────────────────────── */}
            {activePanel === 'color' && <ColorPanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} />}

            {/* ── TEXT LAYERS ───────────────────────────────────────────── */}
            {activePanel === 'text' && (
              <TextPanel
                edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>}
                currentTime={currentTime}
                selectedLayerId={selectedLayerId} setSelectedLayerId={setSelectedLayerId}
              />
            )}

            {/* ── AUDIO ─────────────────────────────────────────────────── */}
            {activePanel === 'audio' && <AudioPanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} api={api || null} />}

            {/* ── EFFECTS ───────────────────────────────────────────────── */}
            {activePanel === 'effects' && <EffectsPanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} />}

            {/* ── TRANSITIONS ───────────────────────────────────────────── */}
            {activePanel === 'transitions' && (
              <TransitionsPanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} handleExport={handleExport} exporting={exporting} />
            )}

            {/* ── KEYFRAMES ─────────────────────────────────────────────── */}
            {activePanel === 'keyframes' && <KeyframePanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} currentTime={currentTime} />}

            {/* ── AI IMAGE ──────────────────────────────────────────────── */}
            {activePanel === 'image' && <ImagePanel edit={edit} setEdit={setEdit as React.Dispatch<React.SetStateAction<EditState>>} />}
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
