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

ipcMain.handle('caption:generate', async (_, { transcriptText, topic, platforms = ['tiktok', 'youtube', 'instagram'] }) => {
  try {
    const provider = await getSetting('ai_scoring_provider', config.DEFAULT_LLM_PROVIDER);
    const model    = await getSetting('ai_scoring_model',    config.DEFAULT_LLM_MODEL);

    const userPrompt = `Generate a viral caption for this video clip transcript:

"${transcriptText.slice(0, 800)}"

Topic/Context: ${topic || 'General content'}
Target platforms: ${platforms.join(', ')}

Return JSON only.`;

    let captionData;

    if (provider === 'openai' || provider === 'groq' || provider === 'mistral') {
      const keyMap = { openai: 'openai_key', groq: 'groq_api_key', mistral: 'mistral_api_key' };
      const urlMap = { openai: config.OPENAI_API_URL, groq: config.GROQ_API_URL, mistral: config.MISTRAL_API_URL };
      const defaultModel = { openai: 'gpt-5-mini', groq: 'gpt-oss-20b', mistral: 'mistral-small-3-2' };

      const key = await getSetting(keyMap[provider]);
      if (!key) throw new Error(`${provider} API key not configured`);

      const res = await fetch(urlMap[provider], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key}` },
        body: JSON.stringify({
          model: model || defaultModel[provider],
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: CAPTION_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
        }),
      });
      const data = await res.json();
      captionData = JSON.parse(data.choices[0].message.content);

    } else if (provider === 'gemini') {
      const key = await getSetting('gemini_api_key');
      if (!key) throw new Error('Gemini API key not configured');
      const geminiModel = model || 'gemini-3-flash';
      const res = await fetch(`${config.GEMINI_API_URL}/${geminiModel}:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${CAPTION_SYSTEM_PROMPT}\n\n${userPrompt}` }] }],
          generationConfig: { responseMimeType: 'application/json' },
        }),
      });
      const data = await res.json();
      captionData = JSON.parse(data.candidates[0].content.parts[0].text);

    } else if (provider === 'claude') {
      const key = await getSetting('claude_api_key');
      if (!key) throw new Error('Claude API key not configured');
      const res = await fetch(config.CLAUDE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({
          model: model || 'claude-sonnet-4-6', max_tokens: 512,
          system: CAPTION_SYSTEM_PROMPT,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      });
      const data = await res.json();
      captionData = JSON.parse(data.content[0].text);

    } else if (provider === 'local') {
      const localType  = await getSetting('local_ai_type', config.LOCAL_AI_DEFAULT_TYPE);
      const localUrl   = await getSetting('local_ai_url', config.LOCAL_AI_DEFAULT_URL);
      const localModel = await getSetting('local_model_name', config.LOCAL_AI_DEFAULT_MODEL);
      
      if (localType === 'openai_compatible') {
        const res = await fetch(`${localUrl}/chat/completions`, {
          method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer not-needed` },
          body: JSON.stringify({
            model: localModel,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: CAPTION_SYSTEM_PROMPT }, { role: 'user', content: userPrompt }]
          })
        });
        const data = await res.json();
        captionData = JSON.parse(data.choices[0].message.content);
      } else {
        const res = await fetch(`${localUrl}/api/generate`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: localModel,
            prompt: `${CAPTION_SYSTEM_PROMPT}\n\n${userPrompt}`,
            stream: false, format: 'json'
          })
        });
        const data = await res.json();
        captionData = JSON.parse(data.response);
      }
    } else {
      throw new Error('No supported LLM provider configured for caption generation.');
    }

    return { success: true, caption: captionData };
  } catch (e) {
    console.error('[Caption] Generation failed:', e.message);
    return { success: false, error: e.message };
  }
});
