import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Zap, Download } from 'lucide-react';
import { EditState, msToTime } from '../types';

interface TransitionsPanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
  handleExport: () => void;
  exporting: boolean;
}

export function TransitionsPanel({ edit, setEdit, handleExport, exporting }: TransitionsPanelProps) {
  return (
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
  );
}
