/**
 * electron/handlers/ai.js
 * 
 * IPC Handlers for AI with RETRY + FALLBACK:
 * - withRetry()    — exponential backoff + jitter for transient errors
 * - ai:transcribe  — ASR with auto-fallback ASR provider chain
 * - ai:score       — LLM with per-provider retry + provider fallback chain
 * - ai:getConfig   — Return available providers & models from config
 */

const { ipcMain, app } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { logEvent } = require('./db');
const keytar = require('keytar');
const ffmpeg = require('fluent-ffmpeg');
const config = require('../config');

const SERVICE_NAME = 'AutoClipperApp';

// ============================================================
// RETRY UTILITY — exponential backoff with jitter
// ============================================================

/** HTTP status codes that are retryable (transient) */
const RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Determines if an error is transient (worth retrying).
 * Permanent errors (e.g. wrong API key 401, bad request 400) are NOT retried.
 */
function isRetryable(error) {
  if (!error) return false;
  const msg = error.message || '';
  // Rate-limit or server-side errors from status codes
  if (RETRYABLE_STATUS.has(error.statusCode)) return true;
  // Network-level failures
  if (msg.includes('ECONNRESET') || msg.includes('ETIMEDOUT') ||
      msg.includes('ENOTFOUND') || msg.includes('fetch failed') ||
      msg.includes('network') || msg.includes('timeout')) return true;
  // Rate limit phrases from various providers
  if (msg.includes('rate limit') || msg.includes('rate_limit') ||
      msg.includes('429') || msg.includes('too many requests')) return true;
  // Transient server errors
  if (msg.includes('500') || msg.includes('502') ||
      msg.includes('503') || msg.includes('504')) return true;
  return false;
}

/**
 * Retry wrapper with exponential backoff + full jitter.
 * @param {() => Promise<T>} fn - Async function to retry.
 * @param {object} opts
 * @param {number} opts.maxAttempts - Max attempts (default 3)
 * @param {number} opts.baseDelayMs - Base delay in ms (default 800)
 * @param {number} opts.maxDelayMs  - Max delay cap (default 20000)
 * @param {string} opts.label       - Label for log output
 * @returns {Promise<T>}
 */
async function withRetry(fn, { maxAttempts = 3, baseDelayMs = 800, maxDelayMs = 20000, label = 'op' } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const retryable = isRetryable(err);

      if (!retryable || attempt === maxAttempts) {
        console.warn(`[Retry][${label}] Attempt ${attempt}/${maxAttempts} FAILED (${retryable ? 'giving up' : 'non-retryable'}): ${err.message}`);
        throw err;
      }

      // Full jitter: random between 0 and min(cap, base * 2^attempt)
      const cap = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt));
      const delay = Math.floor(Math.random() * cap);
      console.warn(`[Retry][${label}] Attempt ${attempt}/${maxAttempts} failed, retrying in ${delay}ms... (${err.message})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastError;
}

// ============================================================
// HELPERS
// ============================================================

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

async function callOpenAICompat(apiUrl, apiKey, model, systemPrompt, userPrompt, extraHeaders = {}) {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, ...extraHeaders },
    body: JSON.stringify({
      model,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const text = await response.text();
    const err = new Error(`API error ${response.status}: ${text.slice(0, 200)}`);
    err.statusCode = response.status;
    throw err;
  }
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

/**
 * LLM Provider fallback chain order — ordered by speed/cost.
 * Only tries providers that have API keys configured.
 */
const LLM_FALLBACK_CHAIN = [
  'cerebras',   // fastest & free
  'groq',       // fast & free tier
  'gemini',     // free tier
  'deepseek',   // ultra cheap
  'openai',
  'xai',
  'mistral',
  'claude',
  'cohere',
  'openrouter', // multi-model fallback
  'local',
];

/**
 * Build deduped fallback chain: preferred first, then rest
 */
function buildLLMChain(preferredProvider) {
  return [preferredProvider, ...LLM_FALLBACK_CHAIN.filter(p => p !== preferredProvider)];
}

function getSystemLang() {
  try {
    const locale = app.getLocale() || 'en';
    return locale.split('-')[0].toLowerCase();
  } catch (e) {
    return 'en';
  }
}

// ============================================================
// IPC: ai:getConfig
// ============================================================
ipcMain.handle('ai:getConfig', async () => ({
  llmProviders: config.LLM_PROVIDERS,
  llmModels:    config.LLM_MODELS,
  asrProviders: config.ASR_PROVIDERS,
  asrModels:    config.ASR_MODELS,
}));

// ============================================================
// IPC: ai:transcribe  — with retry + ASR provider fallback
// ============================================================

ipcMain.handle('ai:transcribe', async (_, sourcePath, userDeepgramKey, projectId) => {
  try {
    const asrProvider = await getSetting('asrProvider', 'deepgram');
    const asrModel = await getSetting('asrModel', 'nova-2');

    let audioBuffer;

    const ext = path.extname(sourcePath).toLowerCase();
    const isAudioOnly = ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'].includes(ext);

    await logEvent('info', 'ASR', 'Started transcription', { sourcePath, asrProvider });
    console.log(`[ASR] Source: ${sourcePath} (ext: ${ext || 'none'}, isAudioOnly: ${isAudioOnly})`);

    if (isAudioOnly) {
      // Already an audio file — read directly
      audioBuffer = fs.readFileSync(sourcePath);
      console.log(`[ASR] Read audio file directly, size: ${audioBuffer.length} bytes`);
    } else {
      // It's a video file. First, check for embedded subtitles
      let hasEmbeddedSubs = false;
      try {
        hasEmbeddedSubs = await new Promise((resolve) => {
          ffmpeg.ffprobe(sourcePath, (err, metadata) => {
            if (err) return resolve(false);
            const subStream = metadata.streams.find(s => s.codec_type === 'subtitle');
            resolve(!!subStream);
          });
        });
      } catch (e) {
        console.warn('[ASR] FFprobe embed sub check failed:', e.message);
      }

      if (hasEmbeddedSubs) {
        console.log(`[ASR] Found embedded subtitles! Extracting...`);
        const srtPath = path.join(os.tmpdir(), `autoclipper_subs_${Date.now()}.srt`);
        try {
          await new Promise((resolve, reject) => {
            ffmpeg(sourcePath)
              .outputOptions(['-map 0:s:0']) // get first subtitle stream
              .save(srtPath)
              .on('end', resolve)
              .on('error', reject);
          });
          const srtText = fs.readFileSync(srtPath, 'utf8');
          try { fs.unlinkSync(srtPath); } catch (e) {}
          
          // Parse SRT and interpolate word timings
          const blocks = srtText.trim().split(/\n\s*\n/);
          const words = [];
          for (const block of blocks) {
            const lines = block.split('\n');
            if (lines.length >= 3) {
              const timeStr = lines[1];
              const text = lines.slice(2).join(' ').trim();
              const match = timeStr.match(/(\d+):(\d+):(\d+),(\d+)\s*-->\s*(\d+):(\d+):(\d+),(\d+)/);
              if (match) {
                const startMs = (+match[1] * 3600 + +match[2] * 60 + +match[3]) * 1000 + +match[4];
                const endMs = (+match[5] * 3600 + +match[6] * 60 + +match[7]) * 1000 + +match[8];
                const tokens = text.split(/\s+/).filter(Boolean);
                if (tokens.length > 0) {
                  const durationPerWord = (endMs - startMs) / tokens.length;
                  tokens.forEach((t, i) => {
                    words.push({
                      word: t.replace(/[.,!?]/g, ''),
                      punctuated_word: t,
                      start: (startMs + i * durationPerWord) / 1000,
                      end: (startMs + (i + 1) * durationPerWord) / 1000
                    });
                  });
                }
              }
            }
          }
          if (words.length > 0) {
            const transcript = words.map(w => w.punctuated_word).join(' ');
            await logEvent('info', 'ASR', 'Used embedded subtitles', { sourcePath, wordCount: words.length });
            return {
              success: true,
              results: { channels: [{ alternatives: [{ transcript, words }] }] }
            };
          }
        } catch (e) {
          console.warn('[ASR] Failed to extract/parse embedded subtitles, falling back to ASR', e.message);
        }
      }

      // No usable subs found — extract audio fresh via ffmpeg
      const finalAudioPath = path.join(os.tmpdir(), `autoclipper_audio_${Date.now()}.mp3`);
      console.log(`[ASR] Extracting audio from video to: ${finalAudioPath}`);
      await new Promise((resolve, reject) => {
        ffmpeg(sourcePath)
          .noVideo()
          .audioCodec('libmp3lame')
          .audioFrequency(16000)
          .audioChannels(1)
          .save(finalAudioPath)
          .on('end', () => { console.log(`[ASR] Audio extracted OK`); resolve(); })
          .on('error', (err) => { console.error(`[ASR] ffmpeg error: ${err.message}`); reject(err); });
      });
      audioBuffer = fs.readFileSync(finalAudioPath);
      console.log(`[ASR] Audio buffer size: ${audioBuffer.length} bytes`);
      try { fs.unlinkSync(finalAudioPath); } catch (e) { }
    }

    // Override deepgramKey if passed directly (legacy support)
    if (userDeepgramKey && asrProvider === 'deepgram') {
      await keytar.setPassword(SERVICE_NAME, 'deepgram_key', userDeepgramKey);
    }

    // ASR Fallback Chain: preferred → deepgram → openai_whisper
    // If local_whisper is chosen, we ONLY use local_whisper to avoid surprise API key errors
    const fallbackOrder = asrProvider === 'local_whisper' 
      ? ['local_whisper'] 
      : [asrProvider, 'deepgram', 'openai_whisper'].filter((v, i, a) => a.indexOf(v) === i);
      
    let lastError;
    for (const provider of fallbackOrder) {
      try {
        console.log(`[ASR] Trying provider: ${provider}`);
        const results = await transcribeWithProvider(provider, asrModel, audioBuffer);
        if (provider !== asrProvider) console.log(`[ASR] Fell back to ${provider} from ${asrProvider}`);
        await logEvent('info', 'ASR', `Transcription success`, { provider, model: asrModel });
        return { success: true, results, usedProvider: provider };
      } catch (err) {
        lastError = err;
        console.warn(`[ASR] Provider ${provider} failed: ${err.message}. Trying next...`);
        await logEvent('warn', 'ASR', `Provider failed`, { provider, error: err.message });
      }
    }
    await logEvent('error', 'ASR', `All ASR providers failed`, { error: lastError?.message });
    throw lastError;

  } catch (error) {
    console.error('[AI] Transcription failed:', error.message);
    await logEvent('error', 'ASR', `Transcription failed`, { error: error.message });
    return { success: false, error: error.message };
  }
});

/**
 * ASR Provider fallback order:
 * User's preferred → next available (if key exists) → error
 */
async function transcribeWithProvider(asrProvider, asrModel, audioBuffer) {
  const sysLang = getSystemLang();
  
  if (asrProvider === 'deepgram') {
    const key = await getSetting('deepgram_key');
    if (!key) throw new Error('Deepgram API Key not configured.');
    // detect_language=true is smart, but providing language fallback from sysLang helps Deepgram further
    const url = `${config.DEEPGRAM_API_URL}?model=${asrModel}&smart_format=true&punctuate=true&utterances=true&diarize=true&detect_language=true&language=${sysLang}`;

    return withRetry(async () => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Token ${key}`, 'Content-Type': 'audio/mp3' },
        body: audioBuffer,
      });
      if (!res.ok) { const e = new Error(`Deepgram ${res.status}: ${await res.text()}`); e.statusCode = res.status; throw e; }
      
      const data = await res.json();
      const detected = data.results?.channels?.[0]?.detected_language;
      console.log(`[ASR] Deepgram detected language: ${detected}`);
      // Map speaker into the word results if available
      if (data.results?.channels?.[0]?.alternatives?.[0]) {
        const alt = data.results.channels[0].alternatives[0];
        alt.words = alt.words.map(w => ({ ...w, speaker: w.speaker ?? 0 }));
        console.log(`[ASR] Deepgram returned ${alt.words.length} words. First 5: ${alt.words.slice(0,5).map(w=>w.word).join(', ')}`);
      }
      return data.results;
    }, { maxAttempts: 3, label: 'deepgram' });

  } else if (asrProvider === 'openai_whisper') {
    const key = await getSetting('openai_key');
    if (!key) throw new Error('OpenAI Whisper: no API key.');
    const form = new FormData();
    form.append('file', new Blob([audioBuffer], { type: 'audio/mp3' }), 'audio.mp3');
    form.append('model', asrModel || 'whisper-1');
    form.append('response_format', 'verbose_json');
    form.append('language', sysLang);

    return withRetry(async () => {
      const res = await fetch(config.OPENAI_WHISPER_URL, {
        method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: form,
      });
      if (!res.ok) { const e = new Error(`Whisper ${res.status}`); e.statusCode = res.status; throw e; }
      const data = await res.json();
      const wordList = (data.words || []);
      console.log(`[ASR] Whisper returned ${wordList.length} words. Language: ${data.language || 'unknown'}. First 5: ${wordList.slice(0,5).map(w=>w.word).join(', ')}`);
      return {
        channels: [{ alternatives: [{
          words: wordList.map(w => ({ word: w.word, start: w.start, end: w.end, punctuated_word: w.word || '' })),
          transcript: data.text,
        }] }],
      };
    }, { maxAttempts: 3, label: 'whisper' });

  } else if (asrProvider === 'assemblyai') {
    const key = await getSetting('assemblyai_key');
    if (!key) throw new Error('AssemblyAI: no API key.');
    const uploadRes = await fetch(`${config.ASSEMBLYAI_API_URL}/upload`, {
      method: 'POST', headers: { 'Authorization': key, 'Content-Type': 'audio/mp3' }, body: audioBuffer,
    });
    const { upload_url } = await uploadRes.json();
    const transcriptRes = await fetch(`${config.ASSEMBLYAI_API_URL}/transcript`, {
      method: 'POST', headers: { 'Authorization': key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_url: upload_url, speech_model: asrModel || 'best', speaker_labels: true, word_boost: [], language_code: sysLang }),
    });
    const { id } = await transcriptRes.json();
    let transcript;
    for (let i = 0; i < 60; i++) {
      const r = await fetch(`${config.ASSEMBLYAI_API_URL}/transcript/${id}`, { headers: { 'Authorization': key } });
      transcript = await r.json();
      if (transcript.status === 'completed') break;
      if (transcript.status === 'error') throw new Error('AssemblyAI: ' + transcript.error);
      await new Promise(r => setTimeout(r, 2000));
    }
    return {
      channels: [{ alternatives: [{
        words: (transcript.words || []).map(w => ({ 
          word: w.text, 
          start: w.start / 1000, 
          end: w.end / 1000,
          punctuated_word: w.text || '',
          speaker: w.speaker ? parseInt(w.speaker.replace(/[^0-9]/g, ''), 10) : 0 
        })),
        transcript: transcript.text,
      }] }],
    };
  } else if (asrProvider === 'local_whisper') {
    // 1. Initialize Transformers.js pipeline (it auto-downloads and caches models)
    const { pipeline, env } = await import('@xenova/transformers');
    // Ensure cache goes to user data instead of node_modules to survive app updates
    env.cacheDir = path.join(require('electron').app.getPath('userData'), 'models');
    
    // Send splash status if this takes a while
    global.splashStatus?.('Memuat model AI Lokal (Whisper)...');
    
    // We use whisper-tiny as the default local model because it's fast and small (~150MB)
    const modelName = asrModel && asrModel.startsWith('Xenova/') ? asrModel : 'Xenova/whisper-tiny';
    const transcriber = await pipeline('automatic-speech-recognition', modelName);
    
    // 2. Transcribe the audio buffer. Transformers.js expects Float32Array PCM audio.
    // We need to convert the incoming mp3 buffer to PCM using ffmpeg or AudioContext
    const tmpWavPath = path.join(os.tmpdir(), `autoclipper_local_${Date.now()}.wav`);
    fs.writeFileSync(tmpWavPath.replace('.wav', '.mp3'), audioBuffer);
    
    await new Promise((resolve, reject) => {
      ffmpeg(tmpWavPath.replace('.wav', '.mp3'))
        .toFormat('wav')
        .audioChannels(1)
        .audioFrequency(16000)
        .save(tmpWavPath)
        .on('end', resolve)
        .on('error', reject);
    });
    
    const wavBuffer = fs.readFileSync(tmpWavPath);
    // Parse the WAV file to Float32Array
    const { WaveFile } = require('wavefile');
    const wav = new WaveFile(wavBuffer);
    wav.toBitDepth('32f');
    wav.toSampleRate(16000);
    const audioData = wav.getSamples(false);
    
    // Cleanup temporary wave files
    try { fs.unlinkSync(tmpWavPath); fs.unlinkSync(tmpWavPath.replace('.wav', '.mp3')); } catch (e) {}
    
    global.splashStatus?.('Mentranskrip audio secara lokal...');
    
    return withRetry(async () => {
      const output = await transcriber(audioData instanceof Float64Array ? new Float32Array(audioData) : audioData, {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: 'word' // Request word-level timestamps
      });
      
      return {
        channels: [{
          alternatives: [{
            words: (output.chunks || []).map(w => ({
              word: w.text,
              start: w.timestamp[0],
              end: w.timestamp[1] || w.timestamp[0] + 0.5,
              punctuated_word: w.text || '',
            })),
            transcript: output.text,
          }]
        }],
      };
    }, { maxAttempts: 1, label: 'local_whisper' });
  }
  throw new Error(`Unknown ASR provider: ${asrProvider}`);
}

// ============================================================
// IPC: ai:score — with per-provider retry + provider fallback chain
// ============================================================
const SYSTEM_PROMPT = 'You are an expert AI video editor for TikTok/Shorts/Reels. Return ONLY valid JSON.';

/**
 * Extract an array of jpeg base64 frames from a video clip
 */
function extractFramesBase64(sourcePath, startMs, endMs, maxFrames = 3) {
  return new Promise((resolve) => {
    const durationSec = Math.max(1, (endMs - startMs) / 1000);
    const startSec = startMs / 1000;
    const frames = [];
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'autoclipper-frames-'));

    ffmpeg(sourcePath)
      .setStartTime(startSec)
      .setDuration(durationSec)
      .outputOptions([
         `-vf fps=${maxFrames}/max(${durationSec}\\,1),scale=512:512:force_original_aspect_ratio=decrease`,
         `-vframes ${maxFrames}`,
         `-q:v 5`
      ])
      .output(path.join(tmpDir, 'frame-%03d.jpg'))
      .on('end', () => {
         try {
           const files = fs.readdirSync(tmpDir).sort();
           for (const f of files) {
             const buf = fs.readFileSync(path.join(tmpDir, f));
             frames.push(buf.toString('base64'));
           }
           fs.rmSync(tmpDir, { recursive: true, force: true });
           resolve(frames);
         } catch(e) { resolve(frames); }
      })
      .on('error', (err) => {
         console.warn('[Vision] Frame extraction failed:', err.message);
         try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch(e){}
         resolve([]);
      })
      .run();
  });
}

/**
 * Try to score using a single provider. Throws on failure.
 */
async function scoreWithProvider(provider, model, promptText, framesBase64 = []) {
  const label = `score:${provider}`;

  if (provider === 'openai') {
    const key = await getSetting('openai_key');
    if (!key) throw new Error('no-key:openai');
    
    // We cannot use the simple callOpenAICompat because we need a complex user message array for images
    let userContent = [{ type: 'text', text: promptText }];
    if (framesBase64.length > 0) {
      for (const b64 of framesBase64) {
        userContent.push({ type: 'image_url', image_url: { url: `data:image/jpeg;base64,${b64}`, detail: 'low' } });
      }
    }

    return withRetry(async () => {
      const response = await fetch(config.OPENAI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: model || 'gpt-4o-mini',
          response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userContent }],
        }),
      });
      if (!response.ok) {
        const text = await response.text();
        const err = new Error(`API error ${response.status}: ${text.slice(0, 200)}`);
        err.statusCode = response.status;
        throw err;
      }
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    }, { label });

  } else if (provider === 'gemini') {
    const key = await getSetting('gemini_api_key');
    if (!key) throw new Error('no-key:gemini');
    const geminiModel = model || 'gemini-2.5-flash';
    return withRetry(async () => {
      const parts = [{ text: `${SYSTEM_PROMPT}\n\n${promptText}` }];
      if (framesBase64.length > 0) {
        for (const b64 of framesBase64) {
           parts.push({ inlineData: { mimeType: 'image/jpeg', data: b64 } });
        }
      }

      const res = await fetch(`${config.GEMINI_API_URL}/${geminiModel}:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!res.ok) { const e = new Error(`Gemini ${res.status}`); e.statusCode = res.status; throw e; }
      const data = await res.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    }, { label });

  } else if (provider === 'claude') {
    const key = await getSetting('claude_api_key');
    if (!key) throw new Error('no-key:claude');
    return withRetry(async () => {
      const res = await fetch(config.CLAUDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: model || 'claude-sonnet-4-6', max_tokens: 512, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: promptText }] }),
      });
      if (!res.ok) { const e = new Error(`Claude ${res.status}`); e.statusCode = res.status; throw e; }
      const data = await res.json();
      return JSON.parse(data.content[0].text);
    }, { label });

  } else if (provider === 'groq') {
    const key = await getSetting('groq_api_key');
    if (!key) throw new Error('no-key:groq');
    return withRetry(() => callOpenAICompat(config.GROQ_API_URL, key, model || 'llama-3.3-70b-versatile', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'mistral') {
    const key = await getSetting('mistral_api_key');
    if (!key) throw new Error('no-key:mistral');
    return withRetry(() => callOpenAICompat(config.MISTRAL_API_URL, key, model || 'mistral-small-latest', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'cohere') {
    const key = await getSetting('cohere_api_key');
    if (!key) throw new Error('no-key:cohere');
    return withRetry(async () => {
      const res = await fetch(config.COHERE_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: model || 'command-a', messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: promptText }], response_format: { type: 'json_object' } }),
      });
      if (!res.ok) { const e = new Error(`Cohere ${res.status}`); e.statusCode = res.status; throw e; }
      const data = await res.json();
      return JSON.parse(data.message.content[0].text);
    }, { label });

  } else if (provider === 'deepseek') {
    const key = await getSetting('deepseek_api_key');
    if (!key) throw new Error('no-key:deepseek');
    return withRetry(() => callOpenAICompat('https://api.deepseek.com/v1/chat/completions', key, model || 'deepseek-chat', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'xai') {
    const key = await getSetting('xai_api_key');
    if (!key) throw new Error('no-key:xai');
    return withRetry(() => callOpenAICompat('https://api.x.ai/v1/chat/completions', key, model || 'grok-2-latest', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'cerebras') {
    const key = await getSetting('cerebras_api_key');
    if (!key) throw new Error('no-key:cerebras');
    return withRetry(() => callOpenAICompat('https://api.cerebras.ai/v1/chat/completions', key, model || 'llama3.3-70b', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'openrouter') {
    const key = await getSetting('openrouter_api_key');
    if (!key) throw new Error('no-key:openrouter');
    const orModel = model || await getSetting('openrouter_model', 'openai/gpt-4o-mini');
    return withRetry(() => callOpenAICompat('https://openrouter.ai/api/v1/chat/completions', key, orModel, SYSTEM_PROMPT, promptText, { 'HTTP-Referer': 'https://autoclipper.app', 'X-Title': 'AutoClipper' }), { label });

  } else if (provider === 'local') {

    const localType  = await getSetting('local_ai_type', config.LOCAL_AI_DEFAULT_TYPE);
    const localUrl   = await getSetting('local_ai_url', config.LOCAL_AI_DEFAULT_URL);
    const localModel = await getSetting('local_model_name', config.LOCAL_AI_DEFAULT_MODEL);
    if (localType === 'openai_compatible') {
      return withRetry(() => callOpenAICompat(`${localUrl}/chat/completions`, 'not-needed', localModel, SYSTEM_PROMPT, promptText), { label: 'score:local-openai' });
    } else {
      return withRetry(async () => {
        const res = await fetch(`${localUrl}/api/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: localModel, prompt: `${SYSTEM_PROMPT}\n\n${promptText}`, stream: false, format: 'json' }),
        });
        if (!res.ok) { const e = new Error(`Ollama ${res.status}`); e.statusCode = res.status; throw e; }
        const data = await res.json();
        return JSON.parse(data.response);
      }, { label: 'score:ollama' });
    }
  }
  throw new Error(`Unknown provider: ${provider}`);
}

ipcMain.handle('ai:score', async (_, { promptText, provider: forcedProvider, sourcePath, visionEnabled, startMs, endMs }) => {
  try {
    const preferredProvider = forcedProvider || await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
    const model = await getSetting('ai_scoring_model', config.DEFAULT_LLM_MODEL);

    let framesBase64 = [];
    if (visionEnabled && sourcePath) {
      console.log(`[Vision] Extracting frames for ${sourcePath} from ${startMs} to ${endMs}`);
      framesBase64 = await extractFramesBase64(sourcePath, startMs || 0, endMs || 10000, 3);
    }

    // Build deduped fallback chain: preferred first, then rest
    const chain = buildLLMChain(preferredProvider);

    let lastError;
    const attempted = [];

    for (const provider of chain) {
      try {
        const scores = await scoreWithProvider(provider, model, promptText, framesBase64);
        if (provider !== preferredProvider) {
          console.log(`[Score] Fell back from ${preferredProvider} → ${provider} after trying: ${attempted.join(', ')}`);
        }
        await logEvent('info', 'Score', `Scoring success (Vision: ${visionEnabled})`, { provider, model });
        return { success: true, scores, usedProvider: provider };
      } catch (err) {
        // Skip providers with no API key immediately
        if (err.message.startsWith('no-key:')) {
          continue;
        }
        lastError = err;
        attempted.push(provider);
        console.warn(`[Score] Provider ${provider} failed: ${err.message}. Trying next...`);
        await logEvent('warn', 'Score', `Provider failed`, { provider, error: err.message });
      }
    }

    await logEvent('error', 'Score', `All providers failed`, { error: lastError?.message });
    throw lastError || new Error('All LLM providers failed. Check your API keys in Settings.');
  } catch (error) {
    console.error('[AI] All scoring attempts exhausted:', error.message);
    return { success: false, error: error.message };
  }
});

// ============================================================
// IPC: ai:suggestBRoll — Generate B-Roll queries and timestamps
// ============================================================
ipcMain.handle('ai:suggestBRoll', async (_, { transcript, durationMs }) => {
  try {
    const preferredProvider = await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
    const model = await getSetting('ai_scoring_model', config.DEFAULT_LLM_MODEL);

    const promptText = `Analyze the following video transcript which is ${durationMs}ms long.
Identify at most 3 key moments (between 2 to 4 seconds long) that would benefit from visual B-roll overlay to keep the viewer engaged.
For each moment, provide a short specific keyword to search on Pexels (e.g., 'trading chart', 'happy people', 'coffee cup').
Make sure the moments don't overlap, and avoid the very beginning (0-2s) where the hook happens.

Transcript:
${JSON.stringify(transcript)}

Return exactly this JSON format:
{
  "broll": [
    { "keyword": "...", "startMs": 10000, "endMs": 13000 }
  ]
}`;

    const chain = buildLLMChain(preferredProvider);
    let lastError;

    for (const provider of chain) {
      try {
        const result = await scoreWithProvider(provider, model, promptText);
        return { success: true, result, usedProvider: provider };
      } catch (err) {
        if (err.message.startsWith('no-key:')) continue;
        lastError = err;
      }
    }
    throw lastError || new Error('All LLM providers failed. Check API keys.');
  } catch (error) {
    console.error('[AI] B-Roll suggestion failed:', error.message);
    return { success: false, error: error.message };
  }
});

// ============================================================
// IPC: ai:generateImage — Generate an image (DALL-E 3 default)
// ============================================================
ipcMain.handle('ai:generateImage', async (_, { prompt, provider = 'openai' }) => {
  try {
    const label = `image:${provider}`;
    
    if (provider === 'openai') {
      const key = await getSetting('openai_key');
      if (!key) throw new Error('OpenAI key required for DALL-E image generation.');

      return await withRetry(async () => {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
          }),
        });
        
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`OpenAI Image error ${response.status}: ${text}`);
        }
        
        const data = await response.json();
        // Return a data URL that can be directly used in <img src="..."> or downloaded
        const b64 = data.data[0].b64_json;
        return { success: true, base64: `data:image/png;base64,${b64}`, provider: 'openai' };
      }, { label });
    }

    throw new Error(`Unsupported image provider: ${provider}`);
  } catch (error) {
    console.error('[AI] Image generation failed:', error.message);
    return { success: false, error: error.message };
  }
});
