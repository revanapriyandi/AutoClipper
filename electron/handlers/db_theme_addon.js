const { ipcMain } = require('electron');
const prisma = require('../prisma');

ipcMain.handle('db:getThemePresets', async () => {
  try {
    const presets = await prisma.themePreset.findMany({ orderBy: { createdAt: "desc" }});
    return { success: true, presets };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('db:createThemePreset', async (_, data) => {
  try {
    const preset = await prisma.themePreset.create({
      data: {
        name: data.name,
        fontFamily: data.fontFamily,
        primaryColor: data.primaryColor,
        outlineColor: data.outlineColor,
        alignment: data.alignment,
        marginV: data.marginV
      }
    });
    return { success: true, preset };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

ipcMain.handle('db:deleteThemePreset', async (_, id) => {
  try {
    await prisma.themePreset.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
