(() => {
  const BANNER_HOST_ID = 'aegis-vault-save-host';
  const AUTOFILL_HOST_ID = 'aegis-vault-autofill-host';

  let cachedMatches = [];
  let matchesLoadedForHost = '';

  function getHost() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function setNativeValue(input, value) {
    const prototype = Object.getPrototypeOf(input);
    const descriptor =
      Object.getOwnPropertyDescriptor(prototype, 'value') ||
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(input, value);
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
  }

  function findCredentialInputs(root = document) {
    const passwordInputs = Array.from(root.querySelectorAll('input[type="password"]')).filter(isVisible);
    const passwordInput = passwordInputs[0] || null;

    let usernameInput = null;
    if (passwordInput) {
      const form = passwordInput.closest('form') || document;
      const candidates = Array.from(
        form.querySelectorAll(
          'input[type="email"], input[type="text"], input[type="tel"], input:not([type])'
        )
      ).filter((el) => isVisible(el) && !el.readOnly && !el.disabled);

      const scored = candidates.map((el) => {
        const hint = `${el.name} ${el.id} ${el.autocomplete} ${el.placeholder}`.toLowerCase();
        let score = 0;
        if (el.type === 'email' || hint.includes('email') || hint.includes('user') || hint.includes('login')) {
          score += 5;
        }
        if (el.compareDocumentPosition(passwordInput) & Node.DOCUMENT_POSITION_FOLLOWING) {
          score += 3;
        }
        return { el, score };
      });
      scored.sort((a, b) => b.score - a.score);
      usernameInput = scored[0]?.el || null;
    }

    return { usernameInput, passwordInput };
  }

  function fillCredentials(username, password) {
    const { usernameInput, passwordInput } = findCredentialInputs();
    let filled = false;

    if (usernameInput && username) {
      setNativeValue(usernameInput, username);
      filled = true;
    }
    if (passwordInput && password) {
      setNativeValue(passwordInput, password);
      filled = true;
    }
    hideAutofillMenu();
    return filled;
  }

  async function fetchMatchesForCurrentHost() {
    const host = getHost();
    if (!host) return [];

    try {
      const res = await chrome.runtime.sendMessage({
        type: 'BRIDGE_MATCH',
        host,
      });
      if (res?.ok && Array.isArray(res.data?.entries)) {
        cachedMatches = res.data.entries;
        matchesLoadedForHost = host;
        return cachedMatches;
      }
    } catch {
      // Bridge offline or extension reloading
    }
    return [];
  }

  function hideAutofillMenu() {
    const existing = document.getElementById(AUTOFILL_HOST_ID);
    if (existing) existing.remove();
  }

  function showAutofillMenu(anchorInput, entries) {
    if (!anchorInput || !entries || entries.length === 0) return;
    hideAutofillMenu();

    const rect = anchorInput.getBoundingClientRect();
    const host = document.createElement('div');
    host.id = AUTOFILL_HOST_ID;
    host.style.cssText = `
      position: fixed;
      top: ${Math.min(rect.bottom + 6, window.innerHeight - 220)}px;
      left: ${Math.max(8, Math.min(rect.left, window.innerWidth - 310))}px;
      width: ${Math.max(260, Math.min(rect.width, 340))}px;
      z-index: 2147483647;
    `;

    const shadow = host.attachShadow({ mode: 'closed' });
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <style>
        .menu {
          background: #0f1217;
          color: #f3f5f8;
          border: 1px solid #262e3a;
          border-radius: 10px;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #9aa4b2;
          background: #13171e;
          border-bottom: 1px solid #1f2631;
        }
        .header-left { display: flex; align-items: center; gap: 6px; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
        .close {
          background: none; border: none; color: #7c8796; cursor: pointer; font-size: 15px; padding: 0 2px;
        }
        .list { max-height: 180px; overflow-y: auto; }
        .item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          border-bottom: 1px solid #1a202a;
          padding: 9px 12px;
          color: #f3f5f8;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .item:last-child { border-bottom: none; }
        .item:hover { background: #171d26; }
        .title { font-size: 12.5px; font-weight: 600; }
        .user { font-size: 11.5px; color: #9aa4b2; }
      </style>
      <div class="menu">
        <div class="header">
          <span class="header-left"><span class="dot"></span>Aegis Vault</span>
          <button class="close" type="button" aria-label="Close">&times;</button>
        </div>
        <div class="list"></div>
      </div>
    `;

    wrap.querySelector('.close').addEventListener('click', (e) => {
      e.stopPropagation();
      hideAutofillMenu();
    });

    const list = wrap.querySelector('.list');
    for (const entry of entries) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';

      const titleEl = document.createElement('span');
      titleEl.className = 'title';
      titleEl.textContent = entry.title;

      const userEl = document.createElement('span');
      userEl.className = 'user';
      userEl.textContent = entry.username || 'Click to fill password';

      btn.appendChild(titleEl);
      btn.appendChild(userEl);
      btn.addEventListener('mousedown', (e) => {
        // Use mousedown so it runs before input blur
        e.preventDefault();
        fillCredentials(entry.username || '', entry.password || '');
      });
      list.appendChild(btn);
    }

    shadow.appendChild(wrap);
    document.documentElement.appendChild(host);
  }

  function showSavePrompt(siteTitle, username, password) {
    const existing = document.getElementById(BANNER_HOST_ID);
    if (existing) existing.remove();

    const host = document.createElement('div');
    host.id = BANNER_HOST_ID;
    host.style.cssText = 'position:fixed;top:16px;right:16px;z-index:2147483647;';
    const shadow = host.attachShadow({ mode: 'closed' });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <style>
        .card {
          width: 310px;
          background: #0f1217;
          color: #f3f5f8;
          border: 1px solid #262e3a;
          border-radius: 12px;
          padding: 14px 16px;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
        }
        .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
        .brand { font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; }
        .dot { width:8px; height:8px; border-radius:50%; background:#10b981; }
        .close { background:none; border:none; color:#9aa4b2; cursor:pointer; font-size:16px; padding:0 4px; }
        .desc { font-size:12.5px; color:#9aa4b2; margin:0 0 12px 0; line-height:1.45; }
        .desc strong { color:#f3f5f8; }
        .actions { display:flex; justify-content:flex-end; gap:8px; }
        button.btn {
          padding:7px 12px; border-radius:8px; font-size:12.5px; font-weight:500;
          cursor:pointer; border:1px solid #2a3340; background:#171c24; color:#f3f5f8;
        }
        button.btn.primary { background:#10b981; border-color:#10b981; color:#07120e; font-weight:600; }
      </style>
      <div class="card">
        <div class="head">
          <span class="brand"><span class="dot"></span>Aegis Vault</span>
          <button class="close" type="button" aria-label="Close">&times;</button>
        </div>
        <p class="desc">Save login for <strong></strong> (<span class="user"></span>) to your local Aegis vault?</p>
        <div class="actions">
          <button class="btn dismiss" type="button">Not now</button>
          <button class="btn primary save" type="button">Save</button>
        </div>
      </div>
    `;

    wrapper.querySelector('strong').textContent = siteTitle;
    wrapper.querySelector('.user').textContent = username || 'no username';

    const remove = () => host.remove();
    const dismiss = async () => {
      remove();
      try {
        await chrome.runtime.sendMessage({ type: 'PENDING_SAVE_CLEAR' });
      } catch {
        // Ignore
      }
    };
    wrapper.querySelector('.close').addEventListener('click', dismiss);
    wrapper.querySelector('.dismiss').addEventListener('click', dismiss);
    wrapper.querySelector('.save').addEventListener('click', async () => {
      const saveBtn = wrapper.querySelector('.save');
      saveBtn.textContent = 'Saving...';
      saveBtn.disabled = true;
      const res = await chrome.runtime.sendMessage({
        type: 'BRIDGE_SAVE',
        title: siteTitle,
        username,
        password,
      });
      if (res?.ok) {
        saveBtn.textContent = 'Saved';
        matchesLoadedForHost = '';
        setTimeout(remove, 900);
      } else {
        saveBtn.textContent = res?.status === 423 ? 'Unlock Aegis first' : 'Failed';
        saveBtn.disabled = false;
      }
    });

    shadow.appendChild(wrapper);
    document.documentElement.appendChild(host);
  }

  // On page load: check pending save prompt (post-redirect/2FA) and preload autofill matches
  (async () => {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'PENDING_SAVE_GET' });
      const pending = res?.pendingSave;
      if (pending && pending.title && pending.password) {
        showSavePrompt(pending.title, pending.username || '', pending.password);
      }
    } catch {
      // Extension context may be unavailable
    }

    const { usernameInput, passwordInput } = findCredentialInputs();
    if (passwordInput) {
      const matches = await fetchMatchesForCurrentHost();
      if (matches.length > 0) {
        const anchor =
          document.activeElement === usernameInput || document.activeElement === passwordInput
            ? document.activeElement
            : usernameInput || passwordInput;
        if (anchor) {
          showAutofillMenu(anchor, matches);
        }
      }
    }
  })();

  async function handleInputActivate(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const { usernameInput, passwordInput } = findCredentialInputs();
    if (target !== usernameInput && target !== passwordInput) {
      hideAutofillMenu();
      return;
    }
    const matches = await fetchMatchesForCurrentHost();
    if (matches.length > 0) {
      showAutofillMenu(target, matches);
    }
  }

  // Show inline Aegis Autofill dropdown on focus OR click (handles autofocused fields like GitHub)
  document.addEventListener('focusin', handleInputActivate, true);
  document.addEventListener('click', handleInputActivate, true);

  // Close autofill dropdown when clicking outside
  document.addEventListener(
    'mousedown',
    (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.id === AUTOFILL_HOST_ID) return;
      const { usernameInput, passwordInput } = findCredentialInputs();
      if (target === usernameInput || target === passwordInput) return;
      hideAutofillMenu();
    },
    true
  );

  // Detect form submission with password for Auto-Save (skip if already saved in Aegis)
  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const { usernameInput, passwordInput } = findCredentialInputs(form);
      if (!passwordInput || !passwordInput.value || passwordInput.value.length < 3) return;

      const host = getHost();
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput.value;

      // Skip asking if this exact credential is already saved in Aegis
      const alreadySaved = cachedMatches.some(
        (m) =>
          (m.username || '').trim().toLowerCase() === username.toLowerCase() &&
          m.password === password
      );
      if (alreadySaved) return;

      // Persist in session RAM so the prompt survives 2FA and post-login redirects
      chrome.runtime
        .sendMessage({
          type: 'PENDING_SAVE_SET',
          title: host,
          username,
          password,
        })
        .catch(() => {});

      setTimeout(() => {
        showSavePrompt(host, username, password);
      }, 250);
    },
    true
  );

  // Listen for Fill requests from the extension popup
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'AEGIS_FILL') {
      const ok = fillCredentials(message.username || '', message.password || '');
      sendResponse({ ok });
      return false;
    }
    if (message.type === 'AEGIS_FILL_PASSWORD') {
      const { passwordInput } = findCredentialInputs();
      if (passwordInput && message.password) {
        setNativeValue(passwordInput, message.password);
        sendResponse({ ok: true });
      } else {
        sendResponse({ ok: false });
      }
      return false;
    }
    return false;
  });
})();
