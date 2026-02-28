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

function getBestH264Encoder() {
    // ffmpeg.getAvailableEncoders only checks the binary's compiled features, 
    // not actual hardware support. This causes crash 4294967295 on non-NVIDIA GPUs.
    // Defaulting to libx264 for maximum compatibility across all user machines.
    return Promise.resolve('libx264');
}

// ── Generate Waveform image data ─────────────────────────────────────────────
const fs = require('fs');
const os = require('os');
const path = require('path');

ipcMain.handle('ffmpeg:getWaveform', async (_, { sourcePath, width = 800, height = 150 }) => {
    try {
        return await new Promise((resolve, reject) => {
            if (!fs.existsSync(sourcePath)) return reject(new Error('Source file not found'));
            
            const outPath = path.join(os.tmpdir(), `waveform_${Date.now()}.png`);
            ffmpeg(sourcePath)
                .complexFilter([
                    `[0:a]showwavespic=s=${width}x${height}:colors=white[out]`
                ])
                .outputOptions(['-map [out]', '-frames:v 1'])
                .save(outPath)
                .on('end', () => {
                    try {
                        if (!fs.existsSync(outPath)) throw new Error('Waveform generation failed (no output file)');
                        const data = fs.readFileSync(outPath).toString('base64');
                        fs.unlinkSync(outPath);
                        resolve({ success: true, dataUrl: `data:image/png;base64,${data}` });
                    } catch (e) {
                        reject(e);
                    }
                })
                .on('error', (err) => reject(new Error(`FFmpeg error: ${err.message}`)));
        });
    } catch (e) {
        console.error('[Waveform]', e.message);
        return { success: false, error: e.message };
    }
});

module.exports = {
    ffmpeg,
    getBestH264Encoder
};
