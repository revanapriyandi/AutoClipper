import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceIcon = process.argv[2];
const rootDir = path.join(__dirname, '..');
const buildDir = path.join(rootDir, 'build');
const publicDir = path.join(rootDir, 'public');

if (!sourceIcon || !fs.existsSync(sourceIcon)) {
  console.error("Please provide a valid path to the source PNG image.");
  process.exit(1);
}

if (!fs.existsSync(buildDir)) fs.mkdirSync(buildDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

async function generateIcons() {
  try {
    // 1. Copy basis PNG file (Linux + general Apple/Web Icon base)
    fs.copyFileSync(sourceIcon, path.join(buildDir, 'icon.png'));
    fs.copyFileSync(sourceIcon, path.join(publicDir, 'icon.png'));

    // 2. We use Jimp to manipulate image data to create an array-based simple ICO if needed
    // However, simplest way without native system tools is writing the PNG bitstream to an ICO header wrapper
    // A quick hack for single-frame .ico from .png:
    const pngBuffer = fs.readFileSync(sourceIcon);
    const icoBuffer = wrapPngInIco(pngBuffer);

    fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoBuffer);
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    console.log("✅ Successfully generated standard Electron Icons (.png, .ico) and Next.js /public assets via ESM!");
  } catch (err) {
    console.error("❌ Failed to generate icons:", err);
  }
}

function wrapPngInIco(pngBuffer) {
  // Read width/height from standard PNG IHDR
  const w = pngBuffer.readUInt32BE(16);
  const h = pngBuffer.readUInt32BE(20);
  const width = w > 255 ? 0 : w; 
  const height = h > 255 ? 0 : h;

  // ICO Header (6 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type = ICO
  header.writeUInt16LE(1, 4); // Count = 1 image

  // ICO Directory (16 bytes per image)
  const dir = Buffer.alloc(16);
  dir.writeUInt8(width, 0); // width
  dir.writeUInt8(height, 1); // height
  dir.writeUInt8(0, 2); // color palette
  dir.writeUInt8(0, 3); // reserved
  dir.writeUInt16LE(1, 4); // color planes
  dir.writeUInt16LE(32, 6); // bits per pixel (png 32-bit usually)
  dir.writeUInt32LE(pngBuffer.length, 8); // size of image bytes
  dir.writeUInt32LE(header.length + 16, 12); // offset of image data

  return Buffer.concat([header, dir, pngBuffer]);
}

generateIcons();
