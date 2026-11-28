(() => {
  const BANNER_HOST_ID = 'aegis-vault-save-host';
  const AUTOFILL_HOST_ID = 'aegis-vault-autofill-host';

  const KNOWN_SUB_BRANDS = [
    'netflix', 'spotify', 'amazon', 'youtube', 'apple', 'disney', 'openai', 'chatgpt',
    'claude', 'anthropic', 'adobe', 'figma', 'notion', 'github', 'xbox', 'playstation',
    'steam', 'hbo', 'max', 'blutv', 'exxen', 'gain', 'mubi', 'dropbox', 'proton', 'canva', 'icloud',
  ];

  let cachedMatches = [];
  let cachedCards = [];

  function getHost() {
    return window.location.hostname.replace(/^www\./, '');
  }

  function getNiceSiteName() {
    const host = getHost();
    const parts = host.split('.');
    const stem = parts.length >= 2 ? parts[parts.length - 2] : host;
    return stem ? stem.charAt(0).toUpperCase() + stem.slice(1) : host;
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

  function isIgnoredPasswordField(input) {
    if (!input) return true;
    if (input.dataset.aegisIgnore === 'true' || input.closest('[data-aegis-ignore="true"]')) {
      return true;
    }
    const hint = `${input.name} ${input.id} ${input.placeholder} ${input.autocomplete}`.toLowerCase();
    return /\b(otp|2fa|totp|cvv|cvc|verification|captcha)\b/.test(hint);
  }

  function findCredentialInputs(root = document) {
    const passwordInputs = Array.from(root.querySelectorAll('input[type="password"]')).filter(
      (el) => isVisible(el) && !isIgnoredPasswordField(el)
    );
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

  function findCardInputs(root = document) {
    const inputs = Array.from(
      root.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"], input[type="password"], input:not([type])')
    ).filter((el) => isVisible(el) && !el.readOnly && !el.disabled);

    let numberInput = null;
    let expiryInput = null;
    let cvvInput = null;

    for (const el of inputs) {
      const hint = `${el.autocomplete} ${el.name} ${el.id} ${el.placeholder}`.toLowerCase();
      if (!numberInput && /(cc-number|card[-_\s]?num|cardnumber|kart\s*no|credit[-_\s]?card)/.test(hint)) {
        numberInput = el;
      } else if (!expiryInput && /(cc-exp|expir|exp[-_\s]?date|mm\s*\/\s*yy|son\s*kullan)/.test(hint)) {
        expiryInput = el;
      } else if (!cvvInput && /\b(cc-csc|cvv|cvc|csc|security[-_\s]?code)\b/.test(hint)) {
        cvvInput = el;
      }
    }

    return { numberInput, expiryInput, cvvInput };
  }

  function detectSubscriptionPrice() {
    const host = getHost().toLowerCase();
    const urlLower = window.location.href.toLowerCase();
    const isKnownBrand = KNOWN_SUB_BRANDS.some((b) => host.includes(b));
    const isCheckoutUrl = /(subscri|billing|checkout|plan|upgrade|membership|payment|abonelik|odeme)/.test(urlLower);
    if (!isKnownBrand && !isCheckoutUrl) return null;

    const text = (document.body?.innerText || '').slice(0, 8000);
    const patterns = [
      { re: /\$\s*(\d+(?:[.,]\d{1,2})?)/, currency: 'USD' },
      { re: /€\s*(\d+(?:[.,]\d{1,2})?)/, currency: 'EUR' },
      { re: /£\s*(\d+(?:[.,]\d{1,2})?)/, currency: 'GBP' },
      { re: /₺\s*(\d+(?:[.,]\d{1,2})?)/, currency: 'TRY' },
      { re: /(\d+(?:[.,]\d{1,2})?)\s*(?:TL|TRY|₺)/i, currency: 'TRY' },
      { re: /(\d+(?:[.,]\d{1,2})?)\s*USD/i, currency: 'USD' },
      { re: /(\d+(?:[.,]\d{1,2})?)\s*EUR/i, currency: 'EUR' },
    ];

    for (const p of patterns) {
      const m = text.match(p.re);
      if (m && m[1]) {
        const normalized = m[1].replace(',', '.');
        const num = parseFloat(normalized);
        if (!isNaN(num) && num > 0 && num < 50000) {
          return { cost: normalized, currency: p.currency };
        }
      }
    }
    return isKnownBrand && isCheckoutUrl ? { cost: '', currency: 'USD' } : null;
  }

  function nextMonthIsoDate() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
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

  function fillCard(card) {
    const { numberInput, expiryInput, cvvInput } = findCardInputs();
    let filled = false;
    if (numberInput && card.number) {
      setNativeValue(numberInput, card.number);
      filled = true;
    }
    if (expiryInput && card.expiry) {
      setNativeValue(expiryInput, card.expiry);
      filled = true;
    }
    if (cvvInput && card.cvv) {
      setNativeValue(cvvInput, card.cvv);
      filled = true;
    }
    hideAutofillMenu();
    return filled;
  }

  async function fetchMatchesForCurrentHost() {
    const host = getHost();
    if (!host) return [];
    try {
      const res = await chrome.runtime.sendMessage({ type: 'BRIDGE_MATCH', host });
      if (res?.ok && Array.isArray(res.data?.entries)) {
        cachedMatches = res.data.entries;
        return cachedMatches;
      }
    } catch {
      // Bridge offline
    }
    return [];
  }

  async function fetchCards() {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'BRIDGE_CARDS' });
      if (res?.ok && Array.isArray(res.data?.cards)) {
        cachedCards = res.data.cards;
        return cachedCards;
      }
    } catch {
      // Bridge offline
    }
    return [];
  }

  function hideAutofillMenu() {
    const existing = document.getElementById(AUTOFILL_HOST_ID);
    if (existing) existing.remove();
  }

  function showAutofillMenu(anchorInput, items, mode = 'password') {
    if (!anchorInput || !items || items.length === 0) return;
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
          background: #0f1217; color: #f3f5f8; border: 1px solid #262e3a;
          border-radius: 10px; overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.45);
        }
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 8px 12px; font-size: 11px; font-weight: 600;
          letter-spacing: 0.03em; text-transform: uppercase;
          color: #9aa4b2; background: #13171e; border-bottom: 1px solid #1f2631;
        }
        .header-left { display: flex; align-items: center; gap: 6px; }
        .dot { width: 7px; height: 7px; border-radius: 50%; background: #10b981; }
        .close { background: none; border: none; color: #7c8796; cursor: pointer; font-size: 15px; padding: 0 2px; }
        .list { max-height: 180px; overflow-y: auto; }
        .item {
          width: 100%; text-align: left; background: transparent; border: none;
          border-bottom: 1px solid #1a202a; padding: 9px 12px; color: #f3f5f8;
          cursor: pointer; display: flex; flex-direction: column; gap: 2px;
        }
        .item:last-child { border-bottom: none; }
        .item:hover { background: #171d26; }
        .title { font-size: 12.5px; font-weight: 600; }
        .sub { font-size: 11.5px; color: #9aa4b2; }
      </style>
      <div class="menu">
        <div class="header">
          <span class="header-left"><span class="dot"></span>${mode === 'card' ? 'Aegis Cards' : 'Aegis Vault'}</span>
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
    for (const item of items) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'item';

      const titleEl = document.createElement('span');
      titleEl.className = 'title';
      titleEl.textContent = item.title;

      const subEl = document.createElement('span');
      subEl.className = 'sub';
      if (mode === 'card') {
        const last4 = (item.number || '').replace(/\D/g, '').slice(-4);
        subEl.textContent = `•••• ${last4}${item.expiry ? `  •  ${item.expiry}` : ''}`;
      } else {
        subEl.textContent = item.username || 'Click to fill password';
      }

      btn.appendChild(titleEl);
      btn.appendChild(subEl);
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (mode === 'card') {
          fillCard(item);
        } else {
          fillCredentials(item.username || '', item.password || '');
        }
      });
      list.appendChild(btn);
    }

    shadow.appendChild(wrap);
    document.documentElement.appendChild(host);
  }

  function showSaveBanner(kind, payload) {
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
          width: 325px; background: #0f1217; color: #f3f5f8;
          border: 1px solid #262e3a; border-radius: 12px; padding: 14px 16px;
          font-family: system-ui, -apple-system, sans-serif;
          box-shadow: 0 12px 32px rgba(0,0,0,0.45);
        }
        .head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
        .brand { font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; }
        .dot { width:8px; height:8px; border-radius:50%; background:#10b981; }
        .close { background:none; border:none; color:#9aa4b2; cursor:pointer; font-size:16px; padding:0 4px; }
        .desc { font-size:12.5px; color:#9aa4b2; margin:0 0 12px 0; line-height:1.45; }
        .desc strong { color:#f3f5f8; }
        .sub-row { display:flex; gap:6px; margin-bottom:10px; }
        .sub-row input {
          flex:1; padding:6px 8px; border-radius:7px; border:1px solid #262e3a;
          background:#13171e; color:#f3f5f8; font-size:12px;
        }
        .actions { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; }
        button.btn {
          padding:7px 11px; border-radius:8px; font-size:12px; font-weight:500;
          cursor:pointer; border:1px solid #2a3340; background:#171c24; color:#f3f5f8;
        }
        button.btn.primary { background:#10b981; border-color:#10b981; color:#07120e; font-weight:600; }
      </style>
      <div class="card">
        <div class="head">
          <span class="brand"><span class="dot"></span>Aegis Vault</span>
          <button class="close" type="button" aria-label="Close">&times;</button>
        </div>
        <p class="desc"></p>
        <div class="extra"></div>
        <div class="actions">
          <button class="btn dismiss" type="button">Not now</button>
          <button class="btn primary save" type="button">Save</button>
        </div>
      </div>
    `;

    const descEl = wrapper.querySelector('.desc');
    const extraEl = wrapper.querySelector('.extra');
    const actionsEl = wrapper.querySelector('.actions');
    const saveBtn = wrapper.querySelector('.save');

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

    if (kind === 'password') {
      const siteStrong = document.createElement('strong');
      siteStrong.textContent = payload.title;
      if (payload.username) {
        descEl.append('Save login for ', siteStrong, ` (${payload.username}) to your local Aegis vault?`);
      } else {
        descEl.append('Save password for ', siteStrong, ' to your local Aegis vault?');
      }

      saveBtn.addEventListener('click', async () => {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        const res = await chrome.runtime.sendMessage({
          type: 'BRIDGE_SAVE',
          title: payload.title,
          username: payload.username,
          password: payload.password,
        });
        if (res?.ok) {
          saveBtn.textContent = 'Saved';
          setTimeout(remove, 900);
        } else {
          saveBtn.textContent = res?.status === 423 ? 'Unlock Aegis first' : 'Failed';
          saveBtn.disabled = false;
        }
      });
    } else if (kind === 'card') {
      const last4 = (payload.number || '').replace(/\D/g, '').slice(-4);
      const cardStrong = document.createElement('strong');
      cardStrong.textContent = `•••• ${last4}`;
      descEl.append('Save payment card ', cardStrong, ' to your local Aegis vault?');

      saveBtn.textContent = 'Save Card';
      saveBtn.addEventListener('click', async () => {
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;
        const res = await chrome.runtime.sendMessage({
          type: 'BRIDGE_SAVE_CARD',
          title: payload.title || `Card •••• ${last4}`,
          number: payload.number,
          expiry: payload.expiry || '',
          cvv: payload.cvv || '',
        });
        if (res?.ok) {
          saveBtn.textContent = 'Card Saved';
          if (!payload.detectedSub) setTimeout(remove, 900);
        } else {
          saveBtn.textContent = res?.status === 423 ? 'Unlock Aegis first' : 'Failed';
          saveBtn.disabled = false;
        }
      });

      if (payload.detectedSub) {
        const subRow = document.createElement('div');
        subRow.className = 'sub-row';
        const costInput = document.createElement('input');
        costInput.type = 'text';
        costInput.placeholder = 'Monthly cost';
        costInput.value = payload.detectedSub.cost || '';
        const curInput = document.createElement('input');
        curInput.type = 'text';
        curInput.style.maxWidth = '64px';
        curInput.value = payload.detectedSub.currency || 'USD';
        subRow.appendChild(costInput);
        subRow.appendChild(curInput);
        extraEl.appendChild(subRow);

        const subBtn = document.createElement('button');
        subBtn.type = 'button';
        subBtn.className = 'btn';
        subBtn.textContent = `+ Save ${payload.siteName} Sub`;
        subBtn.addEventListener('click', async () => {
          const costVal = costInput.value.trim();
          if (!costVal) {
            costInput.focus();
            return;
          }
          subBtn.textContent = 'Saving...';
          subBtn.disabled = true;
          const res = await chrome.runtime.sendMessage({
            type: 'BRIDGE_SAVE_SUBSCRIPTION',
            title: payload.siteName,
            cost: costVal,
            currency: curInput.value.trim().toUpperCase() || 'USD',
            renewalDate: nextMonthIsoDate(),
            paymentMethod: last4 ? `Card •••• ${last4}` : '',
          });
          subBtn.textContent = res?.ok ? 'Sub Saved' : 'Failed';
        });
        actionsEl.insertBefore(subBtn, saveBtn);
      }
    }

    shadow.appendChild(wrapper);
    document.documentElement.appendChild(host);
  }

  // On load: restore any pending save prompt after redirects/2FA + check autofill
  (async () => {
    try {
      const res = await chrome.runtime.sendMessage({ type: 'PENDING_SAVE_GET' });
      const pending = res?.pendingSave;
      if (pending && pending.payload) {
        showSaveBanner(pending.kind || 'password', pending.payload);
      }
    } catch {
      // Ignore
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
          showAutofillMenu(anchor, matches, 'password');
        }
      }
    }
  })();

  async function handleInputActivate(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;

    const { numberInput, expiryInput, cvvInput } = findCardInputs();
    if (target === numberInput || target === expiryInput || target === cvvInput) {
      const cards = await fetchCards();
      if (cards.length > 0) {
        showAutofillMenu(target, cards, 'card');
      }
      return;
    }

    const { usernameInput, passwordInput } = findCredentialInputs();
    if (target === usernameInput || target === passwordInput) {
      const matches = await fetchMatchesForCurrentHost();
      if (matches.length > 0) {
        showAutofillMenu(target, matches, 'password');
      }
      return;
    }

    hideAutofillMenu();
  }

  document.addEventListener('focusin', handleInputActivate, true);
  document.addEventListener('click', handleInputActivate, true);

  document.addEventListener(
    'mousedown',
    (event) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.id === AUTOFILL_HOST_ID) return;
      const { usernameInput, passwordInput } = findCredentialInputs();
      const { numberInput, expiryInput, cvvInput } = findCardInputs();
      if (
        target === usernameInput ||
        target === passwordInput ||
        target === numberInput ||
        target === expiryInput ||
        target === cvvInput
      ) {
        return;
      }
      hideAutofillMenu();
    },
    true
  );

  document.addEventListener(
    'submit',
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;

      // 1. Check credit card / subscription checkout submission
      const { numberInput, expiryInput, cvvInput } = findCardInputs(form);
      const rawCardNum = numberInput ? numberInput.value.replace(/\D/g, '') : '';
      if (rawCardNum.length >= 13 && rawCardNum.length <= 19) {
        const cardPayload = {
          title: `Card •••• ${rawCardNum.slice(-4)}`,
          number: numberInput.value.trim(),
          expiry: expiryInput ? expiryInput.value.trim() : '',
          cvv: cvvInput ? cvvInput.value.trim() : '',
          siteName: getNiceSiteName(),
          detectedSub: detectSubscriptionPrice(),
        };
        chrome.runtime
          .sendMessage({ type: 'PENDING_SAVE_SET', kind: 'card', payload: cardPayload })
          .catch(() => {});
        setTimeout(() => showSaveBanner('card', cardPayload), 250);
        return;
      }

      // 2. Check password login / signup submission
      const { usernameInput, passwordInput } = findCredentialInputs(form);
      if (!passwordInput || !passwordInput.value || passwordInput.value.length < 3) return;

      const host = getHost();
      const username = usernameInput ? usernameInput.value.trim() : '';
      const password = passwordInput.value;

      const alreadySaved = cachedMatches.some(
        (m) =>
          (m.username || '').trim().toLowerCase() === username.toLowerCase() &&
          m.password === password
      );
      if (alreadySaved) return;

      const credPayload = { title: host, username, password };
      chrome.runtime
        .sendMessage({ type: 'PENDING_SAVE_SET', kind: 'password', payload: credPayload })
        .catch(() => {});

      setTimeout(() => showSaveBanner('password', credPayload), 250);
    },
    true
  );

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'AEGIS_FILL') {
      sendResponse({ ok: fillCredentials(message.username || '', message.password || '') });
      return false;
    }
    if (message.type === 'AEGIS_FILL_CARD') {
      sendResponse({ ok: fillCard(message.card || {}) });
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
    if (message.type === 'AEGIS_DETECT_SUB') {
      sendResponse({
        ok: true,
        siteName: getNiceSiteName(),
        detected: detectSubscriptionPrice(),
      });
      return false;
    }
    return false;
  });
})();
