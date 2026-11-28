const statusPill = document.getElementById('status-pill');
const settingsBtn = document.getElementById('settings-btn');
const pairingPanel = document.getElementById('pairing-panel');
const mainPanel = document.getElementById('main-panel');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDesc = document.getElementById('empty-desc');
const retryBtn = document.getElementById('retry-btn');

const tokenInput = document.getElementById('token-input');
const saveTokenBtn = document.getElementById('save-token-btn');
const cancelTokenBtn = document.getElementById('cancel-token-btn');
const pairingError = document.getElementById('pairing-error');

const searchInput = document.getElementById('search-input');
const siteLabel = document.getElementById('site-label');
const entriesList = document.getElementById('entries-list');
const genBtn = document.getElementById('gen-btn');

let currentTab = null;
let currentHost = '';

function setPill(text, styleClass) {
  statusPill.textContent = text;
  statusPill.className = `pill ${styleClass}`;
}

function showOnly(panel) {
  pairingPanel.classList.add('hidden');
  mainPanel.classList.add('hidden');
  emptyState.classList.add('hidden');
  panel.classList.remove('hidden');
}

function generateStrongPassword(length = 20) {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_+=';
  const random = new Uint32Array(length);
  crypto.getRandomValues(random);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += charset[random[i] % charset.length];
  }
  return out;
}

function renderEntries(entries, emptyMessage) {
  entriesList.textContent = '';
  if (!entries || entries.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-list';
    empty.textContent = emptyMessage;
    entriesList.appendChild(empty);
    return;
  }

  for (const entry of entries) {
    const card = document.createElement('div');
    card.className = 'entry-card';

    const meta = document.createElement('div');
    meta.className = 'entry-meta';

    const title = document.createElement('div');
    title.className = 'entry-title';
    title.textContent = entry.title;

    const user = document.createElement('div');
    user.className = 'entry-user';
    user.textContent = entry.username || '—';

    meta.appendChild(title);
    meta.appendChild(user);

    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const fillBtn = document.createElement('button');
    fillBtn.type = 'button';
    fillBtn.className = 'mini-btn fill';
    fillBtn.textContent = 'Fill';
    fillBtn.addEventListener('click', async () => {
      if (!currentTab?.id) return;
      try {
        await chrome.tabs.sendMessage(currentTab.id, {
          type: 'AEGIS_FILL',
          username: entry.username,
          password: entry.password,
        });
        fillBtn.textContent = 'Filled';
        setTimeout(() => window.close(), 350);
      } catch {
        fillBtn.textContent = 'Reload tab';
      }
    });

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'mini-btn';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(entry.password);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1400);
    });

    actions.appendChild(fillBtn);
    actions.appendChild(copyBtn);

    card.appendChild(meta);
    card.appendChild(actions);
    entriesList.appendChild(card);
  }
}

async function loadMatchingEntries() {
  siteLabel.textContent = currentHost ? `Matching ${currentHost}` : 'Unlocked vault';
  const res = await chrome.runtime.sendMessage({
    type: 'BRIDGE_MATCH',
    host: currentHost,
  });

  if (res?.status === 401) {
    setPill('Pair needed', 'pill-warn');
    pairingError.textContent = 'Invalid pairing token. Copy the current token from Aegis Desktop → Profile.';
    pairingError.classList.remove('hidden');
    showOnly(pairingPanel);
    return;
  }

  if (res?.status === 423) {
    setPill('Locked', 'pill-warn');
    emptyTitle.textContent = 'Vault is locked';
    emptyDesc.textContent = 'Unlock your vault in Aegis Desktop, then click Retry.';
    showOnly(emptyState);
    return;
  }

  if (!res?.ok) {
    setPill('Offline', 'pill-muted');
    emptyTitle.textContent = 'Aegis Desktop is offline';
    emptyDesc.textContent = 'Launch Aegis Vault on your computer and unlock your vault to autofill passwords.';
    showOnly(emptyState);
    return;
  }

  setPill('Unlocked', 'pill-ok');
  showOnly(mainPanel);
  const total = res.data?.total ?? 0;
  renderEntries(
    res.data?.entries || [],
    currentHost
      ? `No saved logins matched "${currentHost}" (${total} password${total === 1 ? '' : 's'} synced). Use search above to pick any entry.`
      : `Use search above to find a saved login (${total} synced).`
  );
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab || null;
  if (tab?.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    currentHost = new URL(tab.url).hostname.replace(/^www\./, '');
  }

  const health = await chrome.runtime.sendMessage({ type: 'BRIDGE_HEALTH' });
  if (!health?.ok) {
    setPill('Offline', 'pill-muted');
    emptyTitle.textContent = 'Aegis Desktop is offline';
    emptyDesc.textContent = 'Start Aegis Vault on your computer and unlock your vault.';
    showOnly(emptyState);
    return;
  }

  if (!health.data?.unlocked) {
    setPill('Locked', 'pill-warn');
    emptyTitle.textContent = 'Vault is locked';
    emptyDesc.textContent = 'Enter your Master Password in Aegis Desktop to enable autofill.';
    showOnly(emptyState);
    return;
  }

  const tokenRes = await chrome.runtime.sendMessage({ type: 'GET_TOKEN' });
  if (!tokenRes?.token) {
    setPill('Pair needed', 'pill-warn');
    pairingError.classList.add('hidden');
    showOnly(pairingPanel);
    return;
  }

  await loadMatchingEntries();
}

settingsBtn.addEventListener('click', async () => {
  const tokenRes = await chrome.runtime.sendMessage({ type: 'GET_TOKEN' });
  tokenInput.value = tokenRes?.token || '';
  pairingError.classList.add('hidden');
  showOnly(pairingPanel);
});

cancelTokenBtn.addEventListener('click', async () => {
  await init();
});

saveTokenBtn.addEventListener('click', async () => {
  const token = tokenInput.value.trim();
  if (token.length < 16) {
    pairingError.textContent = 'Please paste the full pairing token from Aegis Desktop.';
    pairingError.classList.remove('hidden');
    return;
  }
  await chrome.runtime.sendMessage({ type: 'SET_TOKEN', token });
  await init();
});

retryBtn.addEventListener('click', async () => {
  await init();
});

searchInput.addEventListener('input', async () => {
  const q = searchInput.value.trim();
  if (!q) {
    await loadMatchingEntries();
    return;
  }
  siteLabel.textContent = `Search results for "${q}"`;
  const res = await chrome.runtime.sendMessage({ type: 'BRIDGE_SEARCH', query: q });
  if (res?.ok) {
    renderEntries(res.data?.entries || [], `No entries matching "${q}".`);
  }
});

genBtn.addEventListener('click', async () => {
  const pw = generateStrongPassword(20);
  await navigator.clipboard.writeText(pw);
  if (currentTab?.id) {
    try {
      await chrome.tabs.sendMessage(currentTab.id, {
        type: 'AEGIS_FILL_PASSWORD',
        password: pw,
      });
    } catch {
      // No password field on current tab; clipboard still has it
    }
  }
  genBtn.textContent = 'Copied to clipboard!';
  setTimeout(() => {
    genBtn.textContent = 'Generate & Copy 20-char Password';
  }, 1500);
});

init();
