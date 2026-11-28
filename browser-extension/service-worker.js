const BRIDGE_BASE = 'http://127.0.0.1:41937';
const SYNC_ALARM_NAME = 'aegis-queue-sync';

async function getToken() {
  const { aegisToken = '' } = await chrome.storage.local.get('aegisToken');
  return aegisToken.trim();
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function base64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveCacheKey(token) {
  const enc = new TextEncoder();
  const keyMat = await crypto.subtle.importKey('raw', enc.encode(token), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: enc.encode('aegis-ext-offline-cache-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMat,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptLocalJsonWithKey(obj, key) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(obj));
  const buf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
  return { ciphertext: bytesToBase64(new Uint8Array(buf)), iv: bytesToBase64(iv) };
}

async function decryptLocalJsonWithKey(blob, key) {
  if (!blob?.ciphertext || !blob?.iv) return null;
  try {
    const buf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: base64ToBytes(blob.iv) },
      key,
      base64ToBytes(blob.ciphertext)
    );
    return JSON.parse(new TextDecoder().decode(buf));
  } catch {
    return null;
  }
}

async function loadOfflineCache() {
  const token = await getToken();
  if (!token) return null;
  const { encryptedOfflineCache } = await chrome.storage.local.get('encryptedOfflineCache');
  if (!encryptedOfflineCache) return null;
  const key = await deriveCacheKey(token);
  return decryptLocalJsonWithKey(encryptedOfflineCache, key);
}

async function saveOfflineCache(entries, cards) {
  const token = await getToken();
  if (!token) return;
  const key = await deriveCacheKey(token);
  const blob = await encryptLocalJsonWithKey(
    { entries: entries || [], cards: cards || [], syncedAt: Date.now() },
    key
  );
  await chrome.storage.local.set({ encryptedOfflineCache: blob });
}

async function loadOfflineQueue() {
  const token = await getToken();
  if (!token) return [];
  const { encryptedOfflineQueue } = await chrome.storage.local.get('encryptedOfflineQueue');
  if (!encryptedOfflineQueue) return [];
  const key = await deriveCacheKey(token);
  const parsed = await decryptLocalJsonWithKey(encryptedOfflineQueue, key);
  return Array.isArray(parsed) ? parsed : [];
}

async function saveOfflineQueue(queue) {
  const token = await getToken();
  if (!token) return;
  if (!queue || queue.length === 0) {
    await chrome.storage.local.remove('encryptedOfflineQueue');
    try {
      await chrome.alarms?.clear(SYNC_ALARM_NAME);
    } catch {
      // Ignore if alarms unavailable
    }
    return;
  }
  const key = await deriveCacheKey(token);
  const blob = await encryptLocalJsonWithKey(queue, key);
  await chrome.storage.local.set({ encryptedOfflineQueue: blob });
  try {
    chrome.alarms?.create(SYNC_ALARM_NAME, { periodInMinutes: 1 });
  } catch {
    // Ignore if alarms unavailable
  }
  ensureFastSyncPoll();
}

function domainMatches(entryTitle, host) {
  const hostClean = (host || '').trim().toLowerCase().replace(/^www\./, '');
  if (!hostClean) return false;
  const titleLower = (entryTitle || '').toLowerCase();
  if (titleLower.includes(hostClean) || (hostClean.includes(titleLower) && titleLower.length >= 3)) {
    return true;
  }
  const parts = hostClean.split('.');
  if (parts.length >= 2) {
    const stem = parts[parts.length - 2];
    if (stem.length >= 3 && titleLower.includes(stem)) return true;
  }
  return false;
}

async function bridgeFetch(path, options = {}) {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'X-Aegis-Token': token } : {}),
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(`${BRIDGE_BASE}${path}`, {
      ...options,
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: { error: 'Aegis Desktop is not running' } };
  }
}

async function refreshOfflineSnapshot() {
  const [entriesRes, cardsRes] = await Promise.all([
    bridgeFetch('/search?q='),
    bridgeFetch('/cards'),
  ]);
  if (entriesRes.ok && cardsRes.ok) {
    await saveOfflineCache(entriesRes.data?.entries || [], cardsRes.data?.cards || []);
  }
}

let flushInProgress = false;

async function flushOfflineQueueIfOnline() {
  if (flushInProgress) return false;
  flushInProgress = true;
  try {
    const queue = await loadOfflineQueue();
    if (queue.length === 0) return false;

    const health = await bridgeFetch('/health');
    if (!health.ok || !health.data?.unlocked) return false;

    const remaining = [];
    // Send sequentially so Aegis Desktop atomic saves never race each other
    for (const item of queue) {
      let endpoint = '/save';
      if (item.kind === 'card') endpoint = '/save-card';
      else if (item.kind === 'subscription') endpoint = '/save-subscription';

      const res = await bridgeFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(item.body),
      });
      if (!res.ok) {
        remaining.push(item);
      } else {
        await new Promise((r) => setTimeout(r, 120));
      }
    }

    await saveOfflineQueue(remaining);
    if (remaining.length === 0) {
      await refreshOfflineSnapshot();
    }
    return remaining.length === 0;
  } finally {
    flushInProgress = false;
  }
}

let fastPollTimer = null;
function ensureFastSyncPoll() {
  if (fastPollTimer) return;
  let ticks = 0;
  fastPollTimer = setInterval(async () => {
    ticks += 1;
    const queue = await loadOfflineQueue();
    if (queue.length === 0 || ticks > 90) {
      clearInterval(fastPollTimer);
      fastPollTimer = null;
      return;
    }
    await flushOfflineQueueIfOnline();
  }, 2000);
}

async function enqueueOfflineSave(kind, body) {
  const token = await getToken();
  if (!token) {
    throw new Error('NOT_PAIRED');
  }
  const key = await deriveCacheKey(token);
  const { encryptedOfflineQueue, encryptedOfflineCache } = await chrome.storage.local.get([
    'encryptedOfflineQueue',
    'encryptedOfflineCache',
  ]);

  const queueRaw = await decryptLocalJsonWithKey(encryptedOfflineQueue, key);
  const queue = Array.isArray(queueRaw) ? queueRaw : [];
  queue.push({ kind, body, createdAt: Date.now() });

  const cacheRaw = await decryptLocalJsonWithKey(encryptedOfflineCache, key);
  const cache = cacheRaw && typeof cacheRaw === 'object'
    ? { entries: cacheRaw.entries || [], cards: cacheRaw.cards || [] }
    : { entries: [], cards: [] };

  if (kind === 'password') {
    cache.entries.unshift({
      id: `offline_${Date.now()}`,
      title: body.title,
      username: body.username || '',
      password: body.password,
      category: 'social',
    });
  } else if (kind === 'card') {
    cache.cards.unshift({
      id: `offline_${Date.now()}`,
      title: body.title,
      number: body.number,
      expiry: body.expiry || '',
      cvv: body.cvv || '',
    });
  }

  const [queueBlob, cacheBlob] = await Promise.all([
    encryptLocalJsonWithKey(queue, key),
    encryptLocalJsonWithKey({ ...cache, syncedAt: Date.now() }, key),
  ]);

  await chrome.storage.local.set({
    encryptedOfflineQueue: queueBlob,
    encryptedOfflineCache: cacheBlob,
  });

  try {
    chrome.alarms?.create(SYNC_ALARM_NAME, { periodInMinutes: 1 });
  } catch {
    // Ignore if alarms unavailable
  }
  ensureFastSyncPoll();
}

async function updateBadgeForTab(tabId, url) {
  try {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      await chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }
    const host = new URL(url).hostname;
    const res = await bridgeFetch(`/match?host=${encodeURIComponent(host)}`);
    let count = 0;
    if (res.ok && Array.isArray(res.data?.entries)) {
      count = res.data.entries.length;
    } else if (res.status === 0) {
      const cache = await loadOfflineCache();
      if (cache?.entries) {
        count = cache.entries.filter((e) => domainMatches(e.title, host)).length;
      }
    }
    if (count > 0) {
      await chrome.action.setBadgeText({ tabId, text: String(count) });
      await chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' });
    } else {
      await chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch {
    await chrome.action.setBadgeText({ tabId, text: '' }).catch(() => {});
  }
}

if (chrome.windows?.onFocusChanged) {
  chrome.windows.onFocusChanged.addListener(async () => {
    await flushOfflineQueueIfOnline();
  });
}

if (chrome.alarms?.onAlarm) {
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === SYNC_ALARM_NAME) {
      await flushOfflineQueueIfOnline();
    }
  });
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab?.url) {
    await flushOfflineQueueIfOnline();
    await updateBadgeForTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
    await flushOfflineQueueIfOnline();
    const tab = await chrome.tabs.get(tabId);
    if (tab?.url) {
      await updateBadgeForTab(tabId, tab.url);
    }
  } catch {
    // Tab closed
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      if (message.type === 'BRIDGE_HEALTH') {
        const res = await bridgeFetch('/health');
        if (res.ok && res.data?.unlocked) {
          await flushOfflineQueueIfOnline();
          await refreshOfflineSnapshot();
          sendResponse({ ...res, offlineAvailable: false });
          return;
        }
        const cache = await loadOfflineCache();
        const queue = await loadOfflineQueue();
        sendResponse({
          ...res,
          offlineAvailable: Boolean(cache),
          pendingSyncCount: queue.length,
        });
        return;
      }

      if (message.type === 'BRIDGE_MATCH') {
        const host = message.host || '';
        const res = await bridgeFetch(`/match?host=${encodeURIComponent(host)}`);
        if (res.ok) {
          void flushOfflineQueueIfOnline();
          sendResponse(res);
          return;
        }
        if (res.status === 0) {
          const cache = await loadOfflineCache();
          if (cache) {
            const entries = (cache.entries || []).filter((e) => domainMatches(e.title, host));
            sendResponse({
              ok: true,
              status: 200,
              offline: true,
              data: { ok: true, host, total: cache.entries.length, entries },
            });
            return;
          }
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_SEARCH') {
        const q = (message.query || '').toLowerCase();
        const res = await bridgeFetch(`/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          sendResponse(res);
          return;
        }
        if (res.status === 0) {
          const cache = await loadOfflineCache();
          if (cache) {
            const entries = (cache.entries || [])
              .filter(
                (e) =>
                  !q ||
                  (e.title || '').toLowerCase().includes(q) ||
                  (e.username || '').toLowerCase().includes(q)
              )
              .slice(0, 25);
            sendResponse({ ok: true, status: 200, offline: true, data: { ok: true, entries } });
            return;
          }
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_CARDS') {
        const res = await bridgeFetch('/cards');
        if (res.ok) {
          sendResponse(res);
          return;
        }
        if (res.status === 0) {
          const cache = await loadOfflineCache();
          if (cache) {
            sendResponse({
              ok: true,
              status: 200,
              offline: true,
              data: { ok: true, cards: cache.cards || [] },
            });
            return;
          }
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_SAVE') {
        const body = {
          title: message.title,
          username: message.username,
          password: message.password,
        };
        const res = await bridgeFetch('/save', { method: 'POST', body: JSON.stringify(body) });
        if (res.ok) {
          await chrome.storage.session.remove('pendingSave');
          await refreshOfflineSnapshot();
          if (sender.tab?.id && sender.tab?.url) {
            await updateBadgeForTab(sender.tab.id, sender.tab.url);
          }
          sendResponse(res);
          return;
        }
        if (res.status === 0 && (await getToken())) {
          await enqueueOfflineSave('password', body);
          await chrome.storage.session.remove('pendingSave');
          if (sender.tab?.id && sender.tab?.url) {
            await updateBadgeForTab(sender.tab.id, sender.tab.url);
          }
          sendResponse({ ok: true, queued: true });
          return;
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_SAVE_CARD') {
        const body = {
          title: message.title,
          number: message.number,
          expiry: message.expiry || '',
          cvv: message.cvv || '',
        };
        const res = await bridgeFetch('/save-card', { method: 'POST', body: JSON.stringify(body) });
        if (res.ok) {
          await chrome.storage.session.remove('pendingSave');
          await refreshOfflineSnapshot();
          sendResponse(res);
          return;
        }
        if (res.status === 0 && (await getToken())) {
          await enqueueOfflineSave('card', body);
          await chrome.storage.session.remove('pendingSave');
          sendResponse({ ok: true, queued: true });
          return;
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_SAVE_SUBSCRIPTION') {
        const body = {
          title: message.title,
          cost: message.cost,
          currency: message.currency || 'USD',
          renewal_date: message.renewalDate || null,
          payment_method: message.paymentMethod || null,
        };
        const res = await bridgeFetch('/save-subscription', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        if (res.ok) {
          await chrome.storage.session.remove('pendingSave');
          sendResponse(res);
          return;
        }
        if (res.status === 0 && (await getToken())) {
          await enqueueOfflineSave('subscription', body);
          await chrome.storage.session.remove('pendingSave');
          sendResponse({ ok: true, queued: true });
          return;
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'PENDING_SAVE_SET') {
        const tabId = sender.tab?.id ?? null;
        if (tabId !== null && message.payload) {
          await chrome.storage.session.set({
            pendingSave: {
              tabId,
              kind: message.kind || 'password',
              payload: message.payload,
              expiresAt: Date.now() + 3 * 60 * 1000,
            },
          });
        }
        sendResponse({ ok: true });
        return;
      }

      if (message.type === 'PENDING_SAVE_GET') {
        const tabId = sender.tab?.id ?? null;
        const { pendingSave } = await chrome.storage.session.get('pendingSave');
        if (pendingSave && pendingSave.tabId === tabId && pendingSave.expiresAt > Date.now()) {
          sendResponse({ ok: true, pendingSave });
        } else {
          if (pendingSave && pendingSave.expiresAt <= Date.now()) {
            await chrome.storage.session.remove('pendingSave');
          }
          sendResponse({ ok: true, pendingSave: null });
        }
        return;
      }

      if (message.type === 'PENDING_SAVE_CLEAR') {
        await chrome.storage.session.remove('pendingSave');
        sendResponse({ ok: true });
        return;
      }

      if (message.type === 'SET_TOKEN') {
        await chrome.storage.local.set({ aegisToken: (message.token || '').trim() });
        await refreshOfflineSnapshot();
        const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (activeTab?.id && activeTab?.url) {
          await updateBadgeForTab(activeTab.id, activeTab.url);
        }
        sendResponse({ ok: true });
        return;
      }

      if (message.type === 'GET_TOKEN') {
        const token = await getToken();
        sendResponse({ ok: true, token });
        return;
      }

      sendResponse({ ok: false, error: 'Unknown message type' });
    } catch (err) {
      sendResponse({ ok: false, error: String(err) });
    }
  })();
  return true;
});
