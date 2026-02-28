const { ipcMain } = require('electron');
const keytar = require('keytar');
const config = require('../config');

const SERVICE_NAME = 'AutoClipperApp';
const FETCH_TIMEOUT_MS = 20000;

const TRANSLATION_SYSTEM_PROMPT = `You are an expert bilingual subtitle translator.
Translate the following video transcript segments into the requested target language.
Preserve the exact timing, segment structure, and formatting.
Adapt colloquialisms naturally.

Return ONLY the translated segments in this exact JSON format:
{
  "segments": [
    {
      "start": 0.0,
      "end": 2.5,
      "text": "Translated text here"
    }
  ]
}`;

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

async function fetchWithTimeout(url, options, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (e) {
    clearTimeout(timer);
    if (e.name === 'AbortError') throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    throw e;
  }
}

function safeParseLLMJson(text) {
  if (!text) throw new Error('Empty LLM response');
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]+?)```/);
    if (match) return JSON.parse(match[1].trim());
    throw new Error('LLM returned malformed JSON');
  }
}

async function runTranslation(segments, targetLanguage) {
  if (!segments || segments.length === 0) throw new Error('No segments provided');
  if (!targetLanguage) throw new Error('No target language specified');

  const provider = await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
  const model    = await getSetting('ai_scoring_model',    config.DEFAULT_LLM_MODEL);

  const userPrompt = `Target Language: ${targetLanguage}\n\nSegments to translate:\n${JSON.stringify({segments}, null, 2)}`;

  let responseData;

  if (provider === 'openai' || provider === 'groq' || provider === 'mistral') {
    const keyMap = { openai: 'openai_key', groq: 'groq_api_key', mistral: 'mistral_api_key' };
    const urlMap = { openai: config.OPENAI_API_URL, groq: config.GROQ_API_URL, mistral: config.MISTRAL_API_URL };
    const defaultModel = { openai: 'gpt-4o-mini', groq: 'llama-3.1-8b-instant', mistral: 'mistral-small-latest' };

    const key = await getSetting(keyMap[provider]);
    if (!key) throw new Error(`${provider} API key not configured`);

    const res = await fetchWithTimeout(urlMap[provider], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
      body: JSON.stringify({
        model: model || defaultModel[provider],
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: TRANSLATION_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
      }),
    });
    if (!res.ok) throw new Error(`${provider} API error ${res.status}`);
    const data = await res.json();
    responseData = safeParseLLMJson(data?.choices?.[0]?.message?.content);

  } else if (provider === 'gemini') {
    const key = await getSetting('gemini_api_key');
    if (!key) throw new Error('Gemini API key not configured');
    const geminiModel = model || 'gemini-1.5-flash';
    const res = await fetchWithTimeout(`${config.GEMINI_API_URL}/${geminiModel}:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${TRANSLATION_SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });
    if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
    const data = await res.json();
    responseData = safeParseLLMJson(data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } else {
    throw new Error(`Provider ${provider} not fully wired for translation yet.`);
  }

  if (!responseData || !Array.isArray(responseData.segments)) {
    throw new Error('Invalid translation data shape');
  }

  return responseData.segments;
}

ipcMain.handle('ai:translate', async (_, { segments, targetLanguage }) => {
  try {
    const results = await runTranslation(segments, targetLanguage);
    return { success: true, segments: results };
  } catch (e) {
    console.error('[Translation] failed:', e.message);
    return { success: false, error: e.message };
  }
});

module.exports = { runTranslation };
