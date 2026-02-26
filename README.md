<h1 align="center">
  <img src="public/favicon.ico" alt="AutoClipper Logo" width="120" />
  <br>
  AutoClipper
</h1>

<p align="center">
  <strong>Industry-Standard AI Video Clipper &amp; Social Publisher</strong><br>
  Built with <em>Electron, Next.js, Prisma SQLite,</em> and <em>FFmpeg</em>.
</p>

<p align="center">
  <img src="https://img.shields.io/github/license/revanapriyandi/AutoClipper?style=flat-square" alt="MIT License">
  <img src="https://img.shields.io/github/v/release/revanapriyandi/AutoClipper?style=flat-square" alt="Release">
  <img src="https://img.shields.io/badge/Electron-Desktop-191970?style=flat-square&logo=electron" alt="Electron">
  <img src="https://img.shields.io/badge/Next.js-React-black?style=flat-square&logo=next.js" alt="Next.js">
</p>

---

**AutoClipper** is a powerful, locally-run desktop application designed to transform long-form videos (podcasts, streams, interviews) into viral short-form content (TikToks, YouTube Shorts, Instagram Reels) completely autonomously using AI.

---

## ✨ Core Features

- **🤖 AI-Powered Curation** — Segments long videos into 15-60s clips, scored by virality using OpenAI, Gemini, Claude, Groq, or local Ollama.
- **🗣️ Advanced Transcription** — Deepgram, AssemblyAI, or local Whisper.
- **🎯 Dynamic Face Tracking** — MediaPipe auto-crops to 9:16 vertical format.
- **📝 Subtitle Engine** — ASS/SSA karaoke animation with brand kits and theme presets.
- **📤 Social Publishing** — Scheduled posting to YouTube Shorts, TikTok, and Facebook Reels via OAuth PKCE.
- **🎬 CapCut-Style Video Editor** — Full timeline editor with color grading, text overlays, and audio mixing.

---

## 🚀 New Features (v1.0.0)

### 1. Job Queue Dashboard 📋

Real-time job monitoring with retry/cancel, progress bars, status filters, and auto-retry with exponential backoff (max 3 attempts).

### 2. Analytics Platform Sync 📊

Auto-fetch real stats from YouTube Data API v3, TikTok Creator API, and Facebook Graph API. Syncs every 6 hours in the background.

### 3. Smart Autopilot 🤖

Enhanced automation with min-views filter, max-age filter, multi-source support (YouTube Search, Playlist, RSS/Podcast feeds), and URL deduplication.

### 4. AI Thumbnail Generator 🖼️

FFmpeg scene detection + Gemini Vision API scoring + text overlay. Generates 2 variants: clean frame and text-overlay frame.

### 5. Full Dubbing Pipeline 🎙️

ElevenLabs TTS pipeline: browse voices → translate text (Gemini/OpenAI) → synthesize audio → FFmpeg merge with video.

### 6. Content Calendar 📅

Monthly grid calendar with scheduled post view, day-click detail panel, and AI-powered optimal posting time suggestions from your analytics data.

### 7. Clip Compilation Mode 🎬

Combine clips into compilation videos. Manual selection or Auto Best-Of (AI auto-selects top N by virality score) with real-time progress.

---

## 🏗️ Tech Stack

| Layer       | Technology                                                  |
| ----------- | ----------------------------------------------------------- |
| Desktop     | Electron 28+                                                |
| Frontend    | Next.js 14, React 18, shadcn/ui                             |
| Database    | Prisma + SQLite                                             |
| AI/LLM      | OpenAI, Gemini, Groq, Ollama, Claude                        |
| Video       | FFmpeg, fluent-ffmpeg                                       |
| TTS         | ElevenLabs multilingual v2                                  |
| Social APIs | YouTube Data API v3, TikTok Creator API, Facebook Graph API |
| Security    | keytar (OS native keychain)                                 |

---

## 🛠️ Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run electron:dev   # Development
npm run build          # Production build
```

---

## 📁 Project Structure

```
electron/handlers/
├── jobs.js              # Job queue (retry + broadcasts)
├── analytics_sync.js    # Platform analytics sync
├── autopilot.js         # Smart autopilot (search/playlist/rss)
├── thumbnail.js         # AI thumbnail generator
├── dubbing.js           # ElevenLabs TTS pipeline
├── compilation.js       # Clip compilation (concat + best-of)
└── db_calendar_addon.js # Calendar + optimal posting times

src/app/
├── jobs/page.tsx         # Job Queue Dashboard
├── calendar/page.tsx     # Content Calendar
├── compilation/page.tsx  # Compilation Mode
└── autopilot/page.tsx    # Smart Autopilot
```

---

## License

MIT © [revanapriyandi](https://github.com/revanapriyandi)
