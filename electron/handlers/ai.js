/**
 * electron/handlers/ai.js
 * 
 * IPC Handlers for AI with RETRY + FALLBACK:
 * - withRetry()    — exponential backoff + jitter for transient errors
 * - ai:transcribe  — ASR with auto-fallback ASR provider chain
 * - ai:score       — LLM with per-provider retry + provider fallback chain
 * - ai:getConfig   — Return available providers & models from config
 */

const { ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
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

/**
 * ASR Provider fallback order:
 * User's preferred → next available (if key exists) → error
 */
async function transcribeWithProvider(asrProvider, asrModel, audioBuffer) {
  if (asrProvider === 'deepgram') {
    const key = await getSetting('deepgram_key');
    if (!key) throw new Error('Deepgram API Key not configured.');
    const url = `${config.DEEPGRAM_API_URL}?model=${asrModel}&smart_format=true&punctuate=true&utterances=true`;

    return withRetry(async () => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Token ${key}`, 'Content-Type': 'audio/mp3' },
        body: audioBuffer,
      });
      if (!res.ok) { const e = new Error(`Deepgram ${res.status}: ${await res.text()}`); e.statusCode = res.status; throw e; }
      return (await res.json()).results;
    }, { maxAttempts: 3, label: 'deepgram' });

  } else if (asrProvider === 'openai_whisper') {
    const key = await getSetting('openai_key');
    if (!key) throw new Error('OpenAI Whisper: no API key.');
    const form = new FormData();
    form.append('file', new Blob([audioBuffer], { type: 'audio/mp3' }), 'audio.mp3');
    form.append('model', asrModel || 'whisper-1');
    form.append('response_format', 'verbose_json');

    return withRetry(async () => {
      const res = await fetch(config.OPENAI_WHISPER_URL, {
        method: 'POST', headers: { 'Authorization': `Bearer ${key}` }, body: form,
      });
      if (!res.ok) { const e = new Error(`Whisper ${res.status}`); e.statusCode = res.status; throw e; }
      const data = await res.json();
      return {
        channels: [{ alternatives: [{
          words: (data.words || []).map(w => ({ word: w.word, start: w.start, end: w.end })),
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
      body: JSON.stringify({ audio_url: upload_url, speech_model: asrModel || 'best', word_boost: [] }),
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
        words: (transcript.words || []).map(w => ({ word: w.text, start: w.start / 1000, end: w.end / 1000 })),
        transcript: transcript.text,
      }] }],
    };
  }
  throw new Error(`Unknown ASR provider: ${asrProvider}`);
}

ipcMain.handle('ai:transcribe', async (_, { videoPath, deepgramKey }) => {
  try {
    let asrProvider = await getSetting('asr_provider', config.DEFAULT_ASR_PROVIDER);
    const asrModel  = await getSetting('asr_model', config.DEFAULT_ASR_MODEL);

    // Override deepgramKey if passed directly (legacy support)
    if (deepgramKey && asrProvider === 'deepgram') {
      await keytar.setPassword(SERVICE_NAME, 'deepgram_key', deepgramKey);
    }

    // Extract audio
    const tmpAudioPath = path.join(os.tmpdir(), `autoclipper_audio_${Date.now()}.mp3`);
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath).noVideo().audioCodec('libmp3lame').save(tmpAudioPath)
        .on('end', () => resolve(true)).on('error', reject);
    });
    const audioBuffer = fs.readFileSync(tmpAudioPath);

    // ASR Fallback Chain: preferred → deepgram → openai_whisper
    const fallbackOrder = [asrProvider, 'deepgram', 'openai_whisper'].filter((v, i, a) => a.indexOf(v) === i);
    let lastError;
    for (const provider of fallbackOrder) {
      try {
        const results = await transcribeWithProvider(provider, asrModel, audioBuffer);
        if (fs.existsSync(tmpAudioPath)) fs.unlinkSync(tmpAudioPath);
        if (provider !== asrProvider) console.log(`[ASR] Fell back to ${provider} from ${asrProvider}`);
        return { success: true, results, usedProvider: provider };
      } catch (err) {
        lastError = err;
        console.warn(`[ASR] Provider ${provider} failed: ${err.message}. Trying next...`);
      }
    }
    if (fs.existsSync(tmpAudioPath)) fs.unlinkSync(tmpAudioPath);
    throw lastError;

  } catch (error) {
    console.error('[AI] Transcription failed:', error.message);
    return { success: false, error: error.message };
  }
});

// ============================================================
// IPC: ai:score — with per-provider retry + provider fallback chain
// ============================================================
const SYSTEM_PROMPT = 'You are an expert AI video editor for TikTok/Shorts/Reels. Return ONLY valid JSON.';

/**
 * Try to score using a single provider. Throws on failure.
 */
async function scoreWithProvider(provider, model, promptText) {
  const label = `score:${provider}`;

  if (provider === 'openai') {
    const key = await getSetting('openai_key');
    if (!key) throw new Error('no-key:openai');
    return withRetry(() => callOpenAICompat(config.OPENAI_API_URL, key, model || 'gpt-5-mini', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'gemini') {
    const key = await getSetting('gemini_api_key');
    if (!key) throw new Error('no-key:gemini');
    const geminiModel = model || 'gemini-3-flash';
    return withRetry(async () => {
      const res = await fetch(`${config.GEMINI_API_URL}/${geminiModel}:generateContent?key=${key}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\n${promptText}` }] }],
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
    return withRetry(() => callOpenAICompat(config.GROQ_API_URL, key, model || 'gpt-oss-20b', SYSTEM_PROMPT, promptText), { label });

  } else if (provider === 'mistral') {
    const key = await getSetting('mistral_api_key');
    if (!key) throw new Error('no-key:mistral');
    return withRetry(() => callOpenAICompat(config.MISTRAL_API_URL, key, model || 'mistral-small-3-2', SYSTEM_PROMPT, promptText), { label });

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

/**
 * LLM Provider fallback chain order — ordered by speed/cost.
 * Only tries providers that have API keys configured.
 */
const LLM_FALLBACK_CHAIN = ['groq', 'gemini', 'openai', 'mistral', 'claude', 'cohere', 'local'];

ipcMain.handle('ai:score', async (_, { promptText, provider: forcedProvider }) => {
  try {
    const preferredProvider = forcedProvider || await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
    const model = await getSetting('ai_scoring_model', config.DEFAULT_LLM_MODEL);

    // Build deduped fallback chain: preferred first, then rest
    const chain = [preferredProvider, ...LLM_FALLBACK_CHAIN.filter(p => p !== preferredProvider)];

    let lastError;
    const attempted = [];

    for (const provider of chain) {
      try {
        const scores = await scoreWithProvider(provider, model, promptText);
        if (provider !== preferredProvider) {
          console.log(`[Score] Fell back from ${preferredProvider} → ${provider} after trying: ${attempted.join(', ')}`);
        }
        return { success: true, scores, usedProvider: provider };
      } catch (err) {
        // Skip providers with no API key immediately
        if (err.message.startsWith('no-key:')) {
          continue;
        }
        lastError = err;
        attempted.push(provider);
        console.warn(`[Score] Provider ${provider} failed: ${err.message}. Trying next...`);
      }
    }

    throw lastError || new Error('All LLM providers failed. Check your API keys in Settings.');
  } catch (error) {
    console.error('[AI] All scoring attempts exhausted:', error.message);
    return { success: false, error: error.message };
  }
});
