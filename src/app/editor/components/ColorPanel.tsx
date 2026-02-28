import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Palette, RotateCcw } from 'lucide-react';
import { ColorFilter, EditState, DEFAULT_COLOR, PRESETS } from '@/app/editor/types';

interface ColorPanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
}

export function ColorPanel({ edit, setEdit }: ColorPanelProps) {
  const updateColor = (key: keyof ColorFilter, val: number) => {
    setEdit((prev: EditState) => ({ ...prev, colorFilter: { ...prev.colorFilter, [key]: val } }));
  };

  return (
    <div className="p-4 space-y-5">
      <h3 className="font-semibold text-sm flex items-center gap-2">
        <Palette className="h-4 w-4 text-primary" /> Color Grading
      </h3>

      {/* Filter Presets */}
      <div>
        <Label className="text-xs text-white/50 mb-2 block">Preset</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((p: typeof PRESETS[0]) => (
            <button
              key={p.name}
              onClick={() => setEdit((prev: EditState) => ({ ...prev, colorFilter: { ...p.color } }))}
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
        onClick={() => setEdit((p: EditState) => ({ ...p, colorFilter: { ...DEFAULT_COLOR } }))}
      >
        <RotateCcw className="h-3 w-3 mr-1.5" /> Reset Color
      </Button>
    </div>
  );
}
