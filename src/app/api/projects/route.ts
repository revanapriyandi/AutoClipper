import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';
import ffmpeg from "fluent-ffmpeg";

// In a real desktop app, we might need a built-in ffprobe binary.
// For now, relies on system-installed FFmpeg/FFprobe.
export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const { title, sourcePath } = await req.json();

    if (!title || !sourcePath) {
      return NextResponse.json({ error: "Missing title or sourcePath" }, { status: 400 });
    }

    // Wrap ffprobe in a promise to securely get the video duration
    const durationMs = await new Promise<number>((resolve, reject) => {
      ffmpeg.ffprobe(sourcePath, (err, metadata) => {
        if (err) {
          console.error("FFProbe error:", err);
          return reject(err);
        }
        // Extract duration in seconds and convert to milliseconds
        const durationSec = metadata.format.duration || 0;
        resolve(Math.floor(durationSec * 1000));
      });
    });

    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        title,
        sourcePath,
        durationMs,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ success: true, project });

  } catch (error: unknown) {
    console.error("Failed to create project:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to create project" }, { status: 500 });
  }
}

export async function GET() {
  const prisma = new PrismaClient();
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    console.error("Failed to list projects:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || "Failed to list projects" }, { status: 500 });
  }
}
