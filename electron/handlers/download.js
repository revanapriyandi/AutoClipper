/**
 * electron/handlers/download.js
 * 
 * IPC Handlers for downloading videos from URLs via youtube-dl-exec
 */

const { ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');
const ytdl = require('youtube-dl-exec');
const ffmpegStatic = require('ffmpeg-static');

// Normalize for production ASAR unpacked path
const ffmpegPath = ffmpegStatic.replace('app.asar', 'app.asar.unpacked');

ipcMain.handle('app:download-url', async (event, url) => {
  try {
    if (!url) throw new Error('URL is required');

    // Create a temporary file path
    const timestamp = Date.now();
    const tempDir = os.tmpdir();
    // Use .mp4 as the default target format
    const targetPath = path.join(tempDir, `autoclipper_dl_${timestamp}.mp4`);

    console.log(`[Download] Starting download of ${url} to ${targetPath}`);
    
    // We launch the youtube-dl process
    const subprocess = ytdl.exec(url, {
      output: targetPath,
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best', // Prefer mp4
      mergeOutputFormat: 'mp4',
      ffmpegLocation: ffmpegPath,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: [
        'referer:youtube.com',
        'user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    });

    let stderrBuffer = '';

    // Capture stdout to report progress
    subprocess.stdout.on('data', (data) => {
      const text = data.toString();
      // Example ytdl output: [download]  45.0% of 10.00MiB at  1.50MiB/s ETA 00:03
      const percentMatch = text.match(/\[download\]\s+([\d\.]+)%/);
      if (percentMatch && percentMatch[1]) {
        const percent = parseFloat(percentMatch[1]);
        // Send progress event to frontend
        event.sender.send('download:progress', percent);
      }
    });

    subprocess.stderr.on('data', (data) => {
      const text = data.toString();
      stderrBuffer += text;
      console.warn(`[Download Warn] ${text}`);
    });

    // Wait for the download to finish
    await new Promise((resolve, reject) => {
      subprocess.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`ytdl exited with code ${code}`));
      });
      subprocess.on('error', reject);
    });

    // Verify file exists
    if (!fs.existsSync(targetPath)) {
      throw new Error(stderrBuffer || 'Fallback failed: File was not created at target path.');
    }

    // Always send 100% when finished
    event.sender.send('download:progress', 100);
    
    console.log(`[Download] Finished downloading to ${targetPath}`);
    return { success: true, filePath: targetPath };

  } catch (err) {
    console.error(`[Download Error] Failed to download URL: ${err.message}`);
    return { success: false, error: err.message };
  }
});
