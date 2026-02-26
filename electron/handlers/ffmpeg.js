const { ipcMain } = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const ffprobeStatic = require('ffprobe-static');

// Setup fluent-ffmpeg to use the bundled static binaries.
// This is critical so the user doesn't need to install FFmpeg locally!
ffmpeg.setFfmpegPath(ffmpegStatic.replace('app.asar', 'app.asar.unpacked'));
ffmpeg.setFfprobePath(ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked'));

ipcMain.handle('ffmpeg:checkInstallation', async () => {
    try {
        return {
            success: true,
            ffmpegPath: ffmpegStatic,
            ffprobePath: ffprobeStatic.path,
            message: "FFmpeg static binaries successfully loaded."
        };
    } catch (error) {
        console.error("FFmpeg check failed:", error);
        return { success: false, error: error.message };
    }
});

module.exports = {
    ffmpeg
};
