# Privacy Policy for AutoClipper

**Effective Date:** January 1, 2024

AutoClipper ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our desktop application collects, uses, and safeguards your information.

## 1. Information We Collect

### A. Local Data (Stored on Your Device)

AutoClipper is a privacy-first, offline-capable desktop application. The following data never leaves your computer unless explicitly authorized by you:

- **Video Files:** The videos you import and export are processed and stored locally on your hard drive.
- **Database:** Your project history (clips, scores, generated captions) is stored in a local SQLite database (`~/.autoclipper/db`).
- **API Keys & Credentials:** Your third-party API keys (e.g., ElevenLabs, Pexels, Ollama) and OAuth tokens are strictly stored encrypted in your operating system's native secure Keychain/Credential Manager.

### B. Data Shared with Third-Party APIs

To provide advanced AI and clipping functionalities, AutoClipper acts as a bridge to external services. When you enable specific features, your data is sent directly to these third-party providers from your IP address, **not through our servers**:

- **Transcription (ASR):** Audio chunks may be sent directly to providers like Deepgram, AssemblyAI, or OpenAI Whisper.
- **LLM Processing:** Video transcripts are sent to large language models (OpenAI, Anthropic, Gemini, Groq) to generate hooks and contextual analysis. _(Note: If you use Local AI via Ollama, no transcript data leaves your device)._
- **B-Roll Search:** Your pre-defined keywords are sent to the Pexels API to fetch stock footage parameters.
- **Social Media Uploads:** If you connect your social media accounts, rendered videos and captions are transmitted directly to YouTube, TikTok, or Facebook via their official APIs.

## 2. OAuth and Social Media Data

If you choose to use our auto-posting features, you must authenticate through Secure OAuth (PKCE).

- **YouTube Services:** Our application uses the YouTube Data API to upload videos. By using this feature, you agree to be bound by the [YouTube Terms of Service](https://www.youtube.com/t/terms) and [Google Privacy Policy](http://www.google.com/policies/privacy). You can revoke access at any time via your Google security settings page.
- **TikTok & Facebook:** We use their official APIs strictly for publishing content you approve. We do not read your private messages or fetch your personal feeds.

We do not have access to your passwords, nor do we store, log, or harvest your social media data on any centralized server.

## 3. Analytics and Telemetry

AutoClipper operates without forced telemetry. We do not track your usage behavior, feature clicks, or demographic data. We only use local Winston logs saved on your hard drive (`~/.autoclipper/logs`) to help you debug errors.

## 4. Updates to this Policy

We may update our Privacy Policy from time to time as features evolve. We will notify you of any changes by posting the new Privacy Policy on our GitHub repository. A link to this URL will be maintained.

## 5. Contact Us

If you have questions about this Privacy Policy or need to report a vulnerability, please open an issue on our [Official GitHub Repository](https://github.com/revanapriyandi/AutoClipper).
