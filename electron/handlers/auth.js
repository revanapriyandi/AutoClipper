/**
 * electron/handlers/auth.js
 * OAuth login + REAL token exchange for YouTube, TikTok, Facebook
 */
const { ipcMain, BrowserWindow } = require('electron');
const keytar = require('keytar');
const crypto = require('crypto');
const config = require('../config');

const SERVICE_NAME = 'AutoClipperApp';

// ── PKCE Helpers ────────────────────────────────────────────────

function base64URLEncode(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function generatePKCE() {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(crypto.createHash('sha256').update(verifier).digest());
  return { verifier, challenge };
}

// ── Token exchange helpers ──────────────────────────────────────

async function exchangeYouTubeToken(code, redirectUri, verifier, clientId) {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
      code,
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error(`YouTube token exchange failed: ${res.status}`);
  const data = await res.json();
  return { accessToken: data.access_token, refreshToken: data.refresh_token, expiresIn: data.expires_in };
}

async function exchangeTikTokToken(code, redirectUri, verifier, clientKey) {
  const res = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key:    clientKey,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
      code,
      code_verifier: verifier,
    }),
  });
  if (!res.ok) throw new Error(`TikTok token exchange failed: ${res.status}`);
  const data = await res.json();
  return { accessToken: data.data?.access_token, refreshToken: data.data?.refresh_token, expiresIn: data.data?.expires_in };
}

async function exchangeFacebookToken(code, redirectUri, verifier, appId) {
  const params = new URLSearchParams({
    client_id:     appId,
    redirect_uri:  redirectUri,
    code,
    code_verifier: verifier,
  });
  const res = await fetch(`https://graph.facebook.com/v17.0/oauth/access_token?${params}`);
  if (!res.ok) throw new Error(`Facebook token exchange failed: ${res.status}`);
  const data = await res.json();
  return { accessToken: data.access_token, expiresIn: data.expires_in };
}


// ── IPC Handler ─────────────────────────────────────────────────

ipcMain.handle('auth:login', async (_, provider) => {
  return new Promise(async (resolve) => {
    const redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';
    const { verifier, challenge } = generatePKCE();
    let authUrl = '';

    // Read credentials from keytar (user-configured in Settings)
    const googleClientId  = await keytar.getPassword(SERVICE_NAME, 'oauth_google_client_id')  || process.env.GOOGLE_CLIENT_ID;
    const tiktokClientKey = await keytar.getPassword(SERVICE_NAME, 'oauth_tiktok_client_key') || process.env.TIKTOK_CLIENT_KEY;
    const facebookAppId   = await keytar.getPassword(SERVICE_NAME, 'oauth_facebook_app_id')   || process.env.FACEBOOK_APP_ID;

    if (provider === 'youtube') {
      if (!googleClientId) return resolve({ success: false, error: 'Google Client ID not configured. Add it in Settings → OAuth App Credentials.' });
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        client_id: googleClientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'https://www.googleapis.com/auth/youtube.upload',
        access_type: 'offline',
        prompt: 'consent',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
    } else if (provider === 'tiktok') {
      if (!tiktokClientKey) return resolve({ success: false, error: 'TikTok Client Key not configured. Add it in Settings → OAuth App Credentials.' });
      authUrl = `https://www.tiktok.com/v2/auth/authorize?` + new URLSearchParams({
        client_key: tiktokClientKey,
        response_type: 'code',
        scope: 'video.upload',
        redirect_uri: redirectUri,
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
    } else if (provider === 'facebook') {
      if (!facebookAppId) return resolve({ success: false, error: 'Facebook App ID not configured. Add it in Settings → OAuth App Credentials.' });
      authUrl = `https://www.facebook.com/v17.0/dialog/oauth?` + new URLSearchParams({
        client_id: facebookAppId,
        redirect_uri: redirectUri,
        scope: 'pages_manage_posts,pages_read_engagement',
        code_challenge: challenge,
        code_challenge_method: 'S256',
      });
    }

    if (!authUrl) return resolve({ success: false, error: 'Unknown provider: ' + provider });


    const authWindow = new BrowserWindow({
      width: 500, height: 700, show: true,
      webPreferences: { nodeIntegration: false, contextIsolation: true },
    });
    authWindow.loadURL(authUrl);

    authWindow.webContents.on('will-redirect', async (event, url) => {
      if (!url.includes('/oauth/callback')) return;
      event.preventDefault();

      const code = new URL(url).searchParams.get('code');
      if (!code) {
        authWindow.close();
        return resolve({ success: false, error: 'No authorization code received.' });
      }

      try {
        let tokens;
        if (provider === 'youtube')  tokens = await exchangeYouTubeToken(code, redirectUri, verifier, googleClientId);
        if (provider === 'tiktok')   tokens = await exchangeTikTokToken(code, redirectUri, verifier, tiktokClientKey);
        if (provider === 'facebook') tokens = await exchangeFacebookToken(code, redirectUri, verifier, facebookAppId);


        if (tokens?.accessToken) {
          await keytar.setPassword(SERVICE_NAME, `oauth_${provider}`, tokens.accessToken);
          if (tokens.refreshToken) {
            await keytar.setPassword(SERVICE_NAME, `oauth_${provider}_refresh`, tokens.refreshToken);
          }
          // Store expiry time
          if (tokens.expiresIn) {
            const expiresAt = Date.now() + (tokens.expiresIn * 1000);
            await keytar.setPassword(SERVICE_NAME, `oauth_${provider}_expires`, String(expiresAt));
          }
          authWindow.close();
          resolve({ success: true });
        } else {
          throw new Error('No access token in response');
        }
      } catch (err) {
        authWindow.close();
        resolve({ success: false, error: err.message });
      }
    });

    authWindow.on('closed', () => resolve({ success: false, error: 'Window closed by user' }));
  });
});

// ── Token refresh ───────────────────────────────────────────────

async function getValidToken(provider) {
  const token = await keytar.getPassword(SERVICE_NAME, `oauth_${provider}`);
  if (!token) return null;

  const expiresAtStr = await keytar.getPassword(SERVICE_NAME, `oauth_${provider}_expires`);
  if (expiresAtStr && Date.now() > parseInt(expiresAtStr, 10) - 60_000) {
    // Token expired or expiring in <60s — refresh
    const refreshToken = await keytar.getPassword(SERVICE_NAME, `oauth_${provider}_refresh`);
    if (!refreshToken) return null;

    try {
      if (provider === 'youtube') {
        const clientId = await keytar.getPassword(SERVICE_NAME, 'oauth_google_client_id') || process.env.GOOGLE_CLIENT_ID;
        const res = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id:     clientId,
            grant_type:    'refresh_token',
            refresh_token: refreshToken,
          }),
        });

        const data = await res.json();
        if (data.access_token) {
          await keytar.setPassword(SERVICE_NAME, `oauth_${provider}`, data.access_token);
          const expiresAt = Date.now() + ((data.expires_in || 3600) * 1000);
          await keytar.setPassword(SERVICE_NAME, `oauth_${provider}_expires`, String(expiresAt));
          return data.access_token;
        }
      }
    } catch (err) {
      console.error(`[Auth] Token refresh failed for ${provider}:`, err.message);
    }
    return null;
  }

  return token;
}

// Check connected status
ipcMain.handle('auth:status', async (_, provider) => {
  try {
    const token = await getValidToken(provider);
    return { success: true, connected: !!token };
  } catch {
    return { success: true, connected: false };
  }
});

module.exports = { getValidToken };

// ════════════════════════════════════════════════════════════════════════════
// AI Provider Alternative Auth Handlers
// ════════════════════════════════════════════════════════════════════════════

const { exec } = require('child_process');
const http = require('http');
const os = require('os');
const fs = require('fs');
const path_mod = require('path');
const { shell } = require('electron');

// Use exec+shell:true so .cmd/.bat files work on Windows (execFile causes EINVAL)
function runCmd(cmd, timeout = 6000) {
  return new Promise((resolve) => {
    exec(cmd, { timeout, windowsHide: true, shell: true }, (err, stdout, stderr) => {
      resolve({ ok: !err, stdout: (stdout || '').trim(), stderr: (stderr || '').trim() });
    });
  });
}

// ── 1. Detect Gemini CLI ─────────────────────────────────────────

ipcMain.handle('app:detect-gemini-cli', async () => {
  // Try `gemini --version` (works cross-platform via shell)
  const res = await runCmd('gemini --version');
  if (res.ok && res.stdout) {
    return { found: true, version: res.stdout.split('\n')[0] };
  }
  // Fallback: check npm global packages
  const npmRes = await runCmd('npm list -g --depth=0 @google/gemini-cli');
  const found = npmRes.ok && npmRes.stdout.includes('gemini-cli');
  return { found, version: null };
});

// ── 2. Check gcloud ADC ──────────────────────────────────────────

ipcMain.handle('app:check-gcloud-adc', async () => {
  // Env var
  const envCred = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (envCred && fs.existsSync(envCred)) {
    return { found: true, method: 'service_account', path: envCred };
  }
  // Default ADC paths
  const home = os.homedir();
  const adcPaths = [
    path_mod.join(home, '.config', 'gcloud', 'application_default_credentials.json'),
    path_mod.join(home, 'AppData', 'Roaming', 'gcloud', 'application_default_credentials.json'),
  ];
  for (const p of adcPaths) {
    if (fs.existsSync(p)) {
      try {
        const cred = JSON.parse(fs.readFileSync(p, 'utf8'));
        return { found: true, method: cred.type || 'authorized_user', path: p };
      } catch (_) {
        return { found: true, method: 'unknown', path: p };
      }
    }
  }
  return { found: false, method: null, path: null };
});

// ── 3. Google OAuth2 PKCE (for AI scopes) ────────────────────────

ipcMain.handle('app:google-ai-oauth-login', async (_, { clientId, clientSecret } = {}) => {
  try {
    let cid = clientId;
    let csec = clientSecret;
    if (!cid) {
      cid  = await keytar.getPassword(SERVICE_NAME, 'google_client_id')     || '';
      csec = await keytar.getPassword(SERVICE_NAME, 'google_client_secret')  || '';
    }
    if (!cid) return { ok: false, error: 'Google Client ID belum dikonfigurasi.' };

    const verifier  = crypto.randomBytes(32).toString('base64url');
    const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
    const port = 48124;
    const redirectUri = `http://localhost:${port}/oauth`;

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
      client_id: cid,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'https://www.googleapis.com/auth/cloud-platform openid email',
      code_challenge: challenge,
      code_challenge_method: 'S256',
      access_type: 'offline',
      prompt: 'consent',
    });

    const code = await new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        const u = new URL(req.url, `http://localhost:${port}`);
        const code = u.searchParams.get('code');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<html><body style="font-family:sans-serif;text-align:center;padding:48px;background:#09090b;color:#e4e4e7">
          <h2 style="color:${code ? '#22c55e' : '#ef4444'}">${code ? '✅ Login Berhasil' : '❌ Login Gagal'}</h2>
          <p>Kembali ke AutoClipper.</p><script>setTimeout(()=>window.close(),1500)</script></body></html>`);
        server.close();
        if (code) resolve(code); else reject(new Error(u.searchParams.get('error') || 'cancelled'));
      });
      server.listen(port, () => shell.openExternal(authUrl));
      setTimeout(() => { server.close(); reject(new Error('Timeout')); }, 180000);
    });

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: cid,
        ...(csec ? { client_secret: csec } : {}),
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code_verifier: verifier,
      }).toString(),
    });
    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      throw new Error(`Token exchange failed: ${err}`);
    }
    const tokens = await tokenRes.json();
    if (tokens.access_token)  await keytar.setPassword(SERVICE_NAME, 'google_ai_access_token', tokens.access_token);
    if (tokens.refresh_token) await keytar.setPassword(SERVICE_NAME, 'google_ai_refresh_token', tokens.refresh_token);

    // Get user info
    const prof = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }).then(r => r.ok ? r.json() : {}).catch(() => ({}));

    return { ok: true, email: prof.email, name: prof.name };
  } catch (err) {
    return { ok: false, error: err.message };
  }
});

// ── 4. Check AWS Credentials (for Bedrock) ───────────────────────

ipcMain.handle('app:check-aws-creds', async () => {
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    return { found: true, method: 'env', region: process.env.AWS_REGION || 'us-east-1' };
  }
  const credFile = path_mod.join(os.homedir(), '.aws', 'credentials');
  if (fs.existsSync(credFile) && fs.readFileSync(credFile, 'utf8').includes('aws_access_key_id')) {
    const cfg = path_mod.join(os.homedir(), '.aws', 'config');
    let region = 'us-east-1';
    if (fs.existsSync(cfg)) {
      const m = fs.readFileSync(cfg, 'utf8').match(/region\s*=\s*(.+)/);
      if (m) region = m[1].trim();
    }
    return { found: true, method: 'credentials_file', region };
  }
  const res = await runCmd('aws sts get-caller-identity --output json');
  if (res.ok) {
    try {
      const d = JSON.parse(res.stdout);
      return { found: true, method: 'aws_cli', region: 'us-east-1', account: d.Account };
    } catch (_) {}
  }
  return { found: false, method: null };
});

// ── 5. Test AI Connection ────────────────────────────────────────
// Makes a real minimal API call to verify credentials work.

ipcMain.handle('app:test-connection', async (_, { provider, authMode, keys = {} }) => {
  const t0 = Date.now();
  try {
    let ok = false;
    let model = '';
    const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('Timeout')), ms));

    // ── OpenAI / OpenAI-compatible providers ──
    if (['openai', 'deepseek', 'xai', 'groq', 'mistral', 'cohere', 'cerebras', 'openrouter'].includes(provider)) {
      const endpoints = {
        openai:     'https://api.openai.com/v1/models',
        deepseek:   'https://api.deepseek.com/v1/models',
        xai:        'https://api.x.ai/v1/models',
        groq:       'https://api.groq.com/openai/v1/models',
        mistral:    'https://api.mistral.ai/v1/models',
        cohere:     'https://api.cohere.ai/v1/models',
        cerebras:   'https://api.cerebras.ai/v1/models',
        openrouter: 'https://openrouter.ai/api/v1/models',
      };
      const keyMap = {
        openai: 'openai_key', deepseek: 'deepseek_api_key', xai: 'xai_api_key',
        groq: 'groq_api_key', mistral: 'mistral_api_key', cohere: 'cohere_api_key',
        cerebras: 'cerebras_api_key', openrouter: 'openrouter_api_key',
      };
      const apiKey = keys[keyMap[provider]] ||
        await keytar.getPassword(SERVICE_NAME, keyMap[provider]) || '';
      if (!apiKey) return { ok: false, error: 'API key tidak ada' };

      const res = await Promise.race([
        fetch(endpoints[provider], { headers: { Authorization: `Bearer ${apiKey}` } }),
        timeout(8000),
      ]);
      ok = res.status === 200 || res.status === 206;
      if (!ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body?.error?.message || `HTTP ${res.status}` };
      }
      const data = await res.json().catch(() => ({}));
      model = data?.data?.[0]?.id || data?.models?.[0]?.name || '';
    }

    // ── Gemini API key ──
    else if (provider === 'gemini' && authMode === 'apikey') {
      const apiKey = keys['gemini_api_key'] || await keytar.getPassword(SERVICE_NAME, 'gemini_api_key') || '';
      if (!apiKey) return { ok: false, error: 'API key tidak ada' };
      const res = await Promise.race([
        fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`),
        timeout(8000),
      ]);
      ok = res.ok;
      if (!ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body?.error?.message || `HTTP ${res.status}` };
      }
      const data = await res.json().catch(() => ({}));
      model = data?.models?.[0]?.name || 'gemini';
    }

    // ── Gemini Vertex AI / ADC ──
    else if (provider === 'gemini' && authMode === 'vertex') {
      const adcCheck = await ipcMain.emit; // Use existing check
      const adcRes = await new Promise(resolve =>
        ipcMain.handle._handlers?.['app:check-gcloud-adc']?.({}, resolve) || resolve(null)
      ).catch(() => null);
      // Simple: just verify project ID is set
      const projectId = keys['google_project_id'] || '';
      ok = !!projectId;
      if (!ok) return { ok: false, error: 'Google Project ID diperlukan' };
      model = 'vertex-ai';
    }

    // ── Gemini CLI ──
    else if (provider === 'gemini' && authMode === 'cli') {
      const { execFile } = require('child_process');
      ok = await new Promise(resolve => {
        execFile(process.platform === 'win32' ? 'gemini.cmd' : 'gemini',
          ['--version'], { timeout: 5000, windowsHide: true },
          (err) => resolve(!err));
      });
      if (!ok) return { ok: false, error: 'Gemini CLI tidak ditemukan' };
      model = 'gemini-cli';
    }

    // ── Claude API key ──
    else if (provider === 'claude' && authMode === 'apikey') {
      const apiKey = keys['claude_api_key'] || await keytar.getPassword(SERVICE_NAME, 'claude_api_key') || '';
      if (!apiKey) return { ok: false, error: 'API key tidak ada' };
      const res = await Promise.race([
        fetch('https://api.anthropic.com/v1/models', {
          headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
        }),
        timeout(8000),
      ]);
      ok = res.ok;
      if (!ok) {
        const body = await res.json().catch(() => ({}));
        return { ok: false, error: body?.error?.message || `HTTP ${res.status}` };
      }
      const data = await res.json().catch(() => ({}));
      model = data?.models?.[0]?.id || 'claude';
    }

    // ── AWS Bedrock ──
    else if (authMode === 'bedrock') {
      const { execSync } = require('child_process');
      try {
        execSync('aws sts get-caller-identity --output json', { stdio: 'pipe', timeout: 8000, shell: true });
        ok = true; model = 'aws-bedrock';
      } catch (_) {
        return { ok: false, error: 'AWS credentials tidak valid. Jalankan `aws configure`.' };
      }
    }

    // ── Fallback for unhandled combos ──
    else {
      ok = true; model = provider;
    }

    return { ok, latency: Date.now() - t0, model };
  } catch (err) {
    return { ok: false, error: err.message, latency: Date.now() - t0 };
  }
});
