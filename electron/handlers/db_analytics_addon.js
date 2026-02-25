const { ipcMain } = require('electron');
const prisma = require('../prisma');

ipcMain.handle('db:getAnalytics', async () => {
  try {
    const analytics = await prisma.analytics.findMany({
      include: {
        clip: {
          select: {
            projectId: true,
            caption: true,
            project: { select: { title: true } }
          }
        }
      },
      orderBy: { updatedAt: "desc" }
    });
    return { success: true, analytics };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('db:updateAnalytics', async (_, data) => {
  try {
    const stat = await prisma.analytics.upsert({
      where: { clipId_platform: { clipId: data.clipId, platform: data.platform } },
      update: {
        views: data.views,
        likes: data.likes,
        comments: data.comments,
        shares: data.shares
      },
      create: {
        clipId: data.clipId,
        platform: data.platform,
        views: data.views || 0,
        likes: data.likes || 0,
        comments: data.comments || 0,
        shares: data.shares || 0
      }
    });
    return { success: true, analytics: stat };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
