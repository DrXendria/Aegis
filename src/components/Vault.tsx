import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, Plus, Key, LogOut, Copy, Eye, EyeOff, Sun, Moon, 
  Search, LayoutGrid, Star, CreditCard, FileText, X,
  Calendar, CreditCard as CardIcon, Bell, Download, Trash2, User, Edit2, ChevronDown, Save, Database, Check,
  Upload, AlertTriangle, Smartphone, Share2, Clock, Sparkles
} from 'lucide-react';
import { decryptData, encryptData } from '../crypto';
import {
  getCategoryDetails,
  getAllCategories
} from '../categories';
import type { CustomCategory } from '../categories';

const tryHaptic = (action: () => Promise<any>) => action().catch(() => {});

const safeNotificationFeedback = async (type: string) => {
  try {
    const mod = await import('@tauri-apps/plugin-haptics');
    return mod.notificationFeedback(type as any);
  } catch { /* plugin not available */ }
};

const safeImpactFeedback = async (style: string) => {
  try {
    const mod = await import('@tauri-apps/plugin-haptics');
    return mod.impactFeedback(style as any);
  } catch { /* plugin not available */ }
};

import {
  getVaultStorageDir,
  readVaultFile,
  signOutLocalAccount,
  updateLocalAccountMeta,
  writeVaultFile,
  type EncryptedEntryDoc,
  type LocalVaultFile
} from '../localStore';

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as SwipeableListType,
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
import { CustomDropdown } from './CustomDropdown';

interface VaultProps {
  cryptoKey: CryptoKey;
  userId: string;
  userEmail: string;
  onLock: () => void;
}

interface PasswordEntry {
  id: string;
  type: 'password' | 'subscription' | 'credit_card' | 'secure_note';
  title: string;
  username: string; 
  encryptedPassword: { ciphertext: string, iv: string };
  plaintextPassword?: string; 
  isFavorite?: boolean;
  category?: string;
  lastModified?: number;
  
  cost?: string;
  currency?: string;
  paymentMethod?: string;
  renewalDate?: string;
}

interface LocalEncryptedBackup {
  savedAt: number;
  entries: Record<string, EncryptedEntryDoc>;
}

const Vault: React.FC<VaultProps> = ({ cryptoKey, userId, userEmail, onLock }) => {
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [newCategory, setNewCategory] = useState<string>('social');
  const [isAddingCategoryInline, setIsAddingCategoryInline] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [isAddingCategoryModal, setIsAddingCategoryModal] = useState(false);
  const [modalCategoryInput, setModalCategoryInput] = useState('');

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState(''); 
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState('all');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState('');

  const [subCost, setSubCost] = useState('');
  const [subCurrency, setSubCurrency] = useState('TRY');
  const [subMethod, setSubMethod] = useState('');
  const [subDate, setSubDate] = useState('');

  const [ccNumber, setCcNumber] = useState('');
  const [ccExpiry, setCcExpiry] = useState('');
  const [ccCvv, setCcCvv] = useState('');

  // File import ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    };
    
    const initialTheme = mediaQuery.matches ? 'dark' : 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [baseCurrency, setBaseCurrency] = useState('TRY');

  // Inline editing state for user name
  const [isEditingName, setIsEditingName] = useState(false);
  const [inlineNameInput, setInlineNameInput] = useState('');
  
  const [isVaultLoading, setIsVaultLoading] = useState(true);
  const [isVaultLoaded, setIsVaultLoaded] = useState(false);
  const [vaultLoadError, setVaultLoadError] = useState<string | null>(null);
  const [decryptionFailedCount, setDecryptionFailedCount] = useState(0);
  const [localBackupMeta, setLocalBackupMeta] = useState<{ count: number; savedAt: number } | null>(null);
  const [diskBackupMeta, setDiskBackupMeta] = useState<{ savedAt: number; path: string } | null>(null);
  const [vaultDirPath, setVaultDirPath] = useState<string | null>(null);
  const vaultFileRef = useRef<LocalVaultFile | null>(null);

  const localBackupKey = `aegis_local_backup_${userId}`;
  const diskBackupKey = `aegis_disk_backup_${userId}`;
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    message: string;
    requireConfirmText?: boolean;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [confirmTextInput, setConfirmTextInput] = useState('');
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const readLocalBackup = (): LocalEncryptedBackup | null => {
    try {
      const raw = localStorage.getItem(localBackupKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LocalEncryptedBackup;
      if (parsed && parsed.entries && typeof parsed.entries === 'object') {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  };

  const writeLocalBackup = (entriesMap: Record<string, EncryptedEntryDoc>) => {
    try {
      const payload: LocalEncryptedBackup = {
        savedAt: Date.now(),
        entries: entriesMap
      };
      localStorage.setItem(localBackupKey, JSON.stringify(payload));
      setLocalBackupMeta({
        count: Object.keys(entriesMap).length,
        savedAt: payload.savedAt
      });
    } catch (e) {
      console.warn("Could not write local encrypted backup", e);
    }
  };

  const encryptEntryForCloud = async (entry: PasswordEntry): Promise<EncryptedEntryDoc> => {
    const { plaintextPassword, ...safeEntry } = entry;
    const cleanPayload = JSON.parse(JSON.stringify(safeEntry));
    const encrypted = await encryptData(JSON.stringify(cleanPayload), cryptoKey);
    return {
      v: 2,
      ciphertext: encrypted.ciphertext,
      iv: encrypted.iv,
      updatedAt: Date.now()
    };
  };

  const decryptEntryFromCloud = async (entryId: string, raw: EncryptedEntryDoc): Promise<PasswordEntry> => {
    const decryptedJson = await decryptData(raw.ciphertext, raw.iv, cryptoKey);
    const parsed = JSON.parse(decryptedJson) as PasswordEntry;
    return {
      ...parsed,
      id: parsed.id || entryId
    };
  };

  const fetchVault = async () => {
    setIsVaultLoading(true);
    setVaultLoadError(null);
    setDecryptionFailedCount(0);

    const existingBackup = readLocalBackup();
    if (existingBackup) {
      setLocalBackupMeta({
        count: Object.keys(existingBackup.entries).length,
        savedAt: existingBackup.savedAt
      });
    }

    getVaultStorageDir().then(setVaultDirPath).catch(() => {});

    try {
      const vaultFile = await readVaultFile(userId);
      const effectiveVault: LocalVaultFile = vaultFile || {
        appName: 'Aegis Vault',
        format: 'aegis-local-v2',
        accountId: userId,
        userName: userEmail.split('@')[0],
        baseCurrency: 'TRY',
        customCategories: [],
        entries: {},
        updatedAt: Date.now()
      };

      vaultFileRef.current = effectiveVault;
      setUserName(effectiveVault.userName || '');
      setBaseCurrency(effectiveVault.baseCurrency || 'TRY');
      const rawCats = effectiveVault.customCategories || [];
      const normalizedCats: CustomCategory[] = rawCats.map((c: any) =>
        typeof c === 'string' ? { id: c, name: c } : c
      );
      setCustomCategories(normalizedCats);

      const decryptedEntries: PasswordEntry[] = [];
      const encryptedMap: Record<string, EncryptedEntryDoc> = {};
      let failedCount = 0;

      for (const [entryId, raw] of Object.entries(effectiveVault.entries || {})) {
        if (raw && raw.ciphertext && raw.iv) {
          encryptedMap[entryId] = {
            v: 2,
            ciphertext: raw.ciphertext,
            iv: raw.iv,
            updatedAt: raw.updatedAt || Date.now()
          };
          try {
            const decrypted = await decryptEntryFromCloud(entryId, raw);
            decryptedEntries.push(decrypted);
          } catch (e) {
            console.error("Entry decryption failed:", entryId, e);
            failedCount += 1;
          }
        }
      }

      if (Object.keys(encryptedMap).length > 0) {
        writeLocalBackup(encryptedMap);
      }

      setEntries(decryptedEntries);
      setDecryptionFailedCount(failedCount);
      setIsVaultLoaded(true);
    } catch (err: any) {
      console.error("Failed to load local vault", err);
      setIsVaultLoaded(false);
      setVaultLoadError(err?.message || "Yerel kasa dosyası okunamadı.");
    } finally {
      setIsVaultLoading(false);
    }
  };

  useEffect(() => {
    setIsVaultLoaded(false);
    fetchVault();
  }, [userId]);

  useEffect(() => {
    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(res => res.json())
      .then(data => {
        if(data && data.rates) setExchangeRates(data.rates);
      })
      .catch(() => console.error("Could not fetch exchange rates"));
  }, [baseCurrency]);

  const persistVaultFile = async (nextVault: LocalVaultFile) => {
    await writeVaultFile(userId, nextVault);
    vaultFileRef.current = nextVault;
  };

  const saveVaultPatch = async (patch: {
    userName?: string;
    baseCurrency?: string;
    language?: string;
    customCategories?: CustomCategory[];
  }) => {
    if (!isVaultLoaded || !vaultFileRef.current) {
      alert("Kasa verileri henüz yüklenmediği için kaydetme işlemi güvenlik amacıyla engellendi.");
      return;
    }
    if (patch.userName !== undefined) setUserName(patch.userName);
    if (patch.baseCurrency !== undefined) setBaseCurrency(patch.baseCurrency);
    if (patch.customCategories !== undefined) setCustomCategories(patch.customCategories);

    try {
      const nextVault: LocalVaultFile = {
        ...vaultFileRef.current,
        ...(patch.userName !== undefined ? { userName: patch.userName } : {}),
        ...(patch.baseCurrency !== undefined ? { baseCurrency: patch.baseCurrency } : {}),
        ...(patch.language !== undefined ? { language: patch.language } : {}),
        ...(patch.customCategories !== undefined ? { customCategories: patch.customCategories } : {}),
        updatedAt: Date.now()
      };
      await persistVaultFile(nextVault);
      if (patch.userName !== undefined || patch.language !== undefined) {
        await updateLocalAccountMeta(userId, {
          ...(patch.userName !== undefined ? { userName: patch.userName } : {}),
          ...(patch.language !== undefined ? { language: patch.language } : {}),
        });
      }
    } catch (err: any) {
      console.error("Failed to save vault settings", err);
      alert("Hata (Kaydedilemedi): " + err.message);
    }
  };

  const saveSingleEntry = async (entry: PasswordEntry) => {
    if (!isVaultLoaded || !vaultFileRef.current) {
      alert("Kasa verileri henüz yüklenmediği için kaydetme işlemi güvenlik amacıyla engellendi.");
      return false;
    }
    try {
      const encryptedDoc = await encryptEntryForCloud(entry);
      const nextEntriesMap: Record<string, EncryptedEntryDoc> = {
        ...(vaultFileRef.current.entries || {}),
        [entry.id]: encryptedDoc
      };
      await persistVaultFile({
        ...vaultFileRef.current,
        entries: nextEntriesMap,
        updatedAt: Date.now()
      });

      setEntries(prev => {
        const exists = prev.some(e => e.id === entry.id);
        return exists ? prev.map(e => (e.id === entry.id ? entry : e)) : [...prev, entry];
      });

      writeLocalBackup(nextEntriesMap);
      return true;
    } catch (err: any) {
      console.error("Failed to save entry", err);
      alert("Hata (Kaydedilemedi): " + err.message);
      return false;
    }
  };

  const saveMultipleEntries = async (entriesToSave: PasswordEntry[]) => {
    if (!isVaultLoaded || !vaultFileRef.current) {
      alert("Kasa verileri henüz yüklenmediği için kaydetme işlemi güvenlik amacıyla engellendi.");
      return false;
    }
    if (entriesToSave.length === 0) return true;
    try {
      const nextEntriesMap: Record<string, EncryptedEntryDoc> = {
        ...(vaultFileRef.current.entries || {})
      };
      for (const entry of entriesToSave) {
        nextEntriesMap[entry.id] = await encryptEntryForCloud(entry);
      }

      await persistVaultFile({
        ...vaultFileRef.current,
        entries: nextEntriesMap,
        updatedAt: Date.now()
      });

      setEntries(prev => {
        const byId = new Map(prev.map(e => [e.id, e]));
        for (const item of entriesToSave) {
          byId.set(item.id, item);
        }
        return Array.from(byId.values());
      });

      writeLocalBackup(nextEntriesMap);
      return true;
    } catch (err: any) {
      console.error("Failed to batch save entries", err);
      alert("Hata (Kaydedilemedi): " + err.message);
      return false;
    }
  };

  const deleteSingleEntry = async (id: string) => {
    if (!isVaultLoaded || !vaultFileRef.current) {
      alert("Kasa verileri henüz yüklenmediği için silme işlemi güvenlik amacıyla engellendi.");
      return false;
    }
    try {
      const nextEntriesMap: Record<string, EncryptedEntryDoc> = {
        ...(vaultFileRef.current.entries || {})
      };
      delete nextEntriesMap[id];

      await persistVaultFile({
        ...vaultFileRef.current,
        entries: nextEntriesMap,
        updatedAt: Date.now()
      });

      setEntries(prev => prev.filter(e => e.id !== id));
      writeLocalBackup(nextEntriesMap);
      return true;
    } catch (err: any) {
      console.error("Failed to delete entry", err);
      alert("Hata (Silinemedi): " + err.message);
      return false;
    }
  };

  const deleteAllEntries = async () => {
    if (!isVaultLoaded || !vaultFileRef.current) {
      alert("Kasa verileri henüz yüklenmediği için silme işlemi güvenlik amacıyla engellendi.");
      return false;
    }
    try {
      await persistVaultFile({
        ...vaultFileRef.current,
        entries: {},
        updatedAt: Date.now()
      });
      setEntries([]);
      writeLocalBackup({});
      return true;
    } catch (err: any) {
      console.error("Failed to clear entries", err);
      alert("Hata (Silinemedi): " + err.message);
      return false;
    }
  };

  const handleRestoreLocalBackup = async () => {
    const backup = readLocalBackup();
    if (!backup || Object.keys(backup.entries).length === 0) {
      showToast("Bu cihazda geri yüklenecek yerel şifreli yedek bulunamadı.");
      return;
    }
    const restored: PasswordEntry[] = [];
    let failed = 0;
    for (const [entryId, encDoc] of Object.entries(backup.entries)) {
      try {
        const decrypted = await decryptEntryFromCloud(entryId, encDoc);
        restored.push(decrypted);
      } catch {
        failed += 1;
      }
    }
    if (restored.length === 0) {
      alert("Yerel yedek çözülemedi. Ana şifrenizin doğru olduğundan emin olun.");
      return;
    }
    const ok = await saveMultipleEntries(restored);
    if (ok) {
      showToast(`✅ ${restored.length} kayıt yerel şifreli yedekten geri yüklendi!${failed > 0 ? ` (${failed} kayıt çözülemedi)` : ''}`);
    }
  };

  const saveEncryptedBackupToDisk = async (isAuto = false) => {
    const backup = readLocalBackup();
    const entriesMap: Record<string, EncryptedEntryDoc> = backup?.entries ? { ...backup.entries } : {};

    if (Object.keys(entriesMap).length === 0 && entries.length > 0) {
      for (const entry of entries) {
        entriesMap[entry.id] = await encryptEntryForCloud(entry);
      }
    }

    if (Object.keys(entriesMap).length === 0) {
      if (!isAuto) showToast("Yedeklenecek kayıt bulunamadı.");
      return;
    }

    const dateStamp = new Date().toISOString().split('T')[0];
    const filename = `aegis-auto-backup-${dateStamp}.json`;
    const payload = JSON.stringify(
      {
        appName: "Aegis Vault",
        format: "aegis-encrypted-v2",
        exportedAt: new Date().toISOString(),
        totalEntries: Object.keys(entriesMap).length,
        customCategories,
        encryptedEntries: entriesMap
      },
      null,
      2
    );

    try {
      const { invoke } = await import('@tauri-apps/api/core');
      const savedPath = await invoke<string>('save_encrypted_backup', {
        filename,
        content: payload
      });
      const meta = { savedAt: Date.now(), path: savedPath };
      localStorage.setItem(diskBackupKey, JSON.stringify(meta));
      setDiskBackupMeta(meta);
      showToast(
        isAuto
          ? `💾 2 haftalık otomatik şifreli yedek kaydedildi`
          : `💾 Şifreli yedek kaydedildi: ${savedPath}`
      );
    } catch (err) {
      if (!isAuto) {
        // Fallback to browser download if not running inside Tauri desktop
        const blob = new Blob([payload], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        const meta = { savedAt: Date.now(), path: filename };
        localStorage.setItem(diskBackupKey, JSON.stringify(meta));
        setDiskBackupMeta(meta);
        showToast("💾 Şifreli yedek dosyası indirildi!");
      } else {
        console.warn("Auto disk backup skipped (non-Tauri environment or FS error):", err);
      }
    }
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(diskBackupKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.savedAt === 'number') {
          setDiskBackupMeta(parsed);
        }
      }
    } catch {}
  }, [diskBackupKey]);

  // Automatically create an encrypted backup on disk every 2 weeks when vault has entries
  useEffect(() => {
    if (!isVaultLoaded || entries.length === 0) return;
    let lastSavedAt = 0;
    try {
      const raw = localStorage.getItem(diskBackupKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.savedAt === 'number') {
          lastSavedAt = parsed.savedAt;
        }
      }
    } catch {}

    if (Date.now() - lastSavedAt >= TWO_WEEKS_MS) {
      saveEncryptedBackupToDisk(true);
    }
  }, [isVaultLoaded, entries.length]);

  // Check password aging (> 90 days)
  const isPasswordOld = (entry: PasswordEntry): boolean => {
    if (entry.type !== 'password') return false;
    const modifiedTime = entry.lastModified || (parseInt(entry.id, 10) > 1600000000000 ? parseInt(entry.id, 10) : null);
    if (!modifiedTime) return false;
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    return (Date.now() - modifiedTime) >= ninetyDaysMs;
  };

  const oldPasswordsCount = useMemo(() => {
    return entries.filter(isPasswordOld).length;
  }, [entries]);

  // Alert user once per session if they have passwords older than 90 days
  useEffect(() => {
    if (entries.length > 0 && oldPasswordsCount > 0) {
      if (!sessionStorage.getItem('aegis_old_pwd_notified')) {
        sessionStorage.setItem('aegis_old_pwd_notified', 'true');
        showToast(`⚠️ ${oldPasswordsCount} ${t("password_old_warning") || "şifreniz 90 günden uzun süredir güncellenmedi!"}`);
      }
    }
  }, [entries, oldPasswordsCount, t]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 18; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  };

  const handleCopyPassword = async (entry: PasswordEntry) => {
    let textToCopy = entry.plaintextPassword;
    if (!textToCopy && entry.encryptedPassword && entry.encryptedPassword.ciphertext) {
      try {
        textToCopy = await decryptData(entry.encryptedPassword.ciphertext, entry.encryptedPassword.iv, cryptoKey);
      } catch (e) {
        console.error("Decryption for copy failed", e);
      }
    }
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy);
      tryHaptic(() => safeImpactFeedback('light'));
      showToast(t("copied_toast") || "Şifre panoya kopyalandı! (30 sn sonra temizlenecek)");
      setTimeout(async () => {
        try {
          const current = await navigator.clipboard.readText();
          if (current === textToCopy) {
            await navigator.clipboard.writeText('');
          }
        } catch {}
      }, 30000);
    }
  };

  const handleCopyUsername = async (username: string) => {
    if (username) {
      await navigator.clipboard.writeText(username);
      tryHaptic(() => safeImpactFeedback('light'));
      showToast(`${username} kopyalandı!`);
    }
  };

  const handleShareAccount = async (entry: PasswordEntry) => {
    let plain = entry.plaintextPassword;
    if (!plain && entry.encryptedPassword && entry.encryptedPassword.ciphertext) {
      try {
        plain = await decryptData(entry.encryptedPassword.ciphertext, entry.encryptedPassword.iv, cryptoKey);
      } catch {}
    }
    const textData = `Aegis - ${entry.title}\nKullanıcı: ${entry.username}\nŞifre: ${plain || '***'}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aegis: ${entry.title}`,
          text: textData
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(textData);
      showToast("Hesap detayları panoya kopyalandı!");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    let secretData = newPassword;
    if (activeTab === 'card') {
      secretData = JSON.stringify({ number: ccNumber, expiry: ccExpiry, cvv: ccCvv });
    }

    let encrypted = null;
    if (secretData) {
      encrypted = await encryptData(secretData, cryptoKey);
    }

    let type: PasswordEntry['type'] = 'password';
    if (activeTab === 'subs') type = 'subscription';
    if (activeTab === 'card') type = 'credit_card';
    if (activeTab === 'note') type = 'secure_note';

    let newEntry: PasswordEntry = {
      id: editingId || Date.now().toString(),
      type,
      title: newTitle,
      username: newUsername,
      category: newCategory || 'other',
      encryptedPassword: encrypted || { ciphertext: '', iv: '' },
      lastModified: Date.now(),
      ...(type === 'subscription' && {
        cost: subCost,
        currency: subCurrency,
        paymentMethod: subMethod,
        renewalDate: subDate
      })
    };

    if (editingId) {
      const existing = entries.find(x => x.id === editingId);
      if (existing) {
        if (!secretData) {
          newEntry.encryptedPassword = existing.encryptedPassword;
          newEntry.lastModified = existing.lastModified || parseInt(existing.id, 10) || Date.now();
        }
        newEntry.isFavorite = existing.isFavorite;
        newEntry.plaintextPassword = secretData || existing.plaintextPassword;
      }
      const ok = await saveSingleEntry(newEntry);
      if (!ok) return;
    } else {
      const ok = await saveSingleEntry(newEntry);
      if (!ok) return;
    }
    tryHaptic(() => safeNotificationFeedback('success'));
    closeModal();
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTitle('');
    setNewUsername('');
    setNewPassword('');
    setNewCategory('social');
    setIsAddingCategoryModal(false);
    setModalCategoryInput('');
    setSubCost('');
    setSubCurrency('TRY');
    setSubMethod('');
    setSubDate('');
    setCcNumber('');
    setCcExpiry('');
    setCcCvv('');
  };

  const openEditModal = (entry: PasswordEntry) => {
    setEditingId(entry.id);
    setActiveTab(entry.type === 'subscription' ? 'subs' : entry.type === 'credit_card' ? 'card' : entry.type === 'secure_note' ? 'note' : 'all');
    setNewTitle(entry.title);
    setNewUsername(entry.username);
    setNewPassword('');
    setNewCategory(entry.category || 'other');
    setIsAddingCategoryModal(false);
    setModalCategoryInput('');
    
    if (entry.type === 'subscription') {
      setSubCost(entry.cost || '');
      setSubCurrency(entry.currency || 'TRY');
      setSubMethod(entry.paymentMethod || '');
      setSubDate(entry.renewalDate || '');
    }
    
    if (entry.type === 'credit_card' && entry.plaintextPassword) {
      try {
        const cc = JSON.parse(entry.plaintextPassword);
        setCcNumber(cc.number || '');
        setCcExpiry(cc.expiry || '');
        setCcCvv(cc.cvv || '');
      } catch (e) {}
    }
    
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setConfirmTextInput('');
    setConfirmDialog({
      title: t("delete"),
      message: t("delete_confirm"),
      onConfirm: async () => {
        tryHaptic(() => safeImpactFeedback('medium'));
        await deleteSingleEntry(id);
      }
    });
  };

  const handleReveal = async (id: string) => {
    const updatedEntries = await Promise.all(entries.map(async (entry) => {
      if (entry.id === id) {
        if (entry.plaintextPassword) {
          return { ...entry, plaintextPassword: undefined };
        } else {
          try {
            const decrypted = await decryptData(entry.encryptedPassword.ciphertext, entry.encryptedPassword.iv, cryptoKey);
            return { ...entry, plaintextPassword: decrypted };
          } catch(e) {
            console.error("Decryption failed", e);
            return entry;
          }
        }
      }
      return entry;
    }));
    setEntries(updatedEntries);
  };

  const toggleFavorite = async (id: string) => {
    const target = entries.find(entry => entry.id === id);
    if (!target) return;
    await saveSingleEntry({ ...target, isFavorite: !target.isFavorite });
  };

  const handleSignOut = async () => {
    signOutLocalAccount();
    onLock();
  };

  const startInlineEdit = () => {
    setInlineNameInput(displayUserName);
    setIsEditingName(true);
  };

  const finishInlineEdit = async () => {
    if (!isEditingName) return;
    setIsEditingName(false);
    const newName = inlineNameInput.trim();
    if (newName !== userName) {
      try {
        await saveVaultPatch({ userName: newName });
        const fallback = i18n.language === 'en' ? 'Name saved successfully:' : 'İsim başarıyla kaydedildi:';
        showToast(`${i18n.exists('name_saved_success') ? t('name_saved_success') : fallback} ${newName}`);
      } catch (err) {
        console.error("Save error", err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language, { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const handleCreateCategory = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const exists = customCategories.some(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      alert(t("category_exists") || "Bu isimde bir kategori zaten mevcut");
      return;
    }
    const newCat: CustomCategory = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed
    };
    const updated = [...customCategories, newCat];
    await saveVaultPatch({ customCategories: updated });
    showToast(`${t("category_added") || "Kategori başarıyla eklendi"}: ${trimmed}`);
    return newCat.id;
  };

  const handleDeleteCategory = (catId: string) => {
    const toDelete = customCategories.find(c => c.id === catId);
    if (!toDelete) return;
    setConfirmTextInput('');
    setConfirmDialog({
      title: t("delete"),
      message: t("delete_category_confirm"),
      onConfirm: async () => {
        const updatedCats = customCategories.filter(c => c.id !== catId);
        const affectedEntries = entries
          .filter(e => e.category === catId)
          .map(e => ({ ...e, category: 'other' }));
        if (selectedCategoryFilter === catId) setSelectedCategoryFilter('all');
        if (newCategory === catId) setNewCategory('other');
        await saveVaultPatch({ customCategories: updatedCats });
        if (affectedEntries.length > 0) {
          await saveMultipleEntries(affectedEntries);
        }
        showToast(t("category_deleted") || "Kategori silindi");
      }
    });
  };

  const handleInlineAddCategory = async () => {
    if (!customCategoryInput.trim()) {
      setIsAddingCategoryInline(false);
      return;
    }
    const newId = await handleCreateCategory(customCategoryInput);
    if (newId) {
      setSelectedCategoryFilter(newId);
    }
    setCustomCategoryInput('');
    setIsAddingCategoryInline(false);
  };

  const handleModalAddCategory = async () => {
    if (!modalCategoryInput.trim()) {
      setIsAddingCategoryModal(false);
      return;
    }
    const newId = await handleCreateCategory(modalCategoryInput);
    if (newId) {
      setNewCategory(newId);
    }
    setModalCategoryInput('');
    setIsAddingCategoryModal(false);
  };

  const renderCategoryBadge = (catId?: string) => {
    const details = getCategoryDetails(catId, customCategories, t);
    const CatIcon = details.icon;
    return (
      <span className="category-badge" title={details.name}>
        <CatIcon size={12} style={{ color: details.color }} />
        <span>{details.name}</span>
      </span>
    );
  };

  // 1-Click Import Data (Google Chrome, Bitwarden, LastPass, Aegis)
  const parseAndImportFile = async (file: File) => {
    try {
      const content = await file.text();
      const newImported: PasswordEntry[] = [];

      const autoCategory = (title: string, url: string, folder?: string): string => {
        const combined = `${title} ${url} ${folder || ''}`.toLowerCase();
        if (/twitter|x\.com|instagram|facebook|linkedin|tiktok|reddit|discord|telegram|snapchat|pinterest|whatsapp/.test(combined)) return 'social';
        if (/netflix|spotify|youtube|disney|hulu|twitch|prime|deezer|apple tv/.test(combined)) return 'entertainment';
        if (/udemy|coursera|khan|duolingo|university|school|edu|okul|akademi/.test(combined)) return 'education';
        if (/github|gitlab|jira|slack|aws|azure|cloud|office|zoom|trello|notion|figma|bank|finance|work/.test(combined)) return 'work';
        if (/amazon|ebay|trendyol|hepsiburada|aliexpress|etsy|walmart|shop/.test(combined)) return 'shopping';
        if (/steam|epic|playstation|xbox|riot|blizzard|ea|ubisoft|roblox|game/.test(combined)) return 'gaming';
        return 'other';
      };

      // 1. JSON parsing
      if (file.name.endsWith('.json') || content.trim().startsWith('{') || content.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(content);
          if (parsed && parsed.format === 'aegis-encrypted-v2' && parsed.encryptedEntries && typeof parsed.encryptedEntries === 'object') {
            for (const [entryId, encDoc] of Object.entries(parsed.encryptedEntries as Record<string, EncryptedEntryDoc>)) {
              try {
                const decrypted = await decryptEntryFromCloud(entryId, encDoc);
                newImported.push(decrypted);
              } catch (e) {
                console.error("Encrypted backup entry decryption failed:", entryId, e);
              }
            }
          }
          const items = Array.isArray(parsed) ? parsed : (parsed.entries || parsed.items || []);
          for (const item of items) {
            if (item.login && item.name) {
              const plainPassword = item.login.password || '';
              const username = item.login.username || '';
              const title = item.name || 'Untitled';
              const uri = (item.login.uris && item.login.uris[0] && item.login.uris[0].uri) || '';
              const encrypted = plainPassword ? await encryptData(plainPassword, cryptoKey) : { ciphertext: '', iv: '' };
              newImported.push({
                id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7),
                type: 'password',
                title,
                username,
                encryptedPassword: encrypted,
                plaintextPassword: plainPassword || undefined,
                category: autoCategory(title, uri, item.folder),
                lastModified: Date.now()
              });
            } else if (item.title && (item.encryptedPassword || item.password || item.plaintextPassword)) {
              let encrypted = item.encryptedPassword;
              let plain = item.plaintextPassword || item.password;
              if (!encrypted && plain) {
                encrypted = await encryptData(plain, cryptoKey);
              }
              if (encrypted) {
                newImported.push({
                  id: item.id || (Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7)),
                  type: item.type || 'password',
                  title: item.title,
                  username: item.username || '',
                  encryptedPassword: encrypted,
                  plaintextPassword: plain || undefined,
                  category: item.category || autoCategory(item.title, ''),
                  isFavorite: !!item.isFavorite,
                  lastModified: item.lastModified || Date.now(),
                  cost: item.cost,
                  currency: item.currency,
                  paymentMethod: item.paymentMethod,
                  renewalDate: item.renewalDate
                });
              }
            }
          }
        } catch (e) {
          console.error("JSON parse fallback", e);
        }
      }

      // 2. CSV parsing
      if (newImported.length === 0) {
        const parseCsvRows = (text: string) => {
          const rows: string[][] = [];
          let currentRow: string[] = [];
          let currentCell = '';
          let insideQuotes = false;

          for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
              if (insideQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
              } else {
                insideQuotes = !insideQuotes;
              }
            } else if (char === ',' && !insideQuotes) {
              currentRow.push(currentCell.trim());
              currentCell = '';
            } else if ((char === '\r' || char === '\n') && !insideQuotes) {
              if (char === '\r' && nextChar === '\n') i++;
              currentRow.push(currentCell.trim());
              if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0] !== '')) {
                rows.push(currentRow);
              }
              currentRow = [];
              currentCell = '';
            } else {
              currentCell += char;
            }
          }
          if (currentCell || currentRow.length > 0) {
            currentRow.push(currentCell.trim());
            rows.push(currentRow);
          }
          return rows;
        };

        const rows = parseCsvRows(content);
        if (rows.length > 1) {
          const headers = rows[0].map(h => h.toLowerCase());
          const titleIdx = headers.findIndex(h => h === 'name' || h === 'title' || h === 'platform');
          const urlIdx = headers.findIndex(h => h === 'url' || h === 'login_uri' || h === 'site');
          const userIdx = headers.findIndex(h => h === 'username' || h === 'login_username' || h === 'login' || h === 'email');
          const passIdx = headers.findIndex(h => h === 'password' || h === 'login_password');
          const folderIdx = headers.findIndex(h => h === 'folder' || h === 'grouping' || h === 'category');

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const title = (titleIdx >= 0 ? row[titleIdx] : '') || (urlIdx >= 0 ? row[urlIdx] : '') || 'Untitled';
            const url = urlIdx >= 0 ? row[urlIdx] : '';
            const username = userIdx >= 0 ? row[userIdx] : '';
            const plainPassword = passIdx >= 0 ? row[passIdx] : '';
            const folder = folderIdx >= 0 ? row[folderIdx] : '';

            if (title || username || plainPassword) {
              const encrypted = plainPassword ? await encryptData(plainPassword, cryptoKey) : { ciphertext: '', iv: '' };
              newImported.push({
                id: Date.now().toString() + '_' + Math.random().toString(36).substring(2, 7) + '_' + i,
                type: 'password',
                title: title.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || title,
                username,
                encryptedPassword: encrypted,
                plaintextPassword: plainPassword || undefined,
                category: autoCategory(title, url, folder),
                lastModified: Date.now()
              });
            }
          }
        }
      }

      if (newImported.length > 0) {
        const ok = await saveMultipleEntries(newImported);
        if (ok) {
          tryHaptic(() => safeNotificationFeedback('success'));
          showToast(`✅ ${newImported.length} ${t("import_success") || "şifre başarıyla içe aktarıldı!"}`);
        }
      } else {
        alert("Geçerli bir şifre formatı (CSV veya JSON) bulunamadı. Lütfen dosyanızı kontrol edin.");
      }
    } catch (err: any) {
      console.error("Import error", err);
      alert("İçe aktarma hatası: " + err.message);
    }
  };

  const handleExportVault = async () => {
    try {
      const exportItems = await Promise.all(entries.map(async (e) => {
        let plain = e.plaintextPassword;
        if (!plain && e.encryptedPassword && e.encryptedPassword.ciphertext) {
          try {
            plain = await decryptData(e.encryptedPassword.ciphertext, e.encryptedPassword.iv, cryptoKey);
          } catch (err) {}
        }
        return {
          title: e.title,
          username: e.username,
          password: plain || '',
          type: e.type,
          category: e.category || 'other',
          cost: e.cost,
          currency: e.currency,
          renewalDate: e.renewalDate,
          isFavorite: e.isFavorite,
          lastModified: e.lastModified || parseInt(e.id, 10) || Date.now()
        };
      }));

      const backupData = {
        appName: "Aegis Vault",
        exportedAt: new Date().toISOString(),
        totalEntries: exportItems.length,
        customCategories,
        entries: exportItems
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aegis-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Yedek dosyası başarıyla indirildi!");
    } catch (e: any) {
      alert("Dışa aktarma hatası: " + e.message);
    }
  };

  const handleDeleteAllData = () => {
    setConfirmTextInput('');
    setConfirmDialog({
      title: t("delete_all_data"),
      message: t("delete_all_desc"),
      requireConfirmText: true,
      onConfirm: async () => {
        const ok = await deleteAllEntries();
        if (ok) {
          showToast(t("delete_all_data"));
        }
      }
    });
  };

  const filteredEntries = useMemo(() => {
    let filtered = entries;
    if (activeTab === 'fav') {
      filtered = filtered.filter(entry => entry.isFavorite);
    }
    return filtered.filter(entry => 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      entry.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [entries, searchQuery, activeTab]);

  const allCategoriesList = useMemo(() => {
    return getAllCategories(customCategories, t);
  }, [customCategories, t]);

  const currentTabEntries = useMemo(() => {
    if (activeTab === 'subs') return filteredEntries.filter(e => e.type === 'subscription');
    if (activeTab === 'card') return filteredEntries.filter(e => e.type === 'credit_card');
    if (activeTab === 'note') return filteredEntries.filter(e => e.type === 'secure_note');
    if (activeTab === 'old') return filteredEntries.filter(isPasswordOld);
    if (activeTab === 'all' || activeTab === 'fav') return filteredEntries.filter(e => e.type === 'password');
    return filteredEntries;
  }, [filteredEntries, activeTab]);

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return currentTabEntries.length;
    if (categoryId === 'other') {
      return currentTabEntries.filter(e => !e.category || e.category === 'other').length;
    }
    return currentTabEntries.filter(e => e.category === categoryId).length;
  };

  const totalMonthlyCostTRY = useMemo(() => {
    let total = 0;
    entries.filter(e => e.type === 'subscription').forEach(sub => {
      const cost = parseFloat(sub.cost || '0');
      if (!isNaN(cost) && exchangeRates[sub.currency || 'TRY']) {
        total += cost / exchangeRates[sub.currency || 'TRY'];
      }
    });
    return total;
  }, [entries, exchangeRates]);

  const displayUserName = userName || userEmail.split('@')[0];
  const userInitial = displayUserName.charAt(0).toUpperCase();

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', paddingBottom: '64px' }}>
          
          {/* User Profile Card */}
          <div className="glass-panel" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 700 }}>
              {userInitial}
            </div>
            <div>
              {isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="text" 
                      value={inlineNameInput}
                      onChange={(e) => setInlineNameInput(e.target.value)}
                      onBlur={finishInlineEdit}
                      className="neon-input"
                      style={{ fontSize: '20px', fontWeight: 600, padding: '8px 12px', width: '250px' }}
                      autoFocus
                      onKeyDown={(e) => { if (e.key === 'Enter') finishInlineEdit(); }}
                    />
                  <button onClick={finishInlineEdit} className="neon-btn primary flex-center" style={{ padding: '8px 16px' }}>
                    <Save size={18} />
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <h2 
                    onClick={startInlineEdit}
                    style={{ fontSize: '24px', fontWeight: 600, margin: 0, cursor: 'pointer' }}
                    title={t("click_to_edit_name")}
                  >
                    {displayUserName}
                  </h2>
                  <button onClick={startInlineEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    <Edit2 size={16} />
                  </button>
                </div>
              )}
              <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{userEmail}</p>
            </div>
          </div>

          <div className="glass-panel flex-col gap-6" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>{t("personalization")}</h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px' }}>{t("language")}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>{t("language_desc")}</p>
              </div>
              <CustomDropdown
                options={[
                  { value: 'tr', label: 'Türkçe' },
                  { value: 'en', label: 'English' },
                  { value: 'de', label: 'Deutsch' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' },
                  { value: 'it', label: 'Italiano' },
                  { value: 'pt', label: 'Português' },
                  { value: 'ru', label: 'Русский' },
                  { value: 'zh', label: '中文' },
                  { value: 'hi', label: 'हिन्दी' },
                  { value: 'ko', label: '한국어' },
                  { value: 'ja', label: '日本語' },
                  { value: 'ar', label: 'العربية' },
                  { value: 'fa', label: 'فارسی' },
                  { value: 'el', label: 'Ελληνικά' },
                  { value: 'he', label: 'עברית' },
                  { value: 'da', label: 'Dansk' },
                  { value: 'no', label: 'Norsk' },
                  { value: 'sv', label: 'Svenska' },
                  { value: 'fi', label: 'Suomi' },
                  { value: 'nl', label: 'Nederlands' },
                  { value: 'pl', label: 'Polski' },
                  { value: 'id', label: 'Bahasa Indonesia' },
                  { value: 'uk', label: 'Українська' },
                  { value: 'fil', label: 'Filipino (Tagalog)' }
                ]}
                value={i18n.language}
                onChange={(val) => {
                  i18n.changeLanguage(val);
                  localStorage.setItem('i18nextLng', val);
                  saveVaultPatch({ language: val });
                }}
                width="160px"
              />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '16px' }}>{t("currency") || "Para Birimi"}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t("currency_desc") || "Aylık gider hesaplamasında kullanılacak ana birim."}</p>
              </div>
              <CustomDropdown
                options={[
                  { value: 'TRY', label: 'TRY (₺)' },
                  { value: 'USD', label: 'USD ($)' },
                  { value: 'EUR', label: 'EUR (€)' },
                  { value: 'GBP', label: 'GBP (£)' },
                  { value: 'RUB', label: 'RUB (₽)' },
                  { value: 'INR', label: 'INR (₹)' },
                  { value: 'KRW', label: 'KRW (₩)' },
                  { value: 'CNY', label: 'CNY (¥)' },
                  { value: 'JPY', label: 'JPY (¥)' },
                  { value: 'BRL', label: 'BRL (R$)' },
                  { value: 'SAR', label: 'SAR (ر.س)' },
                  { value: 'AED', label: 'AED (د.إ)' },
                  { value: 'EGP', label: 'EGP (E£)' },
                  { value: 'IRR', label: 'IRR (﷼)' },
                  { value: 'ILS', label: 'ILS (₪)' },
                  { value: 'DKK', label: 'DKK (kr)' },
                  { value: 'NOK', label: 'NOK (kr)' },
                  { value: 'SEK', label: 'SEK (kr)' }
                ]}
                value={baseCurrency}
                onChange={(val) => {
                  saveVaultPatch({ baseCurrency: val });
                }}
                width="160px"
              />
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'mobile') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '850px', margin: '0 auto', paddingBottom: '64px' }}>
          
          <div className="glass-panel" style={{ padding: '28px', borderLeft: '4px solid #00f0ff' }}>
            <div className="flex-center gap-3" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
              <Smartphone size={24} style={{ color: '#00f0ff' }} />
              <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{t("mobile_companion") || "Mobil & Hızlı Erişim"}</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
              {t("mobile_companion_desc")}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            
            {/* Android AutoFill Service Card */}
            <div className="glass-panel flex-col gap-4" style={{ padding: '24px' }}>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 240, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Key size={20} style={{ color: '#00f0ff' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{t("android_autofill_title")}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{t("android_autofill_sub")}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {t("android_autofill_desc")}
              </p>
              <div style={{ fontSize: '12px', color: '#00f0ff', background: 'rgba(0, 240, 255, 0.08)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
                ⚙️ {t("android_autofill_setup")}
              </div>
            </div>

            {/* Cross-App Auto-Save Card */}
            <div className="glass-panel flex-col gap-4" style={{ padding: '24px' }}>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} style={{ color: '#a855f7' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{t("cross_app_save_title")}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{t("cross_app_save_sub")}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {t("cross_app_save_desc")}
              </p>
              <div style={{ fontSize: '12px', color: '#a855f7', background: 'rgba(168, 85, 247, 0.08)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
                🔒 {t("zero_knowledge_note")}
              </div>
            </div>

            {/* Mobile PWA Installation */}
            <div className="glass-panel flex-col gap-3" style={{ padding: '24px' }}>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(34, 197, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Smartphone size={20} style={{ color: '#22c55e' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{t("pwa_title")}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>iOS Safari & Android Chrome</p>
                </div>
              </div>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', paddingLeft: '20px', lineHeight: 1.6, margin: '8px 0 0 0' }}>
                <li><strong>iOS (Safari):</strong> <Share2 size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> {t("pwa_ios_step")}</li>
                <li><strong>Android (Chrome):</strong> {t("pwa_android_step")}</li>
              </ul>
            </div>

            {/* Bookmarklet */}
            <div className="glass-panel flex-col gap-3" style={{ padding: '24px' }}>
              <div className="flex-center gap-3" style={{ justifyContent: 'flex-start' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(234, 179, 8, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} style={{ color: '#eab308' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '16px' }}>{t("bookmarklet_title")}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{t("bookmarklet_sub")}</p>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
                {t("bookmarklet_desc")}
              </p>
              <div style={{ 
                background: 'rgba(0,0,0,0.3)', 
                padding: '10px', 
                borderRadius: '8px', 
                fontFamily: 'monospace', 
                fontSize: '11px', 
                color: '#00f0ff',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                javascript:(function()&#123;prompt('Aegis:',location.href);&#125;)();
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText("javascript:(function(){prompt('Aegis:',location.href);})();");
                  showToast(t("bookmarklet_copied"));
                }}
                className="neon-btn flex-center gap-2" 
                style={{ padding: '8px 14px', fontSize: '12px', alignSelf: 'flex-start' }}
              >
                <Copy size={14} /> {t("copy_code")}
              </button>
            </div>

          </div>

        </div>
      );
    }

    if (activeTab === 'data') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '850px', margin: '0 auto', paddingBottom: '64px' }}>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            accept=".csv,.json" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                parseAndImportFile(file);
                e.target.value = '';
              }
            }} 
            style={{ display: 'none' }} 
          />

          {/* Import Card */}
          <div className="glass-panel flex-col gap-6" style={{ padding: '32px', borderLeft: '4px solid var(--accent-primary)' }}>
            <div>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                <Upload size={22} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{t("import_data") || "Verileri İçe Aktar (CSV / JSON)"}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t("import_data_desc")}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Google Chrome (.csv)', 'Bitwarden (.csv / .json)', 'LastPass (.csv)', 'Aegis Backup (.json)'].map(tag => (
                <span key={tag} style={{ 
                  fontSize: '12px', 
                  padding: '4px 10px', 
                  borderRadius: '12px', 
                  background: 'rgba(255,255,255,0.06)', 
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-secondary)'
                }}>
                  {tag}
                </span>
              ))}
            </div>

            <button 
              onClick={() => fileInputRef.current?.click()} 
              className="neon-btn primary flex-center gap-2 w-full" 
              style={{ justifyContent: 'center', padding: '16px', fontSize: '15px' }}
            >
              <Upload size={18} /> {t("import_data") || "Dosya Seçerek İçe Aktar (.csv / .json)"}
            </button>
          </div>

          {/* Export Card */}
          <div className="glass-panel flex-col gap-6" style={{ padding: '32px' }}>
            <div>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                <Download size={22} style={{ color: '#22c55e' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{t("export_data") || "Verileri Dışa Aktar (JSON)"}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t("export_data_desc")}
              </p>
            </div>

            <button 
              onClick={handleExportVault} 
              className="neon-btn flex-center gap-2 w-full" 
              style={{ justifyContent: 'center', padding: '16px', fontSize: '15px' }}
            >
              <Download size={18} /> {t("export_data") || "Kasa Yedeğini İndir (JSON)"}
            </button>
          </div>

          {/* Automatic Local Encrypted Backup Card */}
          <div className="glass-panel flex-col gap-6" style={{ padding: '32px', borderLeft: '4px solid #22c55e' }}>
            <div>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                <Database size={22} style={{ color: '#22c55e' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>{t("local_backup_title")}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t("local_backup_desc")}
              </p>
              {vaultDirPath && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '8px', marginBottom: 0, wordBreak: 'break-all' }}>
                  {t("vault_folder_label")} <code>{vaultDirPath}</code>
                </p>
              )}
              {localBackupMeta && localBackupMeta.count > 0 ? (
                <p style={{ color: '#22c55e', fontSize: '13px', marginTop: '10px', marginBottom: 0 }}>
                  {t("last_backup_label")} <strong>{localBackupMeta.count} {t("entries_count_unit")}</strong> ({new Date(localBackupMeta.savedAt).toLocaleString(i18n.language)})
                </p>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '10px', marginBottom: 0 }}>
                  {t("no_local_backup")}
                </p>
              )}
            </div>

            <button
              onClick={handleRestoreLocalBackup}
              disabled={!localBackupMeta || localBackupMeta.count === 0}
              className="neon-btn flex-center gap-2 w-full"
              style={{ justifyContent: 'center', padding: '16px', fontSize: '15px', opacity: (!localBackupMeta || localBackupMeta.count === 0) ? 0.5 : 1 }}
            >
              <Database size={18} /> {t("restore_local_backup")}
            </button>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '0 0 8px 0' }}>
                <strong>{t("biweekly_backup_title")}</strong> {t("biweekly_backup_desc")}
              </p>
              {diskBackupMeta ? (
                <p style={{ color: '#22c55e', fontSize: '12px', margin: '0 0 12px 0', wordBreak: 'break-all' }}>
                  {t("last_disk_backup")} {new Date(diskBackupMeta.savedAt).toLocaleString(i18n.language)} — {t("next_disk_backup")} {new Date(diskBackupMeta.savedAt + TWO_WEEKS_MS).toLocaleDateString(i18n.language)}<br />
                  {t("backup_location")} {diskBackupMeta.path}
                </p>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '12px', margin: '0 0 12px 0' }}>
                  {t("no_disk_backup")}
                </p>
              )}
              <button
                onClick={() => saveEncryptedBackupToDisk(false)}
                disabled={entries.length === 0}
                className="neon-btn flex-center gap-2 w-full"
                style={{ justifyContent: 'center', padding: '12px', fontSize: '14px', opacity: entries.length === 0 ? 0.5 : 1 }}
              >
                <Save size={16} /> {t("backup_now_disk")}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="glass-panel flex-col gap-6" style={{ padding: '32px', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
            <div>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', marginBottom: '8px' }}>
                <Trash2 size={22} style={{ color: 'var(--accent-danger)' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: 'var(--accent-danger)' }}>{t("delete_all_data")}</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                {t("delete_all_desc")}
              </p>
            </div>

            <button 
              onClick={handleDeleteAllData} 
              className="neon-btn danger flex-center gap-2 w-full" 
              style={{ justifyContent: 'center', padding: '16px', fontSize: '15px' }}
            >
              <Trash2 size={18} /> {t("delete_all_data") || "Tüm Verileri Kalıcı Olarak Sil"}
            </button>
          </div>

        </div>
      );
    }

    const isSubTab = activeTab === 'subs';
    const isCardTab = activeTab === 'card';
    const isNoteTab = activeTab === 'note';
    
    let displayEntries = filteredEntries;
    if (isSubTab) displayEntries = filteredEntries.filter(e => e.type === 'subscription');
    else if (isCardTab) displayEntries = filteredEntries.filter(e => e.type === 'credit_card');
    else if (isNoteTab) displayEntries = filteredEntries.filter(e => e.type === 'secure_note');
    else if (activeTab === 'old') displayEntries = filteredEntries.filter(isPasswordOld);
    else if (activeTab === 'all' || activeTab === 'fav') displayEntries = filteredEntries.filter(e => e.type === 'password');

    if (selectedCategoryFilter !== 'all') {
      displayEntries = displayEntries.filter(e => {
        if (selectedCategoryFilter === 'other') {
          return !e.category || e.category === 'other';
        }
        return e.category === selectedCategoryFilter;
      });
    }

    if (isVaultLoading) {
      return (
        <div className="glass-panel flex-col flex-center" style={{ padding: '64px 24px', opacity: 0.8, marginTop: '24px' }}>
          <Shield size={42} style={{ marginBottom: '16px', color: 'var(--accent-primary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{t("vault_loading")}</p>
        </div>
      );
    }

    if (vaultLoadError) {
      return (
        <div className="glass-panel flex-col flex-center" style={{ padding: '48px 24px', marginTop: '24px', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
          <AlertTriangle size={44} style={{ marginBottom: '14px', color: 'var(--accent-danger)' }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
            {t("vault_load_error_title")}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', textAlign: 'center', maxWidth: '420px' }}>
            {vaultLoadError}
          </p>
          <button onClick={fetchVault} className="neon-btn primary" style={{ padding: '10px 20px' }}>
            {t("retry")}
          </button>
        </div>
      );
    }

    if (decryptionFailedCount > 0 && entries.length === 0) {
      return (
        <div className="glass-panel flex-col flex-center" style={{ padding: '48px 24px', marginTop: '24px', borderColor: 'rgba(239, 68, 68, 0.35)' }}>
          <AlertTriangle size={44} style={{ marginBottom: '14px', color: 'var(--accent-danger)' }} />
          <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px', textAlign: 'center' }}>
            {decryptionFailedCount} {t("decryption_failed_title")}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px', textAlign: 'center', maxWidth: '420px' }}>
            {t("decryption_failed_desc")}
          </p>
          <button onClick={onLock} className="neon-btn primary" style={{ padding: '10px 20px' }}>
            {t("lock_and_retry")}
          </button>
        </div>
      );
    }

    if (displayEntries.length === 0) {
      return (
        <div className="glass-panel flex-col flex-center" style={{ padding: '64px 24px', opacity: 0.7, marginTop: '24px' }}>
          {activeTab === 'old' ? (
            <>
              <Clock size={48} style={{ marginBottom: '16px', color: '#22c55e' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '16px', fontWeight: 500 }}>
                {t("no_old_passwords")}
              </p>
            </>
          ) : (
            <>
              <Key size={48} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }} />
              <p style={{ color: 'var(--text-secondary)' }}>
                {t("vault_empty")}
              </p>
            </>
          )}
        </div>
      );
    }

    if (isNoteTab) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {displayEntries.map(entry => (
            <div key={entry.id} className="password-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
              <div className="flex-center w-full" style={{ justifyContent: 'space-between', marginBottom: '12px' }}>
                <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{entry.title}</h3>
                  {renderCategoryBadge(entry.category)}
                </div>
                <div className="flex-center gap-2">
                  <button onClick={() => toggleFavorite(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Star size={16} fill={entry.isFavorite ? "gold" : "transparent"} color={entry.isFavorite ? "gold" : "var(--text-secondary)"} />
                  </button>
                  <button onClick={() => handleReveal(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                    {entry.plaintextPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button onClick={() => openEditModal(entry)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)' }}><Trash2 size={16} /></button>
                </div>
              </div>
              <div style={{ 
                width: '100%', 
                background: 'rgba(0,0,0,0.1)', 
                padding: '16px', 
                borderRadius: '12px', 
                fontSize: '14px', 
                color: 'var(--text-secondary)', 
                minHeight: '100px', 
                whiteSpace: 'pre-wrap' 
              }}>
                {entry.plaintextPassword ? entry.plaintextPassword : "\u2022".repeat(30) + '\n' + "\u2022".repeat(30)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (isCardTab) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {displayEntries.map(entry => {
            let ccData: any = null;
            if (entry.plaintextPassword) {
              try { ccData = JSON.parse(entry.plaintextPassword); } catch (e) { }
            }
            return (
              <div key={entry.id} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                  <div className="flex-center gap-2" style={{ flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '1px' }}>{entry.title}</span>
                    {renderCategoryBadge(entry.category)}
                  </div>
                  <div className="flex-center gap-2">
                    <button onClick={() => toggleFavorite(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Star size={16} fill={entry.isFavorite ? "gold" : "transparent"} color={entry.isFavorite ? "gold" : "var(--text-secondary)"} />
                    </button>
                    <button onClick={() => handleReveal(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      {entry.plaintextPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => openEditModal(entry)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(entry.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>

                <div style={{ fontSize: '22px', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '24px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {ccData ? ccData.number : "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022"}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div className="flex-col">
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t("card_holder_label")}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '1px' }}>{entry.username.toUpperCase() || t("name_surname")}</span>
                  </div>
                  <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{t("expiry_label")}</span>
                    <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{ccData ? ccData.expiry : "\u2022\u2022/\u2022\u2022"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="flex-col gap-4">
        <SwipeableList type={SwipeableListType.IOS} fullSwipe={false}>
        {displayEntries.map(entry => (
          <SwipeableListItem
            key={entry.id}
            leadingActions={
              <LeadingActions>
                <SwipeAction onClick={() => openEditModal(entry)}>
                  <div className="flex-center" style={{ background: 'var(--accent-color)', color: 'white', padding: '0 24px', borderRadius: '16px', margin: '0 8px 16px 0', height: 'calc(100% - 16px)' }}>
                    <Edit2 size={24} />
                  </div>
                </SwipeAction>
              </LeadingActions>
            }
            trailingActions={
              <TrailingActions>
                <SwipeAction destructive={true} onClick={() => handleDelete(entry.id)}>
                  <div className="flex-center" style={{ background: 'var(--accent-danger)', color: 'white', padding: '0 24px', borderRadius: '16px', margin: '0 0 16px 8px', height: 'calc(100% - 16px)' }}>
                    <Trash2 size={24} />
                  </div>
                </SwipeAction>
              </TrailingActions>
            }
          >
            <div className="password-card" style={{ width: '100%', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{entry.title}</h3>
                <button 
                  onClick={() => toggleFavorite(entry.id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star size={16} fill={entry.isFavorite ? "gold" : "transparent"} color={entry.isFavorite ? "gold" : "var(--text-secondary)"} />
                </button>
                {renderCategoryBadge(entry.category)}
                {isPasswordOld(entry) && (
                  <span 
                    className="badge-old-password" 
                    title={t("password_old_warning") || "Bu şifre 90+ gündür güncellenmedi"}
                  >
                    <Clock size={12} /> {t("password_old_badge") || "90+ gün"}
                  </span>
                )}
              </div>
              
              {entry.type === 'subscription' ? (
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                  <span className="flex-center gap-2" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <CardIcon size={14} /> {entry.cost} {entry.currency} ({entry.paymentMethod})
                  </span>
                  <span className="flex-center gap-2" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} /> Yenilenme: {formatDate(entry.renewalDate || '')}
                  </span>
                </div>
              ) : (
                <p 
                  onClick={() => entry.username && handleCopyUsername(entry.username)}
                  style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0', cursor: entry.username ? 'pointer' : 'default' }}
                  title={entry.username ? t("click_copy_username") : undefined}
                >
                  {entry.username}
                </p>
              )}
            </div>
            
            <div className="flex-center gap-2">
              <div className="password-text-box">
                {entry.plaintextPassword ? entry.plaintextPassword : "\u2022".repeat(16)}
              </div>
              <button 
                onClick={() => handleReveal(entry.id)} 
                className="neon-btn" 
                style={{ padding: '10px' }}
                title={t("toggle_password_visibility")}
              >
                {entry.plaintextPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button 
                onClick={() => handleCopyPassword(entry)} 
                className="neon-btn" 
                style={{ padding: '10px' }}
                title={t("copy_password") || "Şifreyi Kopyala (30s sonra temizlenir)"}
              >
                <Copy size={18} />
              </button>
              <button 
                onClick={() => handleShareAccount(entry)} 
                className="neon-btn" 
                style={{ padding: '10px' }}
                title={t("share_handoff")}
              >
                <Share2 size={18} />
              </button>
              <button onClick={() => openEditModal(entry)} className="neon-btn" style={{ padding: '10px' }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="neon-btn" style={{ padding: '10px', color: 'var(--accent-danger)' }}>
                <Trash2 size={18} />
              </button>
            </div>
            </div>
          </SwipeableListItem>
        ))}
        </SwipeableList>
      </div>
    );
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex-center gap-3 mb-8" style={{ padding: '0 8px' }}>
          <Shield size={32} style={{ color: 'var(--text-primary)' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>Aegis</h1>
        </div>

        <nav className="sidebar-nav">
          <div className={`sidebar-item ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            <LayoutGrid size={18} /> {t("all_items")}
          </div>
          <div className={`sidebar-item ${activeTab === 'fav' ? 'active' : ''}`} onClick={() => setActiveTab('fav')}>
            <Star size={18} /> {t("favorites")}
          </div>
          <div className={`sidebar-item ${activeTab === 'subs' ? 'active' : ''}`} onClick={() => setActiveTab('subs')}>
            <Bell size={18} /> {t("subscriptions")}
          </div>
          <div className={`sidebar-item ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
            <CreditCard size={18} /> {t("credit_cards")}
          </div>
          <div className={`sidebar-item ${activeTab === 'note' ? 'active' : ''}`} onClick={() => setActiveTab('note')}>
            <FileText size={18} /> {t("secure_notes")}
          </div>
          <div className={`sidebar-item ${activeTab === 'old' ? 'active' : ''}`} onClick={() => setActiveTab('old')}>
            <Clock size={18} /> {t("old_passwords")}
            {oldPasswordsCount > 0 && (
              <span className="count-badge warning" style={{ marginLeft: 'auto', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                {oldPasswordsCount}
              </span>
            )}
          </div>
          <div className={`sidebar-item ${activeTab === 'mobile' ? 'active' : ''}`} onClick={() => setActiveTab('mobile')}>
            <Smartphone size={18} /> {t("mobile_companion")}
          </div>
          <div style={{ marginTop: 'auto' }} className="flex-col gap-2">
            <div className={`sidebar-item ${activeTab === 'data' ? 'active' : ''}`} onClick={() => setActiveTab('data')}>
              <Database size={18} /> {t("data_management")}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="topbar" style={{ position: 'relative', zIndex: 1000 }}>
          <div className="mobile-logo">
            <Shield size={24} style={{ color: 'var(--text-primary)' }} />
            <h1 style={{ fontSize: '20px', fontWeight: 700, margin: 0, letterSpacing: '0.5px' }}>Aegis</h1>
          </div>
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="search-input" 
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex-center gap-3">
            {/* Old Password Alert Pill if any */}
            {oldPasswordsCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('old')}
                className="neon-btn flex-center gap-2"
                style={{ padding: '8px 12px', borderRadius: '12px', fontSize: '12px', background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}
                title={`${oldPasswordsCount} ${t("old_passwords_tooltip")}`}
              >
                <AlertTriangle size={15} />
                <span>{oldPasswordsCount}</span>
              </button>
            )}

            <button onClick={toggleTheme} className="neon-btn flex-center" style={{ padding: '10px', width: '42px', height: '42px', borderRadius: '12px' }}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="neon-btn flex-center gap-2" 
                style={{ padding: '8px 16px', borderRadius: '24px', background: 'var(--accent-primary)', border: 'none' }}
              >
                <div style={{ color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                  {displayUserName}
                </div>
                <ChevronDown size={16} style={{ color: '#fff' }} />
              </button>

              {isProfileOpen && (
                <div className="glass-panel" style={{ 
                  position: 'absolute', top: '120%', right: '0', 
                  width: '240px', padding: '16px', zIndex: 100, 
                  display: 'flex', flexDirection: 'column', gap: '12px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}>
                  <button onClick={() => { setActiveTab('profile'); setIsProfileOpen(false); }} className="neon-btn w-full flex-center gap-2" style={{ padding: '12px', fontSize: '14px' }}>
                    <User size={16} /> {t("profile")}
                  </button>
                  
                  <button onClick={onLock} className="neon-btn w-full flex-center gap-2" style={{ padding: '12px', fontSize: '14px' }}>
                    <LogOut size={16} /> {t("lock")}
                  </button>
                  <button onClick={handleSignOut} className="neon-btn danger w-full flex-center gap-2" style={{ padding: '12px', fontSize: '14px' }}>
                    <LogOut size={16} /> {t("logout")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-area">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: (activeTab !== 'profile' && activeTab !== 'data' && activeTab !== 'mobile') ? '20px' : '32px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600 }}>
                {activeTab === 'all' ? t('all_items') : 
                 activeTab === 'fav' ? t('favorites') : 
                 activeTab === 'subs' ? t('subscriptions') : 
                 activeTab === 'card' ? t('credit_cards') : 
                 activeTab === 'note' ? t('secure_notes') : 
                 activeTab === 'old' ? t('old_passwords') :
                 activeTab === 'mobile' ? t('mobile_companion') :
                 activeTab === 'profile' ? t("profile") : 
                 t("data_management")}
              </h2>
              {activeTab === 'subs' && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {t("monthly_cost")} <strong style={{ color: 'var(--text-primary)' }}>~{totalMonthlyCostTRY.toFixed(2)} TL</strong>
                </p>
              )}
              {activeTab === 'old' && (
                <p style={{ color: '#f59e0b', fontSize: '13px', marginTop: '4px' }}>
                  ⚠️ {oldPasswordsCount} {t("old_passwords_banner")}
                </p>
              )}
            </div>
            
            {(activeTab !== 'profile' && activeTab !== 'data' && activeTab !== 'mobile') && (
              <button onClick={() => { setIsAdding(true); setEditingId(null); }} className="neon-btn primary flex-center gap-2" style={{ padding: '12px 20px', borderRadius: '12px' }}>
                <Plus size={18} /> {t("add_new")}
              </button>
            )}
          </div>

          {(activeTab === 'all' || activeTab === 'fav' || activeTab === 'subs' || activeTab === 'card' || activeTab === 'note' || activeTab === 'old') && (
            <div className="category-bar-container">
              <div className="category-bar">
                <button
                  type="button"
                  className={`category-chip ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategoryFilter('all')}
                >
                  <LayoutGrid size={14} className="category-icon" />
                  <span>{t('category_all')}</span>
                  <span className="count-badge">{currentTabEntries.length}</span>
                </button>

                {allCategoriesList.map(cat => {
                  const CatIcon = cat.icon;
                  const count = getCategoryCount(cat.id);
                  const isActive = selectedCategoryFilter === cat.id;
                  return (
                    <div key={cat.id} className="category-chip-wrapper">
                      <button
                        type="button"
                        className={`category-chip ${isActive ? 'active' : ''}`}
                        onClick={() => setSelectedCategoryFilter(cat.id)}
                        style={isActive ? { borderColor: cat.color, color: 'var(--text-primary)' } : {}}
                      >
                        <CatIcon size={14} className="category-icon" style={{ color: cat.color }} />
                        <span>{cat.name}</span>
                        {count > 0 && <span className="count-badge">{count}</span>}
                      </button>
                      {cat.isCustom && (
                        <button
                          type="button"
                          className="category-delete-btn"
                          title={t('delete')}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(cat.id);
                          }}
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}

                {isAddingCategoryInline ? (
                  <div className="category-inline-add">
                    <input
                      type="text"
                      className="neon-input"
                      placeholder={t('new_category_name')}
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleInlineAddCategory();
                        } else if (e.key === 'Escape') {
                          setIsAddingCategoryInline(false);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleInlineAddCategory}
                      className="neon-btn primary flex-center"
                      style={{ padding: '6px 12px' }}
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsAddingCategoryInline(false); setCustomCategoryInput(''); }}
                      className="neon-btn flex-center"
                      style={{ padding: '6px 10px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="category-add-chip"
                    onClick={() => setIsAddingCategoryInline(true)}
                  >
                    <Plus size={14} />
                    <span>{t('add_category')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isAdding && (
        <div className="modal-overlay">
          <div className="glass-panel modal-content">
            <div className="flex-center w-full" style={{ justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600 }}>
                {editingId ? (t("edit_content") || "İçeriği Düzenle") : t("add_password")}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdd} className="flex-col gap-4">
              <input 
                type="text" 
                placeholder={t("platform_title")} 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="neon-input"
                required
              />

              {activeTab === 'card' ? (
                <>
                  <input 
                    type="text" 
                    placeholder={t("card_name_placeholder")} 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="neon-input"
                    required
                  />
                  <input 
                    type="text" 
                    placeholder={t("card_number_placeholder")} 
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                    className="neon-input"
                    required
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="text" 
                      placeholder="AA/YY" 
                      value={ccExpiry}
                      onChange={(e) => setCcExpiry(e.target.value)}
                      className="neon-input"
                      style={{ flex: 1 }}
                      required
                    />
                    <input 
                      type="password" 
                      placeholder="CVV" 
                      maxLength={4}
                      value={ccCvv}
                      onChange={(e) => setCcCvv(e.target.value)}
                      className="neon-input"
                      style={{ flex: 1 }}
                      required
                    />
                  </div>
                </>
              ) : activeTab === 'subs' ? (
                <>
                  <input 
                    type="text" 
                    placeholder={t("username_email")} 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="neon-input"
                  />
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input 
                      type="number" 
                      placeholder={t("cost_placeholder")} 
                      value={subCost}
                      onChange={(e) => setSubCost(e.target.value)}
                      className="neon-input"
                      style={{ flex: 2 }}
                      required
                    />
                    <select 
                      className="neon-input" 
                      value={subCurrency}
                      onChange={(e) => setSubCurrency(e.target.value)}
                      style={{ 
                        flex: 1, 
                        padding: '12px',
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        appearance: 'none',
                        WebkitAppearance: 'none'
                      }}
                    >
                      <option value="TRY" style={{ background: '#141416', color: '#ededed' }}>TRY (₺)</option>
                      <option value="USD" style={{ background: '#141416', color: '#ededed' }}>USD ($)</option>
                      <option value="EUR" style={{ background: '#141416', color: '#ededed' }}>EUR (€)</option>
                    </select>
                  </div>
                  <input 
                    type="text" 
                    placeholder={t("payment_method_placeholder")} 
                    value={subMethod}
                    onChange={(e) => setSubMethod(e.target.value)}
                    className="neon-input"
                  />
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{t("renewal_date_label")}</label>
                    <input 
                      type="date" 
                      value={subDate}
                      onChange={(e) => setSubDate(e.target.value)}
                      className="neon-input w-full"
                    />
                  </div>
                </>
              ) : activeTab === 'note' ? (
                <textarea 
                  placeholder="Gizli notunuz..." 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="neon-input"
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  required={!editingId}
                />
              ) : (
                <>
                  <input 
                    type="text" 
                    placeholder={t("username_email")} 
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="neon-input"
                  />
                  <div style={{ position: 'relative' }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder={editingId ? t("leave_blank_keep_password") : t("password")} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="neon-input w-full"
                      required={!editingId}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => {
                      const pwd = generatePassword();
                      setNewPassword(pwd);
                      setShowNewPassword(true);
                    }}
                    className="neon-btn"
                    style={{ alignSelf: 'flex-start', padding: '6px 12px', fontSize: '12px' }}
                  >
                    {t("generate")}
                  </button>
                </>
              )}

              {/* Category Selection */}
              <div className="flex-col gap-2">
                <div className="flex-center" style={{ justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t('category')}</label>
                  {!isAddingCategoryModal && (
                    <button 
                      type="button"
                      className="category-add-chip"
                      style={{ padding: '2px 8px', fontSize: '11px' }}
                      onClick={() => setIsAddingCategoryModal(true)}
                    >
                      <Plus size={12} />
                      <span>{t('add_category')}</span>
                    </button>
                  )}
                </div>
                <select 
                  className="neon-input w-full"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ 
                    padding: '12px 16px',
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    appearance: 'none',
                    WebkitAppearance: 'none'
                  }}
                >
                  {allCategoriesList.map(cat => (
                    <option key={cat.id} value={cat.id} style={{ background: '#141416', color: '#ededed' }}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                {isAddingCategoryModal && (
                  <div className="category-inline-add">
                    <input 
                      type="text" 
                      className="neon-input" 
                      style={{ padding: '6px 12px', fontSize: '13px' }} 
                      placeholder={t("new_category_name")} 
                      value={modalCategoryInput}
                      onChange={(e) => setModalCategoryInput(e.target.value)}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleModalAddCategory();
                        } else if (e.key === 'Escape') {
                          setIsAddingCategoryModal(false);
                        }
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={handleModalAddCategory} 
                      className="neon-btn primary flex-center" 
                      style={{ padding: '6px 12px' }}
                    >
                      <Check size={14} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setIsAddingCategoryModal(false); setModalCategoryInput(''); }} 
                      className="neon-btn flex-center" 
                      style={{ padding: '6px 10px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="neon-btn w-full">{t('cancel')}</button>
                <button type="submit" className="neon-btn primary w-full">{t("save_encrypted")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmDialog && (
        <div
          className="modal-overlay"
          style={{ zIndex: 2000 }}
          onClick={() => { setConfirmDialog(null); setConfirmTextInput(''); }}
        >
          <div
            className="glass-panel modal-content"
            style={{ maxWidth: '420px', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle size={20} style={{ color: 'var(--accent-danger)' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{confirmDialog.title}</h3>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
              {confirmDialog.message}
            </p>

            {confirmDialog.requireConfirmText && (
              <input
                type="text"
                className="neon-input"
                style={{ marginBottom: '18px' }}
                placeholder="DELETE / SIL"
                value={confirmTextInput}
                onChange={(e) => setConfirmTextInput(e.target.value)}
                autoFocus
              />
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={() => { setConfirmDialog(null); setConfirmTextInput(''); }}
                className="neon-btn w-full"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                disabled={confirmDialog.requireConfirmText && confirmTextInput.trim().toUpperCase() !== 'DELETE' && confirmTextInput.trim().toUpperCase() !== 'SIL'}
                onClick={async () => {
                  const action = confirmDialog.onConfirm;
                  setConfirmDialog(null);
                  setConfirmTextInput('');
                  await action();
                }}
                className="neon-btn danger w-full"
                style={{
                  opacity: (confirmDialog.requireConfirmText && confirmTextInput.trim().toUpperCase() !== 'DELETE' && confirmTextInput.trim().toUpperCase() !== 'SIL') ? 0.45 : 1
                }}
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-primary)',
          color: 'var(--text-primary)',
          padding: '12px 24px',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            boxShadow: '0 0 8px var(--accent-primary)'
          }} />
          <span style={{ fontWeight: 500, fontSize: '14px' }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Vault;