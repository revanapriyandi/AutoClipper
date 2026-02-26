import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const prisma = getPrisma();
  try {
    const clips = await prisma.clip.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        assets: { select: { kind: true, storagePath: true } },
        project: { select: { title: true } },
      },
    });

    const result = clips.map((c: (typeof clips)[number]) => ({
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
