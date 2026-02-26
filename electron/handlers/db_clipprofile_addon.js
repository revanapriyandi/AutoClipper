/**
 * electron/handlers/db_clipprofile_addon.js
 * ClipProfile CRUD handlers for F16 (Clip Profiles page)
 */
const { ipcMain } = require('electron');
const prisma = require('../prisma');

// Get all clip profiles
ipcMain.handle('db:getClipProfiles', async () => {
  try {
    const profiles = await prisma.clipProfile.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, profiles };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Create clip profile
ipcMain.handle('db:createClipProfile', async (_, { name, configJson }) => {
  try {
    if (!name) throw new Error('Name is required');
    const profile = await prisma.clipProfile.create({
      data: { name, configJson }
    });
    return { success: true, profile };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Delete clip profile
ipcMain.handle('db:deleteClipProfile', async (_, id) => {
  try {
    await prisma.clipProfile.delete({ where: { id } });
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

// Update project tags
ipcMain.handle('db:updateProjectTags', async (_, { id, tags }) => {
  try {
    const project = await prisma.project.update({
      where: { id },
      data: { tags }
    });
    return { success: true, project };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
