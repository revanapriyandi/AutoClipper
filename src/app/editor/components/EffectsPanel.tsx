import { Label } from '@/components/ui/label';
import { Sparkles, FlipHorizontal, FlipVertical } from 'lucide-react';
import { EditState } from '../types';

interface EffectsPanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
}

export function EffectsPanel({ edit, setEdit }: EffectsPanelProps) {
  return (
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
  );
}
