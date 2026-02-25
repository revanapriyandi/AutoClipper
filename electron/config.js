/**
 * electron/config.js
 * 
 * Central configuration: ALL model names, API base URLs, and defaults.
 * NO hardcoded strings anywhere else in the codebase — import from here.
 * 
 * Last updated: February 2026
 */

module.exports = {
  // =========================================================
  // SCORING / LLM PROVIDERS
  // =========================================================
  LLM_PROVIDERS: [
    { id: 'openai',    label: 'OpenAI' },
    { id: 'gemini',    label: 'Google Gemini' },
    { id: 'claude',    label: 'Anthropic Claude' },
    { id: 'groq',      label: 'Groq (Fast)' },
    { id: 'mistral',   label: 'Mistral AI' },
    { id: 'cohere',    label: 'Cohere' },
    { id: 'local',     label: 'Local (Ollama / LM Studio)' },
  ],

  LLM_MODELS: {
    openai: [
      { id: 'gpt-5.2',          label: 'GPT-5.2 (Best)' },
      { id: 'gpt-5-mini',       label: 'GPT-5 mini (Fast & Cheap)' },
      { id: 'gpt-5.2-pro',      label: 'GPT-5.2 Pro (Expert)' },
      { id: 'gpt-oss-120b',     label: 'GPT-OSS 120B (Open Weight)' },
    ],
    gemini: [
      { id: 'gemini-3.1-pro',   label: 'Gemini 3.1 Pro (Best)' },
      { id: 'gemini-3-flash',   label: 'Gemini 3 Flash (Default / Fast)' },
      { id: 'gemini-3-deep-think', label: 'Gemini 3 Deep Think (Research)' },
    ],
    claude: [
      { id: 'claude-opus-4-6',    label: 'Claude Opus 4.6 (Most Capable)' },
      { id: 'claude-sonnet-4-6',  label: 'Claude Sonnet 4.6 (Recommended)' },
      { id: 'claude-haiku-4-5',   label: 'Claude Haiku 4.5 (Fast & Cheap)' },
    ],
    groq: [
      { id: 'gpt-oss-120b',            label: 'GPT-OSS 120B (~500 tps)' },
      { id: 'gpt-oss-20b',             label: 'GPT-OSS 20B (~1000 tps, Fastest)' },
      { id: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B (Balanced)' },
    ],
    mistral: [
      { id: 'mistral-large-3',         label: 'Mistral Large 3 (Best, MoE)' },
      { id: 'mistral-medium-3-1',      label: 'Mistral Medium 3.1' },
      { id: 'mistral-small-3-2',       label: 'Mistral Small 3.2 (Efficient)' },
      { id: 'codestral-25.01',         label: 'Codestral 25.01 (Code)' },
    ],
    cohere: [
      { id: 'command-a',               label: 'Command A (Flagship, 111B)' },
      { id: 'command-a-reasoning',     label: 'Command A Reasoning' },
      { id: 'command-r-plus',          label: 'Command R+ (RAG & Tools)' },
    ],
    // Local: user types their own model name
  },

  // API Endpoints
  OPENAI_API_URL:   'https://api.openai.com/v1/chat/completions',
  GEMINI_API_URL:   'https://generativelanguage.googleapis.com/v1beta/models',
  CLAUDE_API_URL:   'https://api.anthropic.com/v1/messages',
  GROQ_API_URL:     'https://api.groq.com/openai/v1/chat/completions',
  MISTRAL_API_URL:  'https://api.mistral.ai/v1/chat/completions',
  COHERE_API_URL:   'https://api.cohere.com/v2/chat',

  // Default LLM
  DEFAULT_LLM_PROVIDER: 'openai',
  DEFAULT_LLM_MODEL: 'gpt-5-mini',

  // =========================================================
  // ASR / TRANSCRIPTION PROVIDERS
  // =========================================================
  ASR_PROVIDERS: [
    { id: 'deepgram',       label: 'Deepgram' },
    { id: 'openai_whisper', label: 'OpenAI Whisper API' },
    { id: 'assemblyai',     label: 'AssemblyAI' },
  ],

  ASR_MODELS: {
    deepgram:       ['nova-3', 'nova-2', 'whisper-large'],
    openai_whisper: ['whisper-1'],
    assemblyai:     ['best', 'nano'],
  },

  DEEPGRAM_API_URL:    'https://api.deepgram.com/v1/listen',
  OPENAI_WHISPER_URL:  'https://api.openai.com/v1/audio/transcriptions',
  ASSEMBLYAI_API_URL:  'https://api.assemblyai.com/v2',

  DEFAULT_ASR_PROVIDER: 'deepgram',
  DEFAULT_ASR_MODEL:    'nova-3',

  // =========================================================
  // LOCAL AI DEFAULTS
  // =========================================================
  LOCAL_AI_DEFAULT_URL:   'http://localhost:11434',
  LOCAL_AI_DEFAULT_MODEL: 'llama3.2',
  LOCAL_AI_DEFAULT_TYPE:  'ollama',

  // =========================================================
  // OAUTH
  // =========================================================
  OAUTH_DEFAULT_REDIRECT: 'http://localhost:3000/oauth/callback',

  // =========================================================
  // B-ROLL
  // =========================================================
  PEXELS_API_URL:   'https://api.pexels.com/videos/search',
  PIXABAY_API_URL:  'https://pixabay.com/api/videos/',  // Free alternative, no key needed for basic use
};
