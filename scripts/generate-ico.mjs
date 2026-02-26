/**
 * scripts/generate-ico.js
 * Generates a valid 256x256 ICO file from build/icon.png
 * Works with plain Node.js — no extra dependencies needed.
 * Uses the PNG-in-ICO technique (supported since Windows Vista).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const sourcePng = path.join(rootDir, 'build', 'icon.png');
const outputIco = path.join(rootDir, 'build', 'icon.ico');
const faviconIco = path.join(rootDir, 'public', 'favicon.ico');

// --- Try to use sharp if available (best quality), otherwise use Jimp, otherwise raw PNG wrap ---
async function run() {
  let png256;

  // Attempt 1: sharp
  try {
    const sharp = await import('sharp');
    png256 = await sharp.default(sourcePng).resize(256, 256).png().toBuffer();
    console.log('🎨 Resized with sharp');
  } catch {
    // Attempt 2: Read and use Jimp
    try {
      const Jimp = (await import('jimp')).default;
      const img = await Jimp.read(sourcePng);
      img.resize(256, 256);
      png256 = await img.getBufferAsync('image/png');
      console.log('🎨 Resized with Jimp');
    } catch {
      // Fallback: Use the original PNG declared as 256x256 in ICO header
      // If the source is already 256x256 or larger, this works fine.
      console.warn('⚠️  No image library found. Using source PNG directly as 256x256 ICO.');
      png256 = fs.readFileSync(sourcePng);
    }
  }

  const icoBuffer = makeSingleIco(png256);
  fs.writeFileSync(outputIco, icoBuffer);
  fs.writeFileSync(faviconIco, icoBuffer);
  console.log(`✅ ico written (${icoBuffer.length} bytes) → ${outputIco}`);
}

/**
 * Wrap a 256x256 PNG into an ICO container.
 * Width/height bytes = 0 in ICO spec means 256.
 */
function makeSingleIco(pngBuf) {
  // 6-byte ICO header
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: ICO
  header.writeUInt16LE(1, 4); // 1 image

  // 16-byte directory entry
  const dir = Buffer.alloc(16);
  dir.writeUInt8(0, 0);   // width 0 = 256
  dir.writeUInt8(0, 1);   // height 0 = 256
  dir.writeUInt8(0, 2);   // colour palette
  dir.writeUInt8(0, 3);   // reserved
  dir.writeUInt16LE(1, 4);  // colour planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32LE(pngBuf.length, 8);       // image byte size
  dir.writeUInt32LE(6 + 16, 12);             // offset to image data

  return Buffer.concat([header, dir, pngBuf]);
}

run().catch(e => { console.error(e); process.exit(1); });
