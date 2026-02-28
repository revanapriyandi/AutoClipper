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
    if (!id) throw new Error("Project ID is undefined or missing");
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

ipcMain.handle('db:deleteProject', async (_, id) => {
  try {
    if (!id) throw new Error("Project ID is required");
    await prisma.project.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: error.message };
  }
});

// Save scored candidates for a project (replaces all existing for that project)
ipcMain.handle('db:saveProjectClips', async (_, { projectId, candidates, brollKeywordMap }) => {
  try {
    if (!projectId) throw new Error("projectId required");
    // Delete existing generated clips for this project before re-saving
    await prisma.clip.deleteMany({ where: { projectId } });
    // Bulk insert new candidates
    for (const [i, c] of candidates.entries()) {
      await prisma.clip.create({
        data: {
          projectId,
          startMs: c.startMs,
          endMs: c.endMs,
          scores: JSON.stringify({
            totalScore: c.totalScore,
            transcriptText: c.transcriptText,
            chunks: c.chunks,
            brollKeywords: brollKeywordMap?.[i] ?? [],
            // preserve all scoring details
            ...c,
          }),
          caption: c.transcriptText?.slice(0, 200) ?? null,
          status: 'PENDING',
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to save project clips:", error);
    return { success: false, error: error.message };
  }
});

// Load saved clips for a project
ipcMain.handle('db:getProjectClips', async (_, projectId) => {
  try {
    if (!projectId) throw new Error("projectId required");
    const clips = await prisma.clip.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
      include: { assets: { select: { kind: true, storagePath: true } } },
    });
    // Parse scores JSON back into full ScoredCandidate objects
    const candidates = clips.map(c => {
      const parsed = JSON.parse(c.scores || '{}');
      return {
        ...parsed,
        _dbId: c.id,
        _dbStatus: c.status,
        // Ensure required fields
        startMs: c.startMs,
        endMs: c.endMs,
        outputPath: c.assets?.find(a => a.kind === 'video')?.storagePath ?? null,
      };
    });
    return { success: true, candidates };
  } catch (error) {
    console.error("Failed to load project clips:", error);
    return { success: false, error: error.message };
  }
});

// ── logEvent helper (exported for use by other handlers) ────────────────────
async function logEvent(level, category, message, details) {
  try {
    await prisma.systemLog.create({
      data: { level, category, message, details: details ? JSON.stringify(details) : null },
    });
  } catch (e) {
    // Never crash the caller due to logging failure
    console.error('[Log] Failed to write log:', e.message);
  }
}
module.exports = { logEvent };

// Update subtitle chunks for a saved clip
ipcMain.handle('db:updateClipChunks', async (_, { clipId, chunks, transcriptText }) => {
  try {
    if (!clipId) throw new Error('clipId required');
    const clip = await prisma.clip.findUnique({ where: { id: clipId } });
    if (!clip) throw new Error('Clip not found');
    const scores = JSON.parse(clip.scores || '{}');
    scores.chunks = chunks;
    if (transcriptText) scores.transcriptText = transcriptText;
    await prisma.clip.update({
      where: { id: clipId },
      data: {
        scores: JSON.stringify(scores),
        caption: transcriptText?.slice(0, 200) ?? clip.caption,
        updatedAt: new Date(),
      },
    });
    await logEvent('info', 'DB', `Clip chunks updated`, { clipId });
    return { success: true };
  } catch (error) {
    console.error('Failed to update clip chunks:', error);
    return { success: false, error: error.message };
  }
});

// Add a log event from the renderer
ipcMain.handle('db:addLog', async (_, { level, category, message, details }) => {
  await logEvent(level || 'info', category || 'App', message || '', details);
  return { success: true };
});

// Get system logs
ipcMain.handle('db:getLogs', async (_, { limit = 200, level, category } = {}) => {
  try {
    const where = {};
    if (level) where.level = level;
    if (category) where.category = category;
    const logs = await prisma.systemLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return { success: true, logs };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

