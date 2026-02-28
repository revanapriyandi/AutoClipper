// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpeg = require('fluent-ffmpeg');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffmpegStatic = require('ffmpeg-static');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ffprobeStatic = require('ffprobe-static');

ffmpeg.setFfmpegPath(ffmpegStatic.replace('app.asar', 'app.asar.unpacked'));
ffmpeg.setFfprobePath(ffprobeStatic.path.replace('app.asar', 'app.asar.unpacked'));

ffmpeg.getAvailableEncoders((err, encoders) => {
    if (err) {
        console.error('Error getting encoders:', err);
        return;
    }
    const h264Encoders = Object.keys(encoders).filter(k => k.includes('h264'));
    console.log('Available H264 encoders:', h264Encoders);
    
    // Check specific ones
    const prioritized = ['h264_nvenc', 'h264_qsv', 'h264_amf', 'h264_videotoolbox'];
    let best = 'libx264';
    for (const enc of prioritized) {
        if (encoders[enc]) {
            best = enc;
            break;
        }
    }
    console.log('Best encoder:', best);
});
