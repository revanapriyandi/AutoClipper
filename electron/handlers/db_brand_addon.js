const { ipcMain } = require('electron');
const prisma = require('../prisma');
const path = require('path');
const fs = require('fs');
const { getDir } = require('../paths');

// --- Workspaces ---

ipcMain.handle('db:getWorkspaces', async () => {
  try {
    let workspaces = await prisma.workspace.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        kits: true
      }
    });

    // Auto-create default
    if (workspaces.length === 0) {
      const defaultWs = await prisma.workspace.create({
        data: { name: "Default Workspace" },
        include: { kits: true }
      });
      workspaces = [defaultWs];
    }
    
    return { success: true, workspaces };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// --- Brand Kits ---

ipcMain.handle('db:createBrandKit', async (_, { workspaceId, name, fontFamily, primaryColor }) => {
  try {
    if (!workspaceId || !name) throw new Error("Missing parameters");
    const kit = await prisma.brandKit.create({
      data: { workspaceId, name, fontFamily, primaryColor }
    });
    return { success: true, kit };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:updateBrandKit', async (_, { id, name, fontFamily, primaryColor }) => {
  try {
    const kit = await prisma.brandKit.update({
      where: { id },
      data: { name, fontFamily, primaryColor }
    });
    return { success: true, kit };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db:deleteBrandKit', async (_, id) => {
  try {
    await prisma.brandKit.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Used to save Watermark/Logo files into a persistent custom directory
ipcMain.handle('brand:uploadAsset', async (_, { kitId, type, sourcePath }) => {
  try {
    const assetsDir = await getDir('assets');
    const brandDir = path.join(assetsDir, 'brand');
    if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

    const ext = path.extname(sourcePath);
    const destPath = path.join(brandDir, `${kitId}_${type}_${Date.now()}${ext}`);
    
    fs.copyFileSync(sourcePath, destPath);

    const updateData = {};
    if (type === 'watermark') updateData.watermarkPath = destPath;
    else if (type === 'logo') updateData.logoPath = destPath;

    const kit = await prisma.brandKit.update({
      where: { id: kitId },
      data: updateData
    });

    return { success: true, kit };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
