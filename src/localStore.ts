import {
  decryptData,
  deriveKeyFromMasterPassword,
  encryptData,
  hashPassword,
  verifyPassword,
} from './crypto';
import type { CustomCategory } from './categories';

export interface LocalAccount {
  id: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  userName?: string;
  language?: string;
  createdAt: number;
}

export interface EncryptedEntryDoc {
  v: 2;
  ciphertext: string;
  iv: string;
  updatedAt: number;
}

export interface LocalVaultFile {
  appName: 'Aegis Vault';
  format: 'aegis-local-v2';
  accountId: string;
  keyCheck?: { ciphertext: string; iv: string };
  userName: string;
  baseCurrency: string;
  language?: string;
  customCategories: CustomCategory[];
  entries: Record<string, EncryptedEntryDoc>;
  updatedAt: number;
}

const ACCOUNTS_FILE = 'accounts.json';
const SESSION_KEY = 'aegis_active_account_id';
const KEY_CHECK_SENTINEL = 'AEGIS_KEY_VALID_V2';

const vaultFilename = (accountId: string) => `vault_${accountId}.aegis`;

const isTauriRuntime = () =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

async function readLocalText(filename: string): Promise<string | null> {
  if (isTauriRuntime()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      return await invoke<string | null>('read_local_file', { filename });
    } catch (e) {
      console.error(`Tauri read_local_file failed (${filename}):`, e);
    }
  }
  return localStorage.getItem(`aegis_fs_${filename}`);
}

async function writeLocalText(filename: string, content: string): Promise<void> {
  if (isTauriRuntime()) {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke<string>('write_local_file', { filename, content });
    return;
  }
  const existing = localStorage.getItem(`aegis_fs_${filename}`);
  if (existing) {
    localStorage.setItem(`aegis_fs_${filename}.bak`, existing);
  }
  localStorage.setItem(`aegis_fs_${filename}`, content);
}

export async function getVaultStorageDir(): Promise<string | null> {
  if (!isTauriRuntime()) return null;
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<string>('get_vault_data_dir');
  } catch {
    return null;
  }
}

async function readAccounts(): Promise<LocalAccount[]> {
  const raw = await readLocalText(ACCOUNTS_FILE);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    const bak = await readLocalText(`${ACCOUNTS_FILE}.bak`);
    if (bak) {
      try {
        const parsed = JSON.parse(bak);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
}

async function writeAccounts(accounts: LocalAccount[]): Promise<void> {
  await writeLocalText(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
}

export async function getActiveAccount(): Promise<LocalAccount | null> {
  const activeId = localStorage.getItem(SESSION_KEY);
  if (!activeId) return null;
  const accounts = await readAccounts();
  return accounts.find((a) => a.id === activeId) || null;
}

export async function registerLocalAccount(
  emailInput: string,
  password: string
): Promise<LocalAccount> {
  const email = emailInput.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    throw new Error('Geçerli bir e-posta adresi girin.');
  }
  if (password.length < 6) {
    throw new Error('Hesap şifresi en az 6 karakter olmalıdır.');
  }

  const accounts = await readAccounts();
  if (accounts.some((a) => a.email === email)) {
    throw new Error('Bu e-posta adresiyle kayıtlı yerel bir hesap zaten var.');
  }

  const { hash, salt } = await hashPassword(password);
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().replace(/-/g, '')
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

  const newAccount: LocalAccount = {
    id,
    email,
    passwordHash: hash,
    passwordSalt: salt,
    userName: email.split('@')[0],
    createdAt: Date.now(),
  };

  await writeAccounts([...accounts, newAccount]);
  localStorage.setItem(SESSION_KEY, newAccount.id);
  return newAccount;
}

export async function signInLocalAccount(
  emailInput: string,
  password: string
): Promise<LocalAccount> {
  const email = emailInput.trim().toLowerCase();
  const accounts = await readAccounts();
  const account = accounts.find((a) => a.email === email);
  if (!account) {
    throw new Error('INVALID_CREDENTIAL');
  }

  const valid = await verifyPassword(password, account.passwordHash, account.passwordSalt);
  if (!valid) {
    throw new Error('INVALID_CREDENTIAL');
  }

  localStorage.setItem(SESSION_KEY, account.id);
  return account;
}

export function signOutLocalAccount(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function updateLocalAccountMeta(
  accountId: string,
  patch: { userName?: string; language?: string }
): Promise<void> {
  const accounts = await readAccounts();
  const updated = accounts.map((a) =>
    a.id === accountId ? { ...a, ...patch } : a
  );
  await writeAccounts(updated);
}

export async function readVaultFile(accountId: string): Promise<LocalVaultFile | null> {
  const filename = vaultFilename(accountId);
  const raw = await readLocalText(filename);
  if (raw) {
    try {
      return JSON.parse(raw) as LocalVaultFile;
    } catch (e) {
      console.error('Primary vault file corrupted, trying .bak:', e);
    }
  }

  const bak = await readLocalText(`${filename}.bak`);
  if (bak) {
    try {
      return JSON.parse(bak) as LocalVaultFile;
    } catch (e) {
      console.error('Backup vault file also unreadable:', e);
    }
  }
  return null;
}

export async function writeVaultFile(
  accountId: string,
  vault: LocalVaultFile
): Promise<void> {
  const filename = vaultFilename(accountId);
  const payload: LocalVaultFile = {
    ...vault,
    appName: 'Aegis Vault',
    format: 'aegis-local-v2',
    accountId,
    updatedAt: Date.now(),
  };
  await writeLocalText(filename, JSON.stringify(payload, null, 2));
}

export async function verifyOrInitMasterKey(
  account: LocalAccount,
  cryptoKey: CryptoKey
): Promise<boolean> {
  const existing = await readVaultFile(account.id);
  if (existing && existing.keyCheck) {
    try {
      const check = await decryptData(
        existing.keyCheck.ciphertext,
        existing.keyCheck.iv,
        cryptoKey
      );
      return check === KEY_CHECK_SENTINEL;
    } catch {
      return false;
    }
  }

  // First unlock for this local account (or upgrading an account without keyCheck)
  const keyCheck = await encryptData(KEY_CHECK_SENTINEL, cryptoKey);
  const initialVault: LocalVaultFile = existing
    ? { ...existing, keyCheck }
    : {
        appName: 'Aegis Vault',
        format: 'aegis-local-v2',
        accountId: account.id,
        keyCheck,
        userName: account.userName || account.email.split('@')[0],
        baseCurrency: 'TRY',
        language: account.language,
        customCategories: [],
        entries: {},
        updatedAt: Date.now(),
      };

  await writeVaultFile(account.id, initialVault);
  return true;
}

function deriveSaltForAccountId(accountId: string): Uint8Array {
  const encoder = new TextEncoder();
  const salt = new Uint8Array(16);
  const uidBytes = encoder.encode(accountId);
  for (let i = 0; i < Math.min(16, uidBytes.length); i++) {
    salt[i] = uidBytes[i];
  }
  return salt;
}

export async function changeLocalAccountEmail(
  accountId: string,
  newEmailInput: string,
  currentAccountPassword: string
): Promise<LocalAccount> {
  const newEmail = newEmailInput.trim().toLowerCase();
  if (!newEmail || !newEmail.includes('@')) {
    throw new Error('Geçerli bir e-posta adresi girin.');
  }

  const accounts = await readAccounts();
  const current = accounts.find((a) => a.id === accountId);
  if (!current) throw new Error('Hesap bulunamadı.');

  const valid = await verifyPassword(currentAccountPassword, current.passwordHash, current.passwordSalt);
  if (!valid) throw new Error('Mevcut hesap şifresi yanlış.');

  if (accounts.some((a) => a.id !== accountId && a.email === newEmail)) {
    throw new Error('Bu e-posta adresi başka bir yerel hesapta zaten kullanılıyor.');
  }

  const updatedAccount: LocalAccount = { ...current, email: newEmail };
  await writeAccounts(accounts.map((a) => (a.id === accountId ? updatedAccount : a)));
  return updatedAccount;
}

export async function changeLocalAccountPassword(
  accountId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  if (newPassword.length < 6) {
    throw new Error('Yeni hesap şifresi en az 6 karakter olmalıdır.');
  }

  const accounts = await readAccounts();
  const current = accounts.find((a) => a.id === accountId);
  if (!current) throw new Error('Hesap bulunamadı.');

  const valid = await verifyPassword(currentPassword, current.passwordHash, current.passwordSalt);
  if (!valid) throw new Error('Mevcut hesap şifresi yanlış.');

  const { hash, salt } = await hashPassword(newPassword);
  const updated = accounts.map((a) =>
    a.id === accountId ? { ...a, passwordHash: hash, passwordSalt: salt } : a
  );
  await writeAccounts(updated);
}

export async function changeLocalMasterPassword(
  accountId: string,
  currentMasterPassword: string,
  newMasterPassword: string
): Promise<{ newKey: CryptoKey; updatedVault: LocalVaultFile }> {
  if (newMasterPassword.length < 6) {
    throw new Error('Yeni Ana Şifre en az 6 karakter olmalıdır.');
  }

  const vault = await readVaultFile(accountId);
  if (!vault) throw new Error('Kasa dosyası bulunamadı.');

  const salt = deriveSaltForAccountId(accountId);
  const oldKey = await deriveKeyFromMasterPassword(currentMasterPassword, salt);

  if (vault.keyCheck) {
    try {
      const check = await decryptData(vault.keyCheck.ciphertext, vault.keyCheck.iv, oldKey);
      if (check !== KEY_CHECK_SENTINEL) {
        throw new Error('INVALID_MASTER');
      }
    } catch {
      throw new Error('Mevcut Ana Şifre yanlış.');
    }
  }

  const newKey = await deriveKeyFromMasterPassword(newMasterPassword, salt);
  const reencryptedEntries: Record<string, EncryptedEntryDoc> = {};

  for (const [entryId, doc] of Object.entries(vault.entries || {})) {
    const outerJson = await decryptData(doc.ciphertext, doc.iv, oldKey);
    const parsed = JSON.parse(outerJson);

    if (parsed.encryptedPassword?.ciphertext && parsed.encryptedPassword?.iv) {
      const plainSecret = await decryptData(
        parsed.encryptedPassword.ciphertext,
        parsed.encryptedPassword.iv,
        oldKey
      );
      parsed.encryptedPassword = await encryptData(plainSecret, newKey);
    }

    const newOuter = await encryptData(JSON.stringify(parsed), newKey);
    reencryptedEntries[entryId] = {
      v: 2,
      ciphertext: newOuter.ciphertext,
      iv: newOuter.iv,
      updatedAt: Date.now(),
    };
  }

  const newKeyCheck = await encryptData(KEY_CHECK_SENTINEL, newKey);
  const updatedVault: LocalVaultFile = {
    ...vault,
    keyCheck: newKeyCheck,
    entries: reencryptedEntries,
    updatedAt: Date.now(),
  };

  await writeVaultFile(accountId, updatedVault);
  return { newKey, updatedVault };
}

export async function deleteLocalAccount(
  accountId: string,
  currentAccountPassword: string
): Promise<void> {
  const accounts = await readAccounts();
  const current = accounts.find((a) => a.id === accountId);
  if (!current) throw new Error('Hesap bulunamadı.');

  const valid = await verifyPassword(currentAccountPassword, current.passwordHash, current.passwordSalt);
  if (!valid) throw new Error('Hesap şifresi yanlış. Silme işlemi iptal edildi.');

  const remaining = accounts.filter((a) => a.id !== accountId);
  await writeAccounts(remaining);

  const filename = vaultFilename(accountId);
  if (isTauriRuntime()) {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('delete_local_file', { filename });
    } catch (e) {
      console.error('Failed to delete vault file:', e);
    }
  } else {
    localStorage.removeItem(`aegis_fs_${filename}`);
    localStorage.removeItem(`aegis_fs_${filename}.bak`);
  }

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('aegis_master');
}
