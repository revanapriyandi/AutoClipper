import React from 'react';
import { TimelineData, VideoClip } from '../types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface TrackPropertiesPanelProps {
  timeline: TimelineData;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineData>>;
  selectedClipId: string | null;
}

export function TrackPropertiesPanel({ timeline, setTimeline, selectedClipId }: TrackPropertiesPanelProps) {
  if (!selectedClipId) {
    return (
      <div className="p-4 text-center text-white/40 text-sm mt-10">
         Select a clip on the timeline to edit properties.
      </div>
    );
  }

  const track = timeline.tracks.find(t => t.clips.some(c => c.id === selectedClipId));
  const clip = track?.clips.find(c => c.id === selectedClipId);

  if (!track || !clip) return null;

  const updateClip = (updates: Partial<typeof clip>) => {
      setTimeline(prev => {
         const next = { ...prev };
         const t = next.tracks.find(tId => tId.id === track.id);
         if (t) {
            const cIdx = t.clips.findIndex(cId => cId.id === clip.id);
            if (cIdx !== -1) {
               // eslint-disable-next-line @typescript-eslint/no-explicit-any
               t.clips[cIdx] = { ...t.clips[cIdx], ...updates } as any;
            }
         }
         return next;
      });
  };

  // Rendering video properties
  if (clip.type === 'video') {
      const vClip = clip as VideoClip;
      return (
         <div className="p-4 space-y-6 text-sm">
             <div className="font-semibold text-white/90 border-b border-white/10 pb-2 flex justify-between">
                <span>Video Properties</span>
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/60">{(vClip.timelineEndMs - vClip.timelineStartMs) / 1000}s</span>
             </div>

             <div className="space-y-4">
                 <div>
                     <label className="text-xs text-white/60 mb-1 block">Speed</label>
                     <div className="flex gap-2 mb-2">
                        {[0.5, 1, 1.5, 2, 4].map(s => (
                            <button
                              key={s}
                              className={`px-2 py-1 rounded text-xs ${vClip.speed === s ? 'bg-primary text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                              onClick={() => updateClip({ speed: s })}
                            >{s}x</button>
                        ))}
                     </div>
                 </div>

                 <div>
                     <div className="flex justify-between text-xs mb-2">
                        <label className="text-white/60">Volume</label>
                        <span className="text-white/80">{Math.round(vClip.volume * 100)}%</span>
                     </div>
                     <Slider
                         value={[vClip.volume * 100]}
                         max={100} step={1}
                         onValueChange={([v]) => updateClip({ volume: v / 100 })}
                     />
                 </div>

                 <div className="space-y-3 pt-2 border-t border-white/5">
                     <label className="text-xs text-white/60 block">Transform</label>
                     <div className="grid grid-cols-2 gap-2">
                         <div>
                            <span className="text-[10px] text-white/40">Scale X/Y</span>
                            <Slider
                                value={[vClip.scale * 100]} max={300} min={10} step={1}
                                onValueChange={([v]) => updateClip({ scale: v / 100 })}
                            />
                         </div>
                         <div>
                            <span className="text-[10px] text-white/40">Rotation</span>
                            <Slider
                                value={[vClip.rotation]} max={360} min={-360} step={1}
                                onValueChange={([v]) => updateClip({ rotation: v })}
                            />
                         </div>
                     </div>
                     <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 bg-white/5 border-transparent text-xs" onClick={() => updateClip({ flipH: !vClip.flipH })}>
                            Flip H {vClip.flipH ? '(On)' : ''}
                         </Button>
                         <Button variant="outline" size="sm" className="flex-1 bg-white/5 border-transparent text-xs" onClick={() => updateClip({ flipV: !vClip.flipV })}>
                            Flip V {vClip.flipV ? '(On)' : ''}
                         </Button>
                     </div>
                 </div>

                 <div className="space-y-3 pt-2 border-t border-white/5">
                     <label className="text-xs text-white/60 block">Color Adjustment</label>

                     {['brightness', 'contrast', 'saturation'].map(attr => (
                         <div key={attr}>
                             <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-white/50 capitalize">{attr}</span>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                <span className="text-white/70">{Math.round(((vClip.colorFilter as any)[attr]) * 100)}</span>
                             </div>
                             <Slider
                                 // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                 value={[((vClip.colorFilter as any)[attr]) * 100]} min={-100} max={100} step={1}
                                 onValueChange={([v]) => updateClip({ colorFilter: { ...vClip.colorFilter, [attr]: v / 100 } })}
                             />
                         </div>
                     ))}
                 </div>
             </div>
         </div>
      );
  }

  return (
      <div className="p-4 text-sm text-white/60">
          Properties for {clip.type} track coming soon.
      </div>
  );
}
