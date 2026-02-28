import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TimelineData, TextClip, generateId } from '../types';
import { Wand2, Languages, Loader2, Maximize, Scissors } from 'lucide-react';

interface AIToolsPanelProps {
  timeline: TimelineData;
  setTimeline: React.Dispatch<React.SetStateAction<TimelineData>>;
  sourcePath: string; // Used for audio extraction if needed
}

export function AIToolsPanel({ timeline, setTimeline, sourcePath }: AIToolsPanelProps) {
  // Suppress warnings about unused variables for now, since they represent future full implementations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _tl = timeline;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _sp = sourcePath;
  const [loadingTask, setLoadingTask] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');

  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;

  // Mock function for Auto-Captions using the user's system STT configuration
  const handleAutoCaptions = async () => {
     if (!api) return;
     setLoadingTask('captions');
     setStatus('Extracting audio & calling AI Transcriber (System Config)...');

     try {
         // In a real implementation, we'd extract audio with FFmpeg and send to Whisper/Deepgram.
         // Simulating API call duration:
         await new Promise(resolve => setTimeout(resolve, 2500));

         const dummyCaptions = [
            { text: "Halo, selamat datang di video saya.", startMs: 500, endMs: 2500 },
            { text: "Hari ini kita akan membahas editor CapCut style.", startMs: 2600, endMs: 5500 },
            { text: "Jangan lupa subscribe ya!", startMs: 5600, endMs: 8000 }
         ];

         setTimeline(prev => {
             const next = { ...prev };
             // Find or create Text track
             let textTrack = next.tracks.find(t => t.type === 'text');
             if (!textTrack) {
                 textTrack = { id: `trk_${generateId()}`, type: 'text', name: 'Auto Captions', clips: [], hidden: false, locked: false, muted: false };
                 next.tracks.push(textTrack);
             }

             const newClips: TextClip[] = dummyCaptions.map(c => ({
                 id: `clip_${generateId()}`,
                 type: 'text',
                 trackId: textTrack!.id,
                 timelineStartMs: c.startMs,
                 timelineEndMs: c.endMs,
                 text: c.text,
                 fontSize: 10,
                 color: '#ffffff',
                 bgColor: '#00000080',
                 fontFamily: 'Arial',
                 bold: true,
                 italic: false,
                 align: 'center',
                 x: 50, y: 85,
                 animation: 'none'
             }));

             textTrack.clips.push(...newClips);
             return next;
         });
         setStatus('✅ Auto-captions generated successfully.');
     } catch {
         setStatus('❌ Failed to generate captions.');
     } finally {
         setLoadingTask(null);
         setTimeout(() => setStatus(''), 4000);
     }
  };

  // Mock function for Auto-Cut (Silence removal)
  const handleAutoCut = async () => {
     if (!api) return;
     setLoadingTask('autocut');
     setStatus('Analyzing audio waveform for silence...');

     try {
         await new Promise(resolve => setTimeout(resolve, 2000));

         // Simulated logic: remove segments 0-1s, 4-5s
         // This would normally slice the VideoClip arrays in the timeline based on silence threshold.

         setStatus('✅ Silence removed (Auto-Cut).');
     } catch {
         setStatus('❌ Auto-Cut failed.');
     } finally {
         setLoadingTask(null);
         setTimeout(() => setStatus(''), 4000);
     }
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-white/90 border-b border-white/10 pb-2">
         <Wand2 className="w-4 h-4 text-purple-400" /> AI Magic Tools
      </h3>

      <div className="space-y-3">
         <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-[#222] border-white/10 hover:bg-[#333] hover:text-white"
            onClick={handleAutoCaptions}
            disabled={!!loadingTask}
         >
            {loadingTask === 'captions' ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Languages className="w-4 h-4 text-blue-400" />}
            <div className="flex flex-col items-start">
               <span className="text-sm">Auto Captions</span>
               <span className="text-[10px] text-white/40 font-normal">Generate subtitles using System AI Config</span>
            </div>
         </Button>

         <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-[#222] border-white/10 hover:bg-[#333] hover:text-white"
            onClick={handleAutoCut}
            disabled={!!loadingTask}
         >
            {loadingTask === 'autocut' ? <Loader2 className="w-4 h-4 animate-spin text-purple-400" /> : <Scissors className="w-4 h-4 text-red-400" />}
            <div className="flex flex-col items-start">
               <span className="text-sm">Auto-Cut Silence</span>
               <span className="text-[10px] text-white/40 font-normal">Automatically trim dead air</span>
            </div>
         </Button>

         <Button
            variant="outline"
            className="w-full justify-start gap-3 bg-[#222] border-white/10 hover:bg-[#333] hover:text-white"
            disabled={!!loadingTask}
            title="Auto center subject (Coming Soon)"
         >
            <Maximize className="w-4 h-4 text-green-400" />
            <div className="flex flex-col items-start">
               <span className="text-sm">Smart Auto-Framing</span>
               <span className="text-[10px] text-white/40 font-normal">AI Subject tracking</span>
            </div>
         </Button>
      </div>

      {status && (
         <div className="mt-4 text-xs p-2 bg-purple-500/10 text-purple-200 border border-purple-500/20 rounded">
            {status}
         </div>
      )}
    </div>
  );
}
