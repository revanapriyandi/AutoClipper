import fs from "fs";
import path from "path";
import os from "os";

// Helper to convert seconds into SRT timestamp format (HH:MM:SS,mmm)
function formatSrtTime(seconds: number): string {
  const date = new Date(0);
  date.setMilliseconds(seconds * 1000);
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  const ms = String(date.getUTCMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss},${ms}`;
}

export interface RenderSubtitleWord {
  word: string;
  start: number; // in seconds
  end: number;   // in seconds
}

export interface RenderSubtitleSegment {
  text: string;
  words?: RenderSubtitleWord[];
  start: number;
  end: number;
}

/**
 * Creates an SRT file from transcript segments for a specific clip duration.
 * Adjusts the global timestamps to be relative to the start of the clip.
 * 
 * @param clipStartMs Global start time of the clip in the original video
 * @param segments Global transcript segments overlapping with the clip
 * @returns path to the generated .srt file
 */
export function generateSrtFile(
  clipStartMs: number, 
  segments: RenderSubtitleSegment[]
): string {
  const srtPath = path.join(os.tmpdir(), `autoclipper_sub_${Date.now()}.srt`);
  let srtContent = "";
  let counter = 1;

  for (const seg of segments) {
    // Relative start/end inside the cut clip
    const relativeStartSec = Math.max(0, seg.start - (clipStartMs / 1000));
    const relativeEndSec = Math.max(0, seg.end - (clipStartMs / 1000));
    
    // Only add if it belongs in the clip's valid duration
    if (relativeEndSec > 0) {
      srtContent += `${counter}\n`;
      srtContent += `${formatSrtTime(relativeStartSec)} --> ${formatSrtTime(relativeEndSec)}\n`;
      srtContent += `${seg.text}\n\n`;
      counter++;
    }
  }

  fs.writeFileSync(srtPath, srtContent, "utf8");
  return srtPath;
}
