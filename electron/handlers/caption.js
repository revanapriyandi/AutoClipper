/**
 * electron/handlers/caption.js
 * 
 * AI caption/hook generator for social media posts.
 * - caption:generate — generate viral caption + hashtags from clip transcript
 */
const { ipcMain } = require('electron');
const keytar = require('keytar');
const config = require('../config');

const SERVICE_NAME = 'AutoClipperApp';
const FETCH_TIMEOUT_MS = 20000; // 20s — LLM can be slow

const CAPTION_SYSTEM_PROMPT = `You are a viral social media content strategist specializing in short video captions for TikTok, YouTube Shorts, and Instagram Reels.

Generate highly engaging, platform-optimized captions that:
- Hook viewers in the first 2 words
- Use emotional triggers (curiosity, surprise, FOMO, humor)
- Include 3-5 relevant trending hashtags
- Are between 50-150 characters for the caption body
- Have a clear call-to-action

Return ONLY this exact JSON format:
{
  "hook": "2-3 word attention-grabbing opener",
  "caption": "Main caption body (50-150 chars)",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "cta": "Call to action phrase",
  "fullPost": "Complete post text combining hook + caption + hashtags"
}`;

async function getSetting(key, fallback = '') {
  const val = await keytar.getPassword(SERVICE_NAME, key);
  return val || fallback;
}

/** Safe AbortController-based fetch with timeout */
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

/** Safe JSON parse of LLM response text */
function safeParseLLMJson(text) {
  if (!text) throw new Error('Empty LLM response');
  try {
    return JSON.parse(text);
  } catch {
    // Try to extract JSON block from markdown code fences
    const match = text.match(/```(?:json)?\s*([\s\S]+?)```/);
    if (match) return JSON.parse(match[1].trim());
    throw new Error('LLM returned malformed JSON');
  }
}

const FALLBACK_CAPTIONS = {
  hook: "You won't believe",
  caption: "This clip changed everything. Watch till the end to see why.",
  hashtags: ["#viral", "#trending", "#fyp", "#shorts", "#reels"],
  cta: "Follow for more!",
  fullPost: "You won't believe this clip changed everything. Watch till the end! #viral #trending #fyp",
};

ipcMain.handle('caption:generate', async (_, { transcriptText, topic, platforms = ['tiktok', 'youtube', 'instagram'] } = {}) => {
  try {
    if (!transcriptText || typeof transcriptText !== 'string' || !transcriptText.trim()) {
      return { success: true, caption: FALLBACK_CAPTIONS, note: 'No transcript provided, using fallback' };
    }

    const provider = await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
    const model    = await getSetting('ai_scoring_model',    config.DEFAULT_LLM_MODEL);

    const userPrompt = `Generate a viral caption for this video clip transcript:

"${transcriptText.slice(0, 800)}"

Topic/Context: ${topic || 'General content'}
Target platforms: ${Array.isArray(platforms) ? platforms.join(', ') : 'tiktok, youtube, instagram'}

Return JSON only.`;

    let captionData;

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
            { role: 'system', content: CAPTION_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 512,
        }),
      });
      if (!res.ok) throw new Error(`${provider} API error ${res.status}`);
      const data = await res.json();
      captionData = safeParseLLMJson(data?.choices?.[0]?.message?.content);

    } else if (provider === 'gemini') {
      const key = await getSetting('gemini_api_key');
      if (!key) throw new Error('Gemini API key not configured');
      const geminiModel = model || 'gemini-1.5-flash';
      const res = await fetchWithTimeout(`${config.GEMINI_API_URL}/${geminiModel}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${CAPTION_SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      if (!res.ok) throw new Error(`Gemini API error ${res.status}`);
      const data = await res.json();
      captionData = safeParseLLMJson(data?.candidates?.[0]?.content?.parts?.[0]?.text);

    } else if (provider === 'claude') {
      const key = await getSetting('claude_api_key');
      if (!key) throw new Error('Claude API key not configured');
      const res = await fetchWithTimeout(config.CLAUDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: model || 'claude-3-haiku-20240307',
          max_tokens: 512,
          system: CAPTION_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      if (!res.ok) throw new Error(`Claude API error ${res.status}`);
      const data = await res.json();
      captionData = safeParseLLMJson(data?.content?.[0]?.text);

    } else if (provider === 'local') {
      const localType  = await getSetting('local_ai_type', config.LOCAL_AI_DEFAULT_TYPE);
      const localUrl   = await getSetting('local_ai_url', config.LOCAL_AI_DEFAULT_URL);
      const localModel = await getSetting('local_model_name', config.LOCAL_AI_DEFAULT_MODEL);
      
      if (localType === 'openai_compatible') {
        const res = await fetchWithTimeout(`${localUrl}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer not-needed' },
          body: JSON.stringify({
            model: localModel,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: CAPTION_SYSTEM_PROMPT }, { role: 'user', content: userPrompt }],
          }),
        });
        if (!res.ok) throw new Error(`Local AI error ${res.status}`);
        const data = await res.json();
        captionData = safeParseLLMJson(data?.choices?.[0]?.message?.content);
      } else {
        const res = await fetchWithTimeout(`${localUrl}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: localModel, prompt: `${CAPTION_SYSTEM_PROMPT}\n\n${userPrompt}`, stream: false, format: 'json' }),
        });
        if (!res.ok) throw new Error(`Ollama error ${res.status}`);
        const data = await res.json();
        captionData = safeParseLLMJson(data?.response);
      }
    } else {
      throw new Error('No supported LLM provider configured for caption generation.');
    }

    // Validate response shape
    if (!captionData || typeof captionData !== 'object') throw new Error('Invalid caption data shape');

    return {
      success: true,
      caption: {
        hook:     captionData.hook     || FALLBACK_CAPTIONS.hook,
        caption:  captionData.caption  || FALLBACK_CAPTIONS.caption,
        hashtags: Array.isArray(captionData.hashtags) ? captionData.hashtags : FALLBACK_CAPTIONS.hashtags,
        cta:      captionData.cta      || FALLBACK_CAPTIONS.cta,
        fullPost: captionData.fullPost || FALLBACK_CAPTIONS.fullPost,
      }
    };
  } catch (e) {
    console.error('[Caption] Generation failed:', e.message);
    return { success: false, error: e.message };
  }
});
