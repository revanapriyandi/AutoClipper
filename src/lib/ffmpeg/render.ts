import ffmpeg from "fluent-ffmpeg";
import { generateSrtFile, RenderSubtitleSegment } from "./subtitles";
import fs from "fs";

export interface RenderOptions {
  sourcePath: string;
  outputPath: string;
  startMs: number;
  endMs: number;
  segments: RenderSubtitleSegment[];
  isVerticalTarget?: boolean; // If true, crops center to 9:16
}

/**
 * Trims the video, crops it to 9:16 if needed, burns in Subtitles, and exports.
 */
export async function renderClip(options: RenderOptions): Promise<string> {
  const { sourcePath, outputPath, startMs, endMs, segments, isVerticalTarget = true } = options;
  const durationSec = (endMs - startMs) / 1000;
  const startSec = startMs / 1000;

  // Generate the SRT file
  const srtPath = generateSrtFile(startMs, segments);

  return new Promise((resolve, reject) => {
    const command = ffmpeg(sourcePath).setStartTime(startSec).setDuration(durationSec);

    const videoFilters: string[] = [];

    if (isVerticalTarget) {
      // Scale and Crop to 9:16 (1080x1920)
      // "ih*9/16" computes the width to maintain 9:16 based on the input height
      videoFilters.push("crop=ih*9/16:ih");
      videoFilters.push("scale=1080:1920");
    }

    // Burn-in subtitles. 
    // In Windows we need to escape backslashes for the filter graph if they exist in paths
    const escapedSrtPath = srtPath.replace(/\\/g, "/").replace(/:/g, "\\:");
    videoFilters.push(`subtitles='${escapedSrtPath}':force_style='Fontname=Arial,Fontsize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,BorderStyle=1,Outline=2,Alignment=2'`);

    command
      .videoFilters(videoFilters)
      .outputOptions([
        "-c:v libx264",
        "-preset fast", // 'fast' or 'faster' for dev, 'medium' for prod
        "-crf 23",
        "-c:a aac",
        "-b:a 128k",
      ])
      .save(outputPath)
      .on("end", () => {
        // Cleanup the temporary SRT file
        if (fs.existsSync(srtPath)) {
          fs.unlinkSync(srtPath);
        }
        resolve(outputPath);
      })
      .on("error", (err) => {
        if (fs.existsSync(srtPath)) {
          fs.unlinkSync(srtPath);
        }
        reject(new Error(`FFmpeg Render Error: ${err.message}`));
      });
  });
}
