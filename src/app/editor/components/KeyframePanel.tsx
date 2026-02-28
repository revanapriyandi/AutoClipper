import React from 'react';
import { EditState, KeyframeData, generateId, msToTime } from '../types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, Trash2 } from 'lucide-react';

interface KeyframePanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
  currentTime: number;
}

export function KeyframePanel({ edit, setEdit, currentTime }: KeyframePanelProps) {
  
  const addKeyframe = () => {
    const kf: KeyframeData = {
      id: generateId(),
      startMs: currentTime,
      endMs: currentTime + 2000, // default 2 sec duration
      zoomBase: 1.0,
      zoomTarget: 1.2,
      panX: 0,
      panY: 0,
    };
    setEdit((prev: EditState) => ({ ...prev, keyframes: [...prev.keyframes, kf] }));
  };

  const updateKeyframe = (id: string, updates: Partial<KeyframeData>) => {
    setEdit((prev: EditState) => ({
      ...prev,
      keyframes: prev.keyframes.map(k => k.id === id ? { ...k, ...updates } : k)
    }));
  };

  const removeKeyframe = (id: string) => {
    setEdit((prev: EditState) => ({
      ...prev,
      keyframes: prev.keyframes.filter(k => k.id !== id)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white/90">Zoom & Pan Animations</h3>
        <Button size="sm" onClick={addKeyframe} className="gap-2">
          <Plus className="w-4 h-4" /> Add Keyframe 
        </Button>
      </div>
      
      <p className="text-xs text-white/50">
        Keyframes interpolate dynamically between Zoom Base and Zoom Target across a specified time duration.
      </p>

      <div className="space-y-4">
        {edit.keyframes.length === 0 && (
          <div className="text-center py-8 text-white/30 text-sm">No keyframes added yet</div>
        )}
        
        {edit.keyframes.map((kf, i) => (
          <div key={kf.id} className="p-3 bg-white/5 rounded-lg space-y-4 border border-white/10">
            <div className="flex items-center justify-between">
               <span className="text-xs font-semibold text-primary">Keyframe #{i + 1}</span>
               <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-400/10" onClick={() => removeKeyframe(kf.id)}>
                 <Trash2 className="w-4 h-4" />
               </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <span className="text-xs text-white/60">Start Time: {msToTime(kf.startMs)}</span>
                  <input type="range" 
                    min={0} max={edit.endMs} step={100} 
                    value={kf.startMs} onChange={e => updateKeyframe(kf.id, { startMs: Number(e.target.value) })}
                    className="w-full accent-primary" 
                  />
               </div>
               <div className="space-y-1.5">
                  <span className="text-xs text-white/60">Duration: {(kf.endMs - kf.startMs)/1000}s</span>
                  <input type="range" 
                    min={kf.startMs + 500} max={edit.endMs} step={100} 
                    value={kf.endMs} onChange={e => updateKeyframe(kf.id, { endMs: Number(e.target.value) })}
                    className="w-full accent-primary" 
                  />
               </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">Start Zoom ({kf.zoomBase.toFixed(2)}x)</span>
              </div>
              <Slider 
                value={[kf.zoomBase]} max={3} min={0.5} step={0.05} 
                onValueChange={v => updateKeyframe(kf.id, { zoomBase: v[0] })} 
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/70">End Zoom ({kf.zoomTarget.toFixed(2)}x)</span>
              </div>
              <Slider 
                value={[kf.zoomTarget]} max={3} min={0.5} step={0.05} 
                onValueChange={v => updateKeyframe(kf.id, { zoomTarget: v[0] })} 
              />
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
