"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, HardDrive, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => void;
}

export function ScheduleModal({ open, onOpenChange, onScheduled }: ScheduleModalProps) {
  const [videoPath, setVideoPath] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [caption, setCaption] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("12:00");
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState("");

  const handleSelectVideo = async () => {
    try {
      if (window.electronAPI?.dialogOpenFile) {
        const res = await window.electronAPI.dialogOpenFile({
           filters: [{ name: 'Videos', extensions: ['mp4', 'webm', 'mov'] }]
        });
        if (res.success && res.filePath) {
          setVideoPath(res.filePath);
          setError("");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateSchedule = async () => {
    if (!videoPath) { setError("Please select a video file first."); return; }
    if (!date) { setError("Please pick a scheduled date."); return; }
    if (!time) { setError("Please set a scheduled time."); return; }

    try {
      setIsScheduling(true);
      setError("");

      const [hours, minutes] = time.split(":").map(Number);
      const scheduledDateTime = new Date(date);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      if (scheduledDateTime < new Date()) {
        setError("Scheduled time must be in the future.");
        setIsScheduling(false);
        return;
      }

      const payload = {
        videoPath,
        title: caption.slice(0, 100).trim() || "Scheduled Post",
        description: caption,
        tags: [], // Could extract hashtags from caption
        targetPlatform: platform
      };

      const res = await window.electronAPI?.jobEnqueue({
        type: 'POST',
        payload,
        scheduledAt: scheduledDateTime.toISOString()
      });

      if (res?.success) {
        onScheduled();
        onOpenChange(false);
        // Reset form
        setVideoPath("");
        setCaption("");
        setDate(undefined);
        setTime("12:00");
      } else {
        setError(res?.error || "Failed to schedule job.");
      }
    } catch (e: unknown) {
      setError((e as Error).message || "Unknown error");
    }
    setIsScheduling(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Post</DialogTitle>
          <DialogDescription>
            Select a video and set its automated publication time.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 p-2 rounded-md border border-red-500/20">{error}</div>}
          
          <div className="flex flex-col gap-2">
            <Label>Video File</Label>
            <div className="flex gap-2">
              <Input value={videoPath} readOnly placeholder="No file selected..." className="font-mono text-xs text-muted-foreground" />
              <Button onClick={handleSelectVideo} variant="secondary"><HardDrive className="h-4 w-4" /></Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Social Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube Shorts</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="facebook">Facebook Reels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Caption & Tags</Label>
            <Textarea 
              value={caption} 
              onChange={e => setCaption(e.target.value)} 
              placeholder="Write your viral hook and #hashtags here..." 
              className="resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label>Time</Label>
              <div className="flex items-center">
                 <Clock className="w-4 h-4 mr-2 text-muted-foreground absolute ml-3" />
                 <Input 
                   type="time" 
                   value={time} 
                   onChange={e => setTime(e.target.value)} 
                   className="pl-9 w-full"
                 />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreateSchedule} disabled={isScheduling}>
            {isScheduling ? "Scheduling..." : <><UploadCloud className="mr-2 h-4 w-4"/> Queue Upload</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
