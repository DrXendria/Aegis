const BRIDGE_BASE = 'http://127.0.0.1:41937';

async function getToken() {
  const { aegisToken = '' } = await chrome.storage.local.get('aegisToken');
  return aegisToken.trim();
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

async function updateBadgeForTab(tabId, url) {
  try {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
      await chrome.action.setBadgeText({ tabId, text: '' });
      return;
    }
    const host = new URL(url).hostname;
    const res = await bridgeFetch(`/match?host=${encodeURIComponent(host)}`);
    if (res.ok && Array.isArray(res.data?.entries) && res.data.entries.length > 0) {
      await chrome.action.setBadgeText({ tabId, text: String(res.data.entries.length) });
      await chrome.action.setBadgeBackgroundColor({ tabId, color: '#10b981' });
    } else {
      await chrome.action.setBadgeText({ tabId, text: '' });
    }
  } catch {
    await chrome.action.setBadgeText({ tabId, text: '' }).catch(() => {});
  }
}

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab?.url) {
    await updateBadgeForTab(tabId, tab.url);
  }
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  try {
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
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_MATCH') {
        const res = await bridgeFetch(`/match?host=${encodeURIComponent(message.host || '')}`);
        sendResponse(res);
        return;
      }

      if (message.type === 'BRIDGE_SEARCH') {
        const res = await bridgeFetch(`/search?q=${encodeURIComponent(message.query || '')}`);
        sendResponse(res);
        return;
      }

      if (message.type === 'PENDING_SAVE_SET') {
        const tabId = sender.tab?.id ?? null;
        if (tabId !== null && message.title && message.password) {
          await chrome.storage.session.set({
            pendingSave: {
              tabId,
              title: message.title,
              username: message.username || '',
              password: message.password,
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
        if (
          pendingSave &&
          pendingSave.tabId === tabId &&
          pendingSave.expiresAt > Date.now()
        ) {
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

      if (message.type === 'BRIDGE_SAVE') {
        const res = await bridgeFetch('/save', {
          method: 'POST',
          body: JSON.stringify({
            title: message.title,
            username: message.username,
            password: message.password,
          }),
        });
        if (res.ok) {
          await chrome.storage.session.remove('pendingSave');
          if (sender.tab?.id && sender.tab?.url) {
            await updateBadgeForTab(sender.tab.id, sender.tab.url);
          }
        }
        sendResponse(res);
        return;
      }

      if (message.type === 'SET_TOKEN') {
        await chrome.storage.local.set({ aegisToken: (message.token || '').trim() });
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
