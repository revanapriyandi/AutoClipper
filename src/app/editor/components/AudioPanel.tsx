import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Music, Volume2, Trash2, Plus } from 'lucide-react';
import { EditState } from '../types';

interface AudioPanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
  api: { 
    openFilePicker?: (filters?: { name: string; extensions: string[]; }[]) => Promise<{ success: boolean; filePath?: string; }>; 
  } | null;
}

export function AudioPanel({ edit, setEdit, api }: AudioPanelProps) {
  return (
    <div className="p-4 space-y-6">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Music className="h-4 w-4 text-primary" /> Audio Mixer
      </h3>

      {/* TRACK 1: Video Audio */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-white">Track 1: Video Audio</Label>
          <button 
            onClick={() => setEdit(p => ({ ...p, muteOriginal: !p.muteOriginal }))}
            className={`text-[10px] px-2 py-0.5 rounded-full border ${edit.muteOriginal ? 'border-red-500/50 text-red-400 bg-red-500/10' : 'border-white/20 text-white/60 hover:bg-white/10'}`}
          >
            {edit.muteOriginal ? 'Muted' : 'Mute'}
          </button>
        </div>
        
        <div className={`space-y-2 transition-opacity duration-200 ${edit.muteOriginal ? 'opacity-30 pointer-events-none' : ''}`}>
          <div className="h-6 w-full rounded bg-white/5 border border-white/10 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, white 2px, white 4px)', backgroundSize: '10px 100%' }}></div>
             <span className="text-[10px] text-white/40 mix-blend-difference font-mono z-10">ORIGINAL_AUDIO.WAV</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <Volume2 className="h-4 w-4 text-white/40" />
            <Slider
              value={[edit.videoVolume * 100]}
              onValueChange={([v]) => setEdit(p => ({ ...p, videoVolume: v / 100 }))}
              max={100} step={1} className="flex-1"
            />
            <span className="text-xs font-mono text-white/40 w-8">{Math.round(edit.videoVolume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* TRACK 2: Background Music */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <Label className="text-xs font-semibold text-white">Track 2: Background Music</Label>
        {edit.audioTrack ? (
          <div className="bg-white/5 rounded-lg p-3 space-y-3 border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-primary" />
                <span className="text-xs text-white/80 font-medium truncate max-w-[140px]" title={edit.audioTrack.path}>
                  {edit.audioTrack.path.split(/[\\/]/).pop()}
                </span>
              </div>
              <button 
                onClick={() => setEdit(p => ({ ...p, audioTrack: null }))}
                className="hover:bg-red-500/20 p-1.5 rounded-md transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5 text-red-400/80" />
              </button>
            </div>

            <div className="h-6 w-full rounded bg-primary/10 border border-primary/20 relative overflow-hidden flex items-center justify-center mt-2">
                 <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, var(--primary) 3px, var(--primary) 6px)', backgroundSize: '14px 100%' }}></div>
            </div>

            <div className="space-y-1 pt-2">
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 text-primary/60" />
                <Slider
                  value={[edit.audioTrack.volume * 100]}
                  onValueChange={([v]) => setEdit(p => ({
                    ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, volume: v / 100 } : null
                  }))}
                  max={100} step={1} className="flex-1"
                />
                <span className="text-xs font-mono text-white/40 w-8">{Math.round(edit.audioTrack.volume * 100)}%</span>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={edit.audioTrack.fadeIn}
                  onChange={e => setEdit(p => ({ ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, fadeIn: e.target.checked } : null }))}
                  className="accent-primary" />
                <span className="text-xs text-white/60">Fade In</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                <input type="checkbox" checked={edit.audioTrack.fadeOut}
                  onChange={e => setEdit(p => ({ ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, fadeOut: e.target.checked } : null }))}
                  className="accent-primary" />
                <span className="text-xs text-white/60">Fade Out</span>
              </label>
            </div>
            
            <div className="border-t border-white/10 pt-3 mt-1 flex items-center justify-between">
              <span className="text-xs text-white/60">Start Offset (s)</span>
              <Input 
                type="number" min="0" step="0.1" 
                value={edit.audioTrack.trimStartSec || 0}
                onChange={e => setEdit(p => ({ ...p, audioTrack: p.audioTrack ? { ...p.audioTrack, trimStartSec: Number(e.target.value) || 0 } : null }))}
                className="w-16 h-6 text-xs bg-black/50 border-white/10 px-1 text-center" 
              />
            </div>
          </div>
        ) : (
          <Button
            variant="outline" size="sm" className="w-full bg-white/5 border-white/20 border-dashed text-white/60 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all h-20 flex flex-col gap-2"
            onClick={async () => {
              const res = await api?.openFilePicker?.([{ name: 'Audio', extensions: ['mp3','aac','wav','m4a','ogg'] }]);
              if (res?.success && res.filePath) {
                setEdit(p => ({ ...p, audioTrack: { path: res.filePath!, volume: 0.15, fadeIn: true, fadeOut: true } }));
              }
            }}
          >
            <Plus className="h-5 w-5" /> 
            <span className="text-xs">Add Audio Track</span>
          </Button>
        )}
      </div>
    </div>
  );
}
