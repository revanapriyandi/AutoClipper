import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Type, Plus, Eye, EyeOff, Trash2, AlignLeft, AlignCenter, AlignRight, Languages } from 'lucide-react';
import { EditState, TextLayer, FONTS, msToTime, generateId } from '../types';

interface TextPanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
  currentTime: number;
  selectedLayerId: string | null;
  setSelectedLayerId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function TextPanel({ edit, setEdit, currentTime, selectedLayerId, setSelectedLayerId }: TextPanelProps) {
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

  const selectedLayer = edit.textLayers.find(l => l.id === selectedLayerId) ?? null;

  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLang, setTargetLang] = useState('Indonesian');

  const handleTranslateAll = async () => {
    if (edit.textLayers.length === 0) return;
    setIsTranslating(true);
    try {
      const api = window.electronAPI;
      if (!api?.aiTranslate) throw new Error("Translation API not found");
      
      const payload = edit.textLayers.map(l => ({
        id: l.id, start: l.startMs / 1000, end: l.endMs / 1000, text: l.text
      }));

      const res = await api.aiTranslate({ segments: payload, targetLanguage: targetLang });
      if (res.success && res.segments) {
        setEdit(prev => {
          const transMap = new Map(res.segments!.map(s => [s.id, s.text]));
          return {
             ...prev,
             textLayers: prev.textLayers.map(l => ({
               ...l,
               text: transMap.get(l.id) || l.text
             }))
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Type className="h-4 w-4 text-primary" /> Text Overlays
        </h3>
        <Button size="sm" variant="outline" className="h-7 border-white/20 text-xs gap-1" onClick={addTextLayer}>
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="flex gap-2 items-center bg-white/5 p-2 rounded-lg border border-white/10">
         <select 
            value={targetLang} onChange={e => setTargetLang(e.target.value)}
            className="bg-transparent text-xs text-white outline-none flex-1"
         >
            <option value="Indonesian">Indonesian</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Japanese">Japanese</option>
         </select>
         <Button size="sm" variant="default" className="h-7 text-xs gap-1" 
                 disabled={isTranslating || edit.textLayers.length === 0} 
                 onClick={handleTranslateAll}>
           <Languages className="h-3 w-3" />
           {isTranslating ? 'Translating...' : 'Auto-Translate'}
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
  );
}
