const { ipcMain } = require('electron');
const prisma = require('../prisma');
const ffmpeg = require('fluent-ffmpeg');


ipcMain.handle('db:createProject', async (_, { title, sourcePath }) => {
  try {
    if (!title || !sourcePath) throw new Error("Missing title or sourcePath");

    const durationMs = await new Promise((resolve, reject) => {
      ffmpeg.ffprobe(sourcePath, (err, metadata) => {
        if (err) {
          console.error("FFProbe error:", err);
          return reject(err);
        }
        const durationSec = metadata.format.duration || 0;
        resolve(Math.floor(durationSec * 1000));
      });
    });

    const project = await prisma.project.create({
      data: { title, sourcePath, durationMs, status: "DRAFT" }
    });
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getProjects', async () => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, projects };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getProject', async (_, id) => {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new Error("Project not found");
    return { success: true, project };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:getClipHistory', async () => {
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
    return { success: true, clips: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
