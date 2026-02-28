import React, { useRef, useState } from 'react';
import { TimelineData, Clip, msToTime } from '../types';
import { Scissors, MousePointer2, Type, Music, Palette, GripVertical, Settings, Copy, Trash2, Files } from 'lucide-react';
import { ContextMenu } from './ContextMenu';

interface MultiTrackTimelineProps {
  timeline: TimelineData;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineData>>;
  currentTime: number;
  seekTo: (ms: number) => void;
}

const PIXELS_PER_MS = 0.05; // Base scale: 1 second = 50px
const TRACK_HEIGHT = 60;

export function MultiTrackTimeline({ timeline, setTimeline, currentTime, seekTo }: MultiTrackTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  // Dragging state
  const [draggedClip, setDraggedClip] = useState<{ id: string; initialStartMs: number; offsetX: number; trackId: string } | null>(null);

  // Context Menu state
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, clipId: string, trackId: string } | null>(null);
  const [clipboardClip, setClipboardClip] = useState<Clip | null>(null);

  const scale = PIXELS_PER_MS * zoom;

  // Handle clicking on ruler to seek
  const handleRulerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = clickX / scale;
    seekTo(Math.max(0, Math.min(newTime, timeline.durationMs)));
  };

  // Handle dragging a clip
  const handleClipPointerDown = (e: React.PointerEvent, clip: Clip, trackId: string) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    setSelectedClipId(clip.id);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDraggedClip({
      id: clip.id,
      initialStartMs: clip.timelineStartMs,
      offsetX: e.clientX - rect.left,
      trackId,
    });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedClip || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const scrollLeft = containerRef.current.scrollLeft;
    const xPos = e.clientX - rect.left + scrollLeft - draggedClip.offsetX;

    const newStartMs = Math.max(0, xPos / scale);

    setTimeline(prev => {
        const next = { ...prev };
        // Create a deep copy of the tracks to mutate
        next.tracks = next.tracks.map(t => ({
           ...t,
           clips: t.clips.map(c => {
               if (c.id === draggedClip.id) {
                   const duration = c.timelineEndMs - c.timelineStartMs;
                   return {
                       ...c,
                       timelineStartMs: newStartMs,
                       timelineEndMs: newStartMs + duration
                   };
               }
               return c;
           })
        }));
        return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedClip) {
       (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
       setDraggedClip(null);
    }
  };

  const getTrackIcon = (type: string) => {
      switch(type) {
          case 'video': return <Palette className="w-3 h-3 text-blue-400" />;
          case 'audio': return <Music className="w-3 h-3 text-green-400" />;
          case 'text': return <Type className="w-3 h-3 text-yellow-400" />;
          default: return <Settings className="w-3 h-3" />;
      }
  };

  const getClipColor = (type: string) => {
       switch(type) {
          case 'video': return 'bg-blue-600/60 border-blue-500';
          case 'audio': return 'bg-green-600/60 border-green-500';
          case 'text': return 'bg-yellow-600/60 border-yellow-500';
          case 'sticker': return 'bg-purple-600/60 border-purple-500';
          default: return 'bg-gray-600 border-gray-500';
      }
  }

  const handleContextMenu = (e: React.MouseEvent, clip: Clip, trackId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setSelectedClipId(clip.id);

      // Update the parent's selected layer ID so the property panel updates
      // Using a custom event or a passed prop would be better, but for now we'll do it safely
      const evt = new CustomEvent('editor-clip-selected', { detail: { id: clip.id } });
      window.dispatchEvent(evt);

      setContextMenu({ x: e.clientX, y: e.clientY, clipId: clip.id, trackId });
  };

  const getContextMenuActions = () => {
     if (!contextMenu) return [];

     const track = timeline.tracks.find(t => t.id === contextMenu.trackId);
     const clip = track?.clips.find(c => c.id === contextMenu.clipId);

     if (!track || !clip) return [];

     return [
       {
         label: 'Split', icon: <Scissors />, shortcut: 'S',
         disabled: currentTime <= clip.timelineStartMs || currentTime >= clip.timelineEndMs,
         onClick: () => {
             setTimeline(prev => {
                const next = { ...prev };
                next.tracks = next.tracks.map(t => {
                   if (t.id !== contextMenu.trackId) return t;

                   const cIdx = t.clips.findIndex(c => c.id === contextMenu.clipId);
                   if (cIdx === -1) return t;

                   const c = t.clips[cIdx];
                   if (currentTime > c.timelineStartMs && currentTime < c.timelineEndMs) {
                      const firstHalf = { ...c, timelineEndMs: currentTime };
                      const secondHalf = { ...c, id: Math.random().toString(36).substring(7), timelineStartMs: currentTime };

                      const newClips = [...t.clips];
                      newClips.splice(cIdx, 1, firstHalf, secondHalf);
                      return { ...t, clips: newClips };
                   }
                   return t;
                });
                return next;
             });
         }
       },
       {
         label: 'Copy', icon: <Copy />, shortcut: 'Ctrl+C',
         onClick: () => setClipboardClip(clip)
       },
       {
         label: 'Paste', icon: <Files />, shortcut: 'Ctrl+V', disabled: !clipboardClip,
         onClick: () => {
             if (clipboardClip) {
                 setTimeline(prev => {
                    const next = { ...prev };
                    next.tracks = next.tracks.map(t => {
                        if (t.id !== contextMenu.trackId) return t;
                        const duration = clipboardClip.timelineEndMs - clipboardClip.timelineStartMs;
                        const newClip = {
                            ...clipboardClip,
                            id: Math.random().toString(36).substring(7),
                            timelineStartMs: currentTime,
                            timelineEndMs: currentTime + duration
                        };
                        return { ...t, clips: [...t.clips, newClip] };
                    });
                    return next;
                 });
             }
         }
       },
       {
         label: 'Duplicate', icon: <Copy />, shortcut: 'Ctrl+D',
         onClick: () => {
             setTimeline(prev => {
                const next = { ...prev };
                next.tracks = next.tracks.map(t => {
                    if (t.id !== contextMenu.trackId) return t;
                    const duration = clip.timelineEndMs - clip.timelineStartMs;
                    const newClip = {
                        ...clip,
                        id: Math.random().toString(36).substring(7),
                        timelineStartMs: clip.timelineEndMs,
                        timelineEndMs: clip.timelineEndMs + duration
                    };
                    return { ...t, clips: [...t.clips, newClip] };
                });
                return next;
             });
         }
       },
       {
         label: 'Delete', icon: <Trash2 />, shortcut: 'Del', danger: true,
         onClick: () => {
             setTimeline(prev => {
                const next = { ...prev };
                next.tracks = next.tracks.map(t => {
                    if (t.id !== contextMenu.trackId) return t;
                    return { ...t, clips: t.clips.filter(c => c.id !== contextMenu.clipId) };
                });
                return next;
             });
             setSelectedClipId(null);
         }
       }
     ];
  };

  return (
    <div className="flex flex-col h-full bg-[#111] select-none">

      {/* Timeline Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 bg-[#1a1a1a] border-b border-white/5 shrink-0 h-8">
         <div className="flex gap-1">
             <button className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white" title="Select Tool">
                <MousePointer2 className="w-4 h-4" />
             </button>
             <button className="p-1 hover:bg-white/10 rounded text-white/70 hover:text-white" title="Split Tool (S)">
                <Scissors className="w-4 h-4" />
             </button>
         </div>
         <div className="flex items-center gap-2">
             <span className="text-[10px] text-white/40">Zoom</span>
             <input
                type="range" min="0.1" max="5" step="0.1" value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="w-24 accent-primary"
              />
         </div>
      </div>

      {/* Track Area Container */}
      <div className="flex flex-1 overflow-hidden relative">

          {/* Left Track Headers */}
          <div className="w-28 bg-[#161616] border-r border-white/10 shrink-0 flex flex-col z-20 shadow-[2px_0_8px_rgba(0,0,0,0.5)]">
             <div className="h-6 border-b border-white/10 bg-[#111] shrink-0" /> {/* Spacer for ruler */}

             {/* Track Headers Container */}
             <div className="flex-1 overflow-hidden">
                 {timeline.tracks.map(track => (
                    <div key={track.id} className="border-b border-white/5 bg-[#1a1a1a] px-2 py-1 flex items-start gap-2 group hover:bg-[#222] transition-colors" style={{ height: TRACK_HEIGHT }}>
                       <div className="mt-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                         <GripVertical className="w-3 h-3 text-white/40 cursor-grab active:cursor-grabbing" />
                       </div>
                       <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 w-full">
                             {getTrackIcon(track.type)}
                             <span className="text-[10px] font-medium text-white/80 truncate w-full" title={track.name}>{track.name}</span>
                          </div>
                          {/* Track controls could go here (Mute/Hide) */}
                       </div>
                    </div>
                 ))}
             </div>
          </div>

          {/* Right Timeline Grid */}
          <div
             ref={containerRef}
             className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#0f0f0f]"
             onPointerMove={handlePointerMove}
             onPointerUp={handlePointerUp}
             onPointerLeave={handlePointerUp}
          >

             {/* Ruler */}
             <div
               className="sticky top-0 h-6 bg-[#161616] border-b border-white/10 z-10 cursor-pointer overflow-hidden shrink-0"
               onClick={handleRulerClick}
             >
                <div style={{ width: Math.max(containerRef.current?.clientWidth || 0, timeline.durationMs * scale) }}>
                    {/* Render basic tick marks */}
                    {Array.from({ length: Math.ceil(timeline.durationMs / 1000) + 5 }).map((_, i) => (
                        <div key={i} className="absolute top-0 text-[9px] text-white/30 px-1 border-l border-white/10 h-full" style={{ left: i * 1000 * scale }}>
                            {msToTime(i * 1000)}
                        </div>
                    ))}
                </div>
             </div>

             {/* Tracks Content */}
             <div className="relative min-h-full" style={{ width: Math.max(containerRef.current?.clientWidth || 0, timeline.durationMs * scale) }}>

                 {/* Playhead Line */}
                 <div
                    ref={playheadRef}
                    className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none transition-all duration-75"
                    style={{ left: currentTime * scale, transform: 'translateX(-50%)' }}
                 >
                     <div className="w-3 h-3 rounded-full bg-red-500 absolute -top-1 -left-1" />
                 </div>

                 {/* Tracks */}
                 {timeline.tracks.map((track, i) => (
                     <div key={track.id} className={`relative border-b border-white/5 ${i % 2 === 0 ? 'bg-black/20' : ''}`} style={{ height: TRACK_HEIGHT }}>

                         {/* Clips */}
                         {track.clips.map(clip => {
                             const isSelected = selectedClipId === clip.id;
                             return (
                               <div
                                  key={clip.id}
                                  className={`absolute top-1 bottom-1 rounded-md border text-[10px] overflow-hidden ${getClipColor(clip.type)} ${isSelected ? 'ring-1 ring-white z-10' : ''}`}
                                  style={{
                                      left: clip.timelineStartMs * scale,
                                      width: (clip.timelineEndMs - clip.timelineStartMs) * scale,
                                  }}
                                  onPointerDown={(e) => {
                                      handleClipPointerDown(e, clip, track.id);
                                      const evt = new CustomEvent('editor-clip-selected', { detail: { id: clip.id } });
                                      window.dispatchEvent(evt);
                                  }}
                                  onContextMenu={(e) => handleContextMenu(e, clip, track.id)}
                               >
                                  <div className="px-1.5 py-0.5 truncate text-white/90 select-none pointer-events-none">
                                      {clip.name || clip.type}
                                  </div>

                                  {/* Trim handles (visual only for now) */}
                                  {isSelected && (
                                     <>
                                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/20 cursor-ew-resize hover:bg-white/40" />
                                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/20 cursor-ew-resize hover:bg-white/40" />
                                     </>
                                  )}
                               </div>
                             );
                         })}
                     </div>
                 ))}
             </div>
          </div>

      </div>

      {contextMenu && (
        <ContextMenu
           x={contextMenu.x}
           y={contextMenu.y}
           onClose={() => setContextMenu(null)}
           actions={getContextMenuActions()}
        />
      )}
    </div>
  );
}
