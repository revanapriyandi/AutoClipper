/**
 * electron/handlers/dubbing.js (Phase 5 — Full Dubbing Pipeline)
 *
 * Full ElevenLabs TTS integration:
 * - dubbing:setEnabled / dubbing:getEnabled  — feature toggle
 * - dubbing:getVoices                        — fetch voice list from ElevenLabs
 * - dubbing:translate                        — translate text via Gemini/OpenAI
 * - dubbing:synthesize                       — ElevenLabs TTS → audio MP3
 * - dubbing:mergeAudio                       — FFmpeg: replace video audio track
 */

const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const keytar = require('keytar');
const ffmpeg = require('fluent-ffmpeg');
const { getDir } = require('../paths');

const SERVICE_NAME = 'AutoClipperApp';
const ELEVENLABS_API = 'https://api.elevenlabs.io/v1';

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

let dubbingEnabled = false;

async function isDubbingEnabled() {
  const val = await keytar.getPassword(SERVICE_NAME, 'dubbing_enabled');
  dubbingEnabled = val === 'true';
  return dubbingEnabled;
}

// ── Feature Toggle ────────────────────────────────────────────────────────────

ipcMain.handle('dubbing:setEnabled', async (_, enabled) => {
  await keytar.setPassword(SERVICE_NAME, 'dubbing_enabled', String(enabled));
  dubbingEnabled = enabled;
  return { success: true, enabled };
});

ipcMain.handle('dubbing:getEnabled', async () => {
  const enabled = await isDubbingEnabled();
  return { success: true, enabled };
});

// ── Get Available Voices ──────────────────────────────────────────────────────

ipcMain.handle('dubbing:getVoices', async () => {
  try {
    const apiKey = await getSetting('elevenlabs_api_key');
    if (!apiKey) return { success: false, error: 'ElevenLabs API key not configured.' };

    const res = await fetch(`${ELEVENLABS_API}/voices`, {
      headers: { 'xi-api-key': apiKey },
    });

    if (!res.ok) throw new Error(`ElevenLabs API error: ${res.status}`);
    const data = await res.json();

    const voices = (data.voices || []).map(v => ({
      id: v.voice_id,
      name: v.name,
      category: v.category,
      description: v.description,
      previewUrl: v.preview_url,
    }));

    return { success: true, voices };
  } catch (e) {
    console.error('[Dubbing] getVoices error:', e.message);
    return { success: false, error: e.message };
  }
});

// ── Text Translation ──────────────────────────────────────────────────────────

ipcMain.handle('dubbing:translate', async (_, { text, targetLanguage }) => {
  try {
    if (!text) throw new Error('text is required');
    if (!targetLanguage) throw new Error('targetLanguage is required');

    const prompt = `Translate the following video transcript to ${targetLanguage}. Preserve natural speech rhythm and intonation. Return ONLY the translated text, no extra commentary:\n\n${text}`;

    // Try Gemini first
    const geminiKey = await getSetting('gemini_api_key');
    if (geminiKey) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const translated = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (translated) return { success: true, translated, provider: 'gemini' };
      }
    }

    // Fallback: OpenAI
    const openaiKey = await getSetting('openai_key');
    if (openaiKey) {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const translated = data.choices?.[0]?.message?.content;
        if (translated) return { success: true, translated, provider: 'openai' };
      }
    }

    throw new Error('No AI provider configured for translation (need Gemini or OpenAI key).');
  } catch (e) {
    console.error('[Dubbing] translate error:', e.message);
    return { success: false, error: e.message };
  }
});

// ── TTS Synthesis via ElevenLabs ─────────────────────────────────────────────

async function synthesizeAudio(text, voiceId, outputPath) {
  if (!text) throw new Error('text is required');

  const apiKey = await getSetting('elevenlabs_api_key');
  if (!apiKey) throw new Error('ElevenLabs API key not configured. Add it in Settings.');

  const selectedVoiceId = voiceId || '21m00Tcm4TlvDq8ikWAM'; // Default: Rachel

  const res = await fetch(`${ELEVENLABS_API}/text-to-speech/${selectedVoiceId}`, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_multilingual_v2',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`ElevenLabs TTS error ${res.status}: ${errText.slice(0, 200)}`);
  }

  const audioBuffer = Buffer.from(await res.arrayBuffer());

  let finalOutputPath = outputPath;
  if (!finalOutputPath) {
    const clipsDir = await getDir('clips');
    finalOutputPath = path.join(clipsDir, `dubbing_${Date.now()}.mp3`);
  }

  const dir = path.dirname(finalOutputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(finalOutputPath, audioBuffer);

  return finalOutputPath;
}

ipcMain.handle('dubbing:synthesize', async (_, { text, voiceId, outputPath }) => {
  try {
    const finalPath = await synthesizeAudio(text, voiceId, outputPath);
    return { success: true, audioPath: finalPath };
  } catch (e) {
    console.error('[Dubbing] synthesize error:', e.message);
    return { success: false, error: e.message };
  }
});

// ── Merge Dubbed Audio with Video ─────────────────────────────────────────────

ipcMain.handle('dubbing:mergeAudio', async (_, { videoPath, audioPath, outputPath, keepOriginalAudio = false }) => {
  try {
    if (!videoPath) throw new Error('videoPath is required');
    if (!audioPath) throw new Error('audioPath is required');

    let finalOutputPath = outputPath;
    if (!finalOutputPath) {
      const clipsDir = await getDir('clips');
      finalOutputPath = path.join(clipsDir, `dubbed_${Date.now()}.mp4`);
    }

    const dir = path.dirname(finalOutputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    await new Promise((resolve, reject) => {
      const cmd = ffmpeg(videoPath).input(audioPath);

      if (keepOriginalAudio) {
        // Mix original + dubbed audio
        cmd.complexFilter([
          '[0:a]volume=0.2[orig]',
          '[1:a]volume=1.0[dubbed]',
          '[orig][dubbed]amerge=inputs=2[aout]',
        ])
          .outputOptions(['-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-shortest'])
          .save(finalOutputPath)
          .on('end', resolve)
          .on('error', reject);
      } else {
        // Replace audio completely
        cmd.outputOptions([
          '-map', '0:v',
          '-map', '1:a',
          '-c:v', 'copy',
          '-shortest',
        ])
          .save(finalOutputPath)
          .on('end', resolve)
          .on('error', (err) => reject(new Error(`FFmpeg merge error: ${err.message}`)));
      }
    });

    return { success: true, outputPath: finalOutputPath };
  } catch (e) {
    console.error('[Dubbing] mergeAudio error:', e.message);
    return { success: false, error: e.message };
  }
});

// Preload enabled state
isDubbingEnabled();

module.exports = { isDubbingEnabled, dubbingEnabled, synthesizeAudio };
