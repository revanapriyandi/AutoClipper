const { ipcMain } = require('electron');
const prisma = require('../prisma');

ipcMain.handle('db:getScheduledJobs', async () => {
  try {
    const jobs = await prisma.job.findMany({
      where: {
        scheduledAt: { not: null }
      },
      orderBy: { scheduledAt: "asc" }
    });
    return { success: true, jobs };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
