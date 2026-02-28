export interface TextLayer {
  id: string;
  text: string;
  startMs: number;
  endMs: number;
  x: number; // 0-100%
  y: number; // 0-100%
  fontSize: number;
  color: string;
  bgColor: string;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  visible: boolean;
  animation: 'none' | 'fade' | 'slide_up' | 'typewriter';
}

export interface AudioTrack {
  path: string;
  volume: number; // 0-1
  fadeIn: boolean;
  fadeOut: boolean;
}

export interface BRollLayer {
  id: string;
  path: string;
  startMs: number;
  endMs: number;
  volume: number; // e.g. 0 to mute b-roll audio
  transition: 'none' | 'fade';
}

export interface StickerLayer {
  id: string;
  src: string;
  x: number; // 0-100%
  y: number; // 0-100%
  scale: number; // 1.0 = 100%
  startMs: number;
  endMs: number;
}

export interface ColorFilter {
  brightness: number;  // -1 to 1
  contrast: number;    // -1 to 1
  saturation: number;  // -1 to 1
  hue: number;         // -180 to 180
  vignette: number;    // 0 to 1
  temperature: number; // -100 to 100 (warm/cool)
}

export interface KeyframeData {
  id: string;
  startMs: number;
  endMs: number;
  zoomBase: number; // e.g. 1.0
  zoomTarget: number; // e.g. 1.5
  panX: number; // 0 to 100% of visible area
  panY: number; // 0 to 100% of visible area
}

export interface EditState {
  startMs: number;
  endMs: number;
  speed: number;
  flipH: boolean;
  flipV: boolean;
  rotate: number;
  format: '9:16' | '16:9' | '1:1' | '4:5';
  stickers?: StickerLayer[];
  textLayers: TextLayer[];
  brollLayers: BRollLayer[];
  audioTrack: AudioTrack | null;
  colorFilter: ColorFilter;
  videoVolume: number;
  muteOriginal: boolean;
  transition: 'none' | 'fade' | 'wipe' | 'zoom';
  sfxEnabled: boolean;
  enhanceAudio: boolean;
  audioDucking: boolean;
  keyframes: KeyframeData[];
}

export const DEFAULT_COLOR: ColorFilter = {
  brightness: 0, contrast: 0, saturation: 0, hue: 0, vignette: 0, temperature: 0,
};

export const FONTS = ['Arial', 'Roboto', 'Impact', 'Georgia', 'Courier New', 'Pacifico', 'Oswald'];

export const PRESETS = [
  { name: 'Original',  color: DEFAULT_COLOR },
  { name: 'Vivid',     color: { ...DEFAULT_COLOR, saturation: 0.4, contrast: 0.2 } },
  { name: 'Matte',     color: { ...DEFAULT_COLOR, brightness: -0.05, contrast: -0.15, saturation: -0.1 } },
  { name: 'Cold',      color: { ...DEFAULT_COLOR, temperature: -60, saturation: 0.1 } },
  { name: 'Warm',      color: { ...DEFAULT_COLOR, temperature: 60, brightness: 0.05 } },
  { name: 'B&W',       color: { ...DEFAULT_COLOR, saturation: -1 } },
  { name: 'Cinematic', color: { ...DEFAULT_COLOR, contrast: 0.25, saturation: -0.1, vignette: 0.4, temperature: -20 } },
  { name: 'Drama',     color: { ...DEFAULT_COLOR, contrast: 0.4, brightness: -0.1, saturation: 0.2, vignette: 0.6 } },
];

export function msToTime(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
}

export function generateId() { return Math.random().toString(36).slice(2, 9); }
