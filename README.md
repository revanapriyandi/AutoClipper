<h1 align="center">
  <img src="public/favicon.ico" alt="AutoClipper Logo" width="120" />
  <br>
  AutoClipper
</h1>

<p align="center">
  <strong>Industry-Standard AI Video Clipper & Social Publisher</strong><br>
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

It handles the entire pipeline: from **Transcription** (ASR), **AI Hook Generation/Scoring** (LLM), **Dynamic Face Tracking & Cropping** (MediaPipe/SignalStats), to **Automated Video Rendering** (FFmpeg) and scheduled **Social Media Posting** (OAuth PKCE).

---

## ✨ Key Features

- **🤖 AI-Powered Curation**: Automatically segments long videos into 15-60s clips, scored by virality using Local AI (Ollama/LM Studio) or Cloud LLMs (OpenAI, Gemini, Claude, Groq).
- **🗣️ Advanced Transcription**: Fast, accurate speech-to-text with Deepgram, AssemblyAI, or Whisper.
- **🎯 Dynamic Face Tracking**: Intelligently crops 16:9 videos into 9:16 vertical shorts by tracking the speaker's face, extracting precise crop offsets dynamically using FFprobe and AI Vision.
- **💬 Stylized Subtitles (Karaoke Mode)**: Auto-generates fully customizable, animated subtitles with "Brand Kits" (Fonts, Colors, Alignment).
- **🎛️ B-Roll & Music Integration**: Mentions of keywords automatically fetch B-Rolls from Pexels. Inject Background Music to elevate production value.
- **🌐 AI Dubbing**: Translate and lip-sync clips to global languages seamlessly via ElevenLabs API.
- **📅 Social Media Auto-Scheduler**: Authenticate via secure PKCE OAuth to directly upload rendered clips to YouTube Shorts, TikTok, and Facebook Reels.
- **🛡️ Secure By Design**: All API Keys are stored in your OS native secure Keychain, and `SQLite` databases are safely sandboxed in local UserDara, never exposed externally.

## 🚀 Quick Start (Development)

To run AutoClipper locally from the source, ensure you have **Node.js (v20+)** and **Git** installed.

1. **Clone the repository:**

   ```bash
   git clone https://github.com/revanapriyandi/AutoClipper.git
   cd AutoClipper
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Database Initialization:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Environment Setup:**
   Create a `.env` file in the root directory for OAuth features (optional for local running if not posting to socials).

   ```env
   GOOGLE_CLIENT_ID=your-google-oauth-client-id
   TIKTOK_CLIENT_KEY=your-tiktok-client-id
   FACEBOOK_APP_ID=your-facebook-app-id
   PEXELS_API_KEY=your-pexels-api
   OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/callback
   DATABASE_URL=file:./dev.db
   ```

5. **Start the App:**
   ```bash
   npm run electron:dev
   ```

## 📦 Building for Production

AutoClipper uses `electron-builder` coupled with **GitHub Actions** to automate cross-platform builds.

To build manually:

```bash
npm run electron:build
```

This will compile the Next.js static output and package the `.asar` Electron runtime for your current OS.

## 🤝 Contributing

We welcome contributions to make AutoClipper even better! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to open issues, submit pull requests, and set up your development environment.

## 📄 License

This project is open-sourced under the [MIT License](./LICENSE).

---

_Built with ❤️ for Content Creators by Revan Apriyandi._
