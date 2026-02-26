/**
 * electron/handlers/webhook.js
 * Webhook integration for F19 - notify external services when clips are rendered/posted
 */
const { ipcMain } = require('electron');
const keytar = require('keytar');

const SERVICE_NAME = 'AutoClipperApp';
const FETCH_TIMEOUT_MS = 10000; // 10 second timeout for webhook calls

ipcMain.handle('webhook:getConfig', async () => {
  try {
    const url = await keytar.getPassword(SERVICE_NAME, 'webhook_url') || '';
    const enabled = await keytar.getPassword(SERVICE_NAME, 'webhook_enabled') || 'false';
    return { success: true, url, enabled: enabled === 'true' };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('webhook:setConfig', async (_, { url, enabled }) => {
  try {
    if (url && !url.startsWith('http')) throw new Error('Webhook URL must start with http:// or https://');
    await keytar.setPassword(SERVICE_NAME, 'webhook_url', url || '');
    await keytar.setPassword(SERVICE_NAME, 'webhook_enabled', String(!!enabled));
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
});

ipcMain.handle('webhook:send', async (_, { event, data }) => {
  try {
    if (!event) throw new Error('event is required');

    const url = await keytar.getPassword(SERVICE_NAME, 'webhook_url');
    const enabled = await keytar.getPassword(SERVICE_NAME, 'webhook_enabled');
    
    if (!url) return { success: false, error: 'Webhook URL not configured' };
    if (enabled !== 'true') return { success: false, error: 'Webhook is disabled' };

    const payload = {
      event,
      data: data || {},
      timestamp: new Date().toISOString(),
      source: 'AutoClipper',
    };

    // AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AutoClipper-Event': event,
          'User-Agent': 'AutoClipper/1.0',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn(`[Webhook] Non-OK response ${res.status}: ${body}`);
    }

    return { success: res.ok, status: res.status };
  } catch (e) {
    if (e.name === 'AbortError') {
      console.error('[Webhook] Request timed out after', FETCH_TIMEOUT_MS, 'ms');
      return { success: false, error: `Request timed out after ${FETCH_TIMEOUT_MS / 1000}s` };
    }
    console.error('[Webhook]', e.message);
    return { success: false, error: e.message };
  }
});
