import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface ThumbnailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourcePath: string;
  startMs: number;
  endMs: number;
  clipId: string;
}

interface Variant {
  label: string;
  path: string;
  dataUrl: string;
}

export function ThumbnailModal({ open, onOpenChange, sourcePath, startMs, endMs, clipId }: ThumbnailModalProps) {
  const [caption, setCaption] = useState('Watch Full Video');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!window.electronAPI?.thumbnailGenerateAI) return;
    try {
      setLoading(true);
      setError('');
      setVariants([]);
      
      const res = await window.electronAPI.thumbnailGenerateAI({
        sourcePath,
        startMs,
        endMs,
        clipId,
        caption
      });

      if (res.success && res.variants) {
        setVariants(res.variants as Variant[]);
      } else {
        setError(res.error || 'Failed to generate thumbnail.');
      }
    } catch (e: unknown) {
      setError((e as Error).message || 'Unknown error');
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
        if (!val) setVariants([]);
        onOpenChange(val);
    }}>
      <DialogContent className="sm:max-w-[700px] bg-[#1c1c1c] text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-400" />
            AI Auto-Thumbnail
          </DialogTitle>
          <DialogDescription className="text-white/60">
             Extract high-contrast keyframes from this clip and overlay brand typography. You must have YouTube Shorts or TikTok covers in mind.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <div className="text-red-400 text-sm bg-red-900/20 p-2 rounded border border-red-500/20">{error}</div>}
          
          <div className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Hook Text (Max 60 chars)</Label>
              <Input 
                value={caption} 
                onChange={e => setCaption(e.target.value)}
                placeholder="Insert clickbait hook..."
                maxLength={60}
                className="bg-black/50 border-white/10"
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Extract Frames"}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {variants.map((v, i) => (
               <div key={i} className="flex flex-col gap-2 relative group">
                  <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden border border-white/10 relative">
                     {v.dataUrl ? (
                         /* eslint-disable-next-line @next/next/no-img-element */
                         <img src={v.dataUrl} alt={v.label} className="w-full h-full object-cover" />
                     ) : (
                         <div className="w-full h-full flex items-center justify-center text-xs text-white/30 text-center p-4">Text composite failed</div>
                     )}
                  </div>
               </div>
            ))}
            
            {loading && !variants.length && (
              <div className="col-span-3 aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-white/20">
                <div className="flex flex-col items-center gap-2 text-white/50">
                   <Loader2 className="w-6 h-6 animate-spin" />
                   <span className="text-xs">Scanning FFmpeg I-Frames...</span>
                </div>
              </div>
            )}
            
            {!loading && !variants.length && !error && (
              <div className="col-span-3 aspect-video bg-white/5 rounded-lg flex items-center justify-center border border-dashed border-white/20 text-white/30 text-xs text-center p-4">
                Thumbnails will appear here. The variant with text applied will use your active BrandKit font & color settings.
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:text-white hover:bg-white/10">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
