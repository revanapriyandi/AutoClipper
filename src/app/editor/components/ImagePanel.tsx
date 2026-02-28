import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Loader2, Sparkles, Image as ImageIcon, Settings2 } from "lucide-react";
import { EditState, StickerLayer } from "../types";

interface ImagePanelProps {
  edit: EditState;
  setEdit: React.Dispatch<React.SetStateAction<EditState>>;
}

export function ImagePanel({ edit, setEdit }: ImagePanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");

    try {
      const api = window.electronAPI;
      if (!api?.aiGenerateImage) throw new Error("Electron API pending / update required.");

      const res = await api.aiGenerateImage({ prompt, provider: 'openai' });
      if (!res.success || !res.base64) throw new Error(res.error || "Generation failed.");

      // Add to stickers array in VideoEdit
      const newStickers = [...(edit.stickers || []), {
         id: 'img_' + Date.now(),
         src: res.base64,
         x: 50,
         y: 50,
         scale: 1,
         startMs: edit.startMs,
         endMs: edit.endMs
      }];
      setEdit((prev: EditState) => ({ ...prev, stickers: newStickers }));
      setPrompt("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const removeSticker = (id: string) => {
    setEdit((prev: EditState) => ({ 
      ...prev, 
      stickers: (prev.stickers || []).filter((s: { id: string }) => s.id !== id) 
    }));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };

  const updateSticker = (id: string, updates: Partial<{ x: number, y: number, scale: number }>) => {
    setEdit((prev: EditState) => ({
      ...prev,
      stickers: (prev.stickers || []).map((s: StickerLayer) => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const selectedSticker = (edit.stickers || []).find((s: StickerLayer) => s.id === selectedStickerId);

  return (
    <div className="flex flex-col h-full bg-[#1c1c1c] text-white p-4 overflow-y-auto w-72 border-r border-white/10 shrink-0">
      <h3 className="text-sm font-bold flex items-center gap-2 mb-4 text-white/90">
        <Sparkles className="w-4 h-4 text-primary" /> AI Image Generator
      </h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs text-white/60">Image Prompt (DALL-E 3)</label>
          <Input 
            value={prompt} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
            placeholder="A futuristic cyberpunk city..."
            className="bg-black/50 border-white/10 text-sm placeholder:text-white/30"
          />
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate & Add"}
          </Button>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>

        {edit.stickers && edit.stickers.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
             <h4 className="text-xs font-semibold text-white/70">Generated Images ({edit.stickers.length})</h4>
             <div className="grid grid-cols-2 gap-2">
               {edit.stickers.map((stk: { id: string, src: string }) => (
                 <div 
                   key={stk.id} 
                   className={`relative group bg-black/40 rounded border aspect-square overflow-hidden cursor-pointer transition-all ${selectedStickerId === stk.id ? 'border-primary ring-1 ring-primary' : 'border-white/5 hover:border-white/20'}`}
                   onClick={() => setSelectedStickerId(stk.id)}
                 >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={stk.src} alt="sticker" className={`w-full h-full object-cover transition-opacity ${selectedStickerId === stk.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`} />
                    <button onClick={(e) => { e.stopPropagation(); removeSticker(stk.id); }} className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                 </div>
               ))}
             </div>
             
             {selectedSticker && (
               <div className="pt-4 space-y-4">
                 <h5 className="flex items-center gap-1.5 text-xs text-white/80 font-medium pb-1 border-b border-white/10">
                   <Settings2 className="w-3.5 h-3.5" /> Adjust Selected
                 </h5>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] text-white/50"><span>Position X</span><span>{selectedSticker.x}%</span></div>
                   <Slider value={[selectedSticker.x]} min={0} max={100} step={1} onValueChange={([v]) => updateSticker(selectedStickerId!, { x: v })} />
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] text-white/50"><span>Position Y</span><span>{selectedSticker.y}%</span></div>
                   <Slider value={[selectedSticker.y]} min={0} max={100} step={1} onValueChange={([v]) => updateSticker(selectedStickerId!, { y: v })} />
                 </div>
                 
                 <div className="space-y-2">
                   <div className="flex justify-between text-[10px] text-white/50"><span>Scale</span><span>{(selectedSticker.scale * 100).toFixed(0)}%</span></div>
                   <Slider value={[selectedSticker.scale]} min={0.1} max={3} step={0.05} onValueChange={([v]) => updateSticker(selectedStickerId!, { scale: v })} />
                 </div>
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
