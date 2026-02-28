const { ipcMain, app } = require('electron');
const path = require('path');
const fs = require('fs');

const isDev = !app.isPackaged;
const envPath = isDev
  ? path.join(__dirname, '../../.env')
  : path.join(process.resourcesPath, '.env');

ipcMain.handle('env:setDatabaseUrl', async (_, url) => {
  try {
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
    }
    
    const regex = /^DATABASE_URL=.*$/m;
    if (regex.test(content)) {
      content = content.replace(regex, `DATABASE_URL="${url}"`);
    } else {
      content += `\nDATABASE_URL="${url}"\n`;
    }
    
    fs.writeFileSync(envPath, content.trim() + '\n', 'utf8');
    process.env.DATABASE_URL = url;
    
    return { success: true };
  } catch (error) {
    console.error("[ENV] Failed to update DATABASE_URL", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('env:getDatabaseUrl', async () => {
  return { success: true, value: process.env.DATABASE_URL || "" };
});
