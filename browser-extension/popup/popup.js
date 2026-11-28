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

const tabLogins = document.getElementById('tab-logins');
const tabCards = document.getElementById('tab-cards');
const tabSub = document.getElementById('tab-sub');
const viewLogins = document.getElementById('view-logins');
const viewCards = document.getElementById('view-cards');
const viewSub = document.getElementById('view-sub');

const searchInput = document.getElementById('search-input');
const siteLabel = document.getElementById('site-label');
const entriesList = document.getElementById('entries-list');
const cardsList = document.getElementById('cards-list');
const genBtn = document.getElementById('gen-btn');

const subTitle = document.getElementById('sub-title');
const subCost = document.getElementById('sub-cost');
const subCurrency = document.getElementById('sub-currency');
const subDate = document.getElementById('sub-date');
const subSaveBtn = document.getElementById('sub-save-btn');
const subMsg = document.getElementById('sub-msg');

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

function switchTab(which) {
  for (const [btn, view, name] of [
    [tabLogins, viewLogins, 'logins'],
    [tabCards, viewCards, 'cards'],
    [tabSub, viewSub, 'sub'],
  ]) {
    btn.classList.toggle('active', name === which);
    view.classList.toggle('hidden', name !== which);
  }
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

function renderCards(cards) {
  cardsList.textContent = '';
  if (!cards || cards.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-list';
    empty.textContent = 'No credit cards saved in Aegis Vault yet.';
    cardsList.appendChild(empty);
    return;
  }

  for (const c of cards) {
    const row = document.createElement('div');
    row.className = 'entry-card';

    const meta = document.createElement('div');
    meta.className = 'entry-meta';

    const title = document.createElement('div');
    title.className = 'entry-title';
    title.textContent = c.title;

    const last4 = (c.number || '').replace(/\D/g, '').slice(-4);
    const sub = document.createElement('div');
    sub.className = 'entry-user';
    sub.textContent = `•••• ${last4}${c.expiry ? ` • ${c.expiry}` : ''}`;

    meta.appendChild(title);
    meta.appendChild(sub);

    const actions = document.createElement('div');
    actions.className = 'entry-actions';

    const fillBtn = document.createElement('button');
    fillBtn.type = 'button';
    fillBtn.className = 'mini-btn fill';
    fillBtn.textContent = 'Fill';
    fillBtn.addEventListener('click', async () => {
      if (!currentTab?.id) return;
      try {
        await chrome.tabs.sendMessage(currentTab.id, { type: 'AEGIS_FILL_CARD', card: c });
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
      await navigator.clipboard.writeText(c.number);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1400);
    });

    actions.appendChild(fillBtn);
    actions.appendChild(copyBtn);
    row.appendChild(meta);
    row.appendChild(actions);
    cardsList.appendChild(row);
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

  setPill(res.offline ? 'Offline Ready' : 'Unlocked', 'pill-ok');
  showOnly(mainPanel);
  const total = res.data?.total ?? 0;
  renderEntries(
    res.data?.entries || [],
    currentHost
      ? `No saved logins matched "${currentHost}" (${total} password${total === 1 ? '' : 's'} synced). Use search above to pick any entry.`
      : `Use search above to find a saved login (${total} synced).`
  );
}

async function loadCards() {
  const res = await chrome.runtime.sendMessage({ type: 'BRIDGE_CARDS' });
  if (res?.ok) {
    renderCards(res.data?.cards || []);
  }
}

async function prefillSubscriptionForm() {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  subDate.value = nextMonth.toISOString().split('T')[0];

  if (currentHost) {
    const parts = currentHost.split('.');
    const stem = parts.length >= 2 ? parts[parts.length - 2] : currentHost;
    subTitle.value = stem.charAt(0).toUpperCase() + stem.slice(1);
  }

  if (currentTab?.id) {
    try {
      const info = await chrome.tabs.sendMessage(currentTab.id, { type: 'AEGIS_DETECT_SUB' });
      if (info?.siteName) subTitle.value = info.siteName;
      if (info?.detected?.cost) subCost.value = info.detected.cost;
      if (info?.detected?.currency) subCurrency.value = info.detected.currency;
    } catch {
      // Tab without content script
    }
  }
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab || null;
  if (tab?.url && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    currentHost = new URL(tab.url).hostname.replace(/^www\./, '');
  }

  const health = await chrome.runtime.sendMessage({ type: 'BRIDGE_HEALTH' });
  const tokenRes = await chrome.runtime.sendMessage({ type: 'GET_TOKEN' });

  if (!tokenRes?.token) {
    if (!health?.ok) {
      setPill('Offline', 'pill-muted');
      emptyTitle.textContent = 'Aegis Desktop is offline';
      emptyDesc.textContent = 'Start Aegis Vault on your computer once to pair your browser.';
      showOnly(emptyState);
      return;
    }
    setPill('Pair needed', 'pill-warn');
    pairingError.classList.add('hidden');
    showOnly(pairingPanel);
    return;
  }

  if (!health?.ok) {
    if (health?.offlineAvailable) {
      setPill('Offline Ready', 'pill-ok');
      await loadMatchingEntries();
      return;
    }
    setPill('Offline', 'pill-muted');
    emptyTitle.textContent = 'Aegis Desktop is offline';
    emptyDesc.textContent = 'Open Aegis Vault once to sync your encrypted offline cache.';
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

  await loadMatchingEntries();
}

tabLogins.addEventListener('click', () => switchTab('logins'));
tabCards.addEventListener('click', async () => {
  switchTab('cards');
  await loadCards();
});
tabSub.addEventListener('click', async () => {
  switchTab('sub');
  await prefillSubscriptionForm();
});

viewSub.addEventListener('submit', async (e) => {
  e.preventDefault();
  subSaveBtn.disabled = true;
  subSaveBtn.textContent = 'Saving...';
  subMsg.classList.add('hidden');
  const res = await chrome.runtime.sendMessage({
    type: 'BRIDGE_SAVE_SUBSCRIPTION',
    title: subTitle.value.trim(),
    cost: subCost.value.trim(),
    currency: subCurrency.value,
    renewalDate: subDate.value || '',
  });
  subSaveBtn.disabled = false;
  subSaveBtn.textContent = 'Save to Aegis Subscriptions';
  subMsg.textContent = res?.ok ? 'Saved to Aegis Subscriptions!' : 'Could not save subscription.';
  subMsg.classList.remove('hidden');
});

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
      // No password field on current tab
    }
  }
  genBtn.textContent = 'Copied to clipboard!';
  setTimeout(() => {
    genBtn.textContent = 'Generate & Copy 20-char Password';
  }, 1500);
});

init();
