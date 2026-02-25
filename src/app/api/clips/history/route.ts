import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const clips = await prisma.clip.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        assets: { select: { kind: true, storagePath: true } },
        project: { select: { title: true } },
      },
    });

    const result = clips.map(c => ({
      id: c.id,
      projectId: c.projectId,
      projectTitle: c.project.title,
      startMs: c.startMs,
      endMs: c.endMs,
      status: c.status,
      scores: c.scores,
      caption: c.caption,
      createdAt: c.createdAt,
      assets: c.assets,
    }));

    return NextResponse.json({ success: true, clips: result });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
