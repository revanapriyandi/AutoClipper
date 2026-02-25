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
