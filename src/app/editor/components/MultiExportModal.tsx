import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Globe, Mic } from 'lucide-react';

const AVAILABLE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Korean',
  'Indonesian',
  'Hindi'
];

interface MultiExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (selectedLanguages: string[], enableDubbing: boolean) => void;
}

export function MultiExportModal({ open, onOpenChange, onExport }: MultiExportModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [enableDubbing, setEnableDubbing] = useState(false);

  const toggleLang = (lang: string) => {
    setSelected(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleStart = () => {
    if (selected.length === 0) return;
    onExport(selected, enableDubbing);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#161616] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" /> Multi-Language Export
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Automatically translate subtitles and synthesize voice dubbing for multiple regions at once. Each language will generate a separate rendering task.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white/80">Select Target Languages:</Label>
            <div className="grid grid-cols-2 gap-3">
              {AVAILABLE_LANGUAGES.map(lang => (
                <div key={lang} className="flex items-center space-x-2 bg-white/5 p-2 rounded-md border border-white/10 hover:bg-white/10 transition-colors">
                  <Checkbox
                    id={`lang-${lang}`}
                    checked={selected.includes(lang)}
                    onCheckedChange={() => toggleLang(lang)}
                    className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label
                    htmlFor={`lang-${lang}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {lang}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
            <Checkbox
              id="enable-dubbing"
              checked={enableDubbing}
              onCheckedChange={(c) => setEnableDubbing(!!c)}
              className="border-white/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor="enable-dubbing"
              className="text-sm font-medium leading-none cursor-pointer flex items-center gap-2 text-white/90"
            >
              <Mic className="h-4 w-4 text-white/50" /> Enable AI TTS Dubbing
            </label>
          </div>
          {enableDubbing && (
             <p className="text-xs text-amber-500/80 pl-6">
               Note: ElevenLabs API Key must be configured in Settings. Dubbing may override your background music depending on ducking settings.
             </p>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-white/60 hover:bg-white/5 hover:text-white">
            Cancel
          </Button>
          <Button onClick={handleStart} disabled={selected.length === 0} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Batch Export ({selected.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
