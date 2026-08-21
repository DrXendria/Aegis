import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Shield, Plus, Key, LogOut, Copy, Eye, EyeOff, Sun, Moon, 
  Search, LayoutGrid, Star, CreditCard, FileText, X,
  Calendar, CreditCard as CardIcon, Bell, Download, Trash2, User, Edit2, ChevronDown, Save, Database
} from 'lucide-react';
import { encryptData, decryptData } from '../crypto';


import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { CustomDropdown } from './CustomDropdown';

interface VaultProps {
  cryptoKey: CryptoKey;
  userId: string;
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
  
  cost?: string;
  currency?: string;
  paymentMethod?: string;
  renewalDate?: string;
}

const Vault: React.FC<VaultProps> = ({ cryptoKey, userId, onLock }) => {
  const { t, i18n } = useTranslation();
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
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

  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [baseCurrency, setBaseCurrency] = useState('TRY');

  // Inline editing state for user name
  const [isEditingName, setIsEditingName] = useState(false);
  const [inlineNameInput, setInlineNameInput] = useState('');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const fetchVault = async () => {
      try {
        const docRef = doc(db, 'vaults', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEntries(data.entries || []);
          setUserName(data.userName || '');
          setBaseCurrency(data.baseCurrency || 'TRY');
        }
      } catch (err) {
        console.error("Failed to fetch vault", err);
      }
    };
    fetchVault();

    fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`)
      .then(res => res.json())
      .then(data => {
        if(data && data.rates) setExchangeRates(data.rates);
      })
      .catch(() => console.error("Could not fetch exchange rates"));
  }, [userId, baseCurrency]);

  const saveVault = async (newEntries: PasswordEntry[], nameToSave?: string, currencyToSave?: string) => {
    const finalName = nameToSave !== undefined ? nameToSave : userName;
    const finalCurrency = currencyToSave !== undefined ? currencyToSave : baseCurrency;
    setEntries(newEntries);
    if (nameToSave !== undefined) setUserName(nameToSave);
    
    try {
      const docRef = doc(db, 'vaults', userId);
      const secureEntries = newEntries.map(entry => {
        const { plaintextPassword, ...safeEntry } = entry;
        return safeEntry;
      });
      
      // JSON stringify/parse automatically strips all undefined values recursively
      const cleanData = JSON.parse(JSON.stringify({ 
        entries: secureEntries, 
        userName: finalName, 
        baseCurrency: finalCurrency 
      }));
      
      await setDoc(docRef, cleanData, { merge: true });
    } catch (err: any) {
      console.error("Failed to save vault to cloud", err);
      alert("Hata (Kaydedilemedi): " + err.message);
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < 16; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    setNewPassword(password);
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
      encryptedPassword: encrypted || { ciphertext: '', iv: '' },
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
        }
        newEntry.isFavorite = existing.isFavorite;
        newEntry.plaintextPassword = secretData || existing.plaintextPassword;
      }
      await saveVault(entries.map(e => e.id === editingId ? newEntry : e));
    } else {
      await saveVault([...entries, newEntry]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsAdding(false);
    setEditingId(null);
    setNewTitle('');
    setNewUsername('');
    setNewPassword('');
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

  const handleDelete = async (id: string) => {
    if (window.confirm(t("delete_confirm"))) {
      const newEntries = entries.filter(e => e.id !== id);
      await saveVault(newEntries);
    }
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
    const updatedEntries = entries.map(entry => 
      entry.id === id ? { ...entry, isFavorite: !entry.isFavorite } : entry
    );
    await saveVault(updatedEntries);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLock();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const startInlineEdit = () => {
    setInlineNameInput(displayUserName);
    setIsEditingName(true);
  };

  const finishInlineEdit = async () => {
    setIsEditingName(false);
    const newName = inlineNameInput.trim();
    if (newName !== userName) {
      try {
        await saveVault(entries, newName);
        const fallback = i18n.language === 'en' ? 'Name saved successfully:' : 'İsim başarıyla kaydedildi:';
        showToast(`${i18n.exists('name_saved_success') ? t('name_saved_success') : fallback} ${newName}`);
      } catch (err) {
        console.error("Save error", err);
      }
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}.${m}.${y}`;
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

  const userEmail = auth.currentUser?.email || 'User';
  const displayUserName = userName || userEmail.split('@')[0];
  const userInitial = displayUserName.charAt(0).toUpperCase();

  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', paddingBottom: '64px' }}>
          
          {/* User Profile Card - Inline Editable */}
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
                  { value: 'fi', label: 'Suomi' }
                ]}
                value={i18n.language}
                onChange={(val) => i18n.changeLanguage(val)}
                width="150px"
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
                  setBaseCurrency(val);
                  saveVault(entries, userName, val);
                }}
                width="160px"
              />
            </div>
          </div>

        </div>
      );
    }

    if (activeTab === 'data') {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto', paddingBottom: '64px' }}>
          {/* Data Management & Danger Zone */}
          <div className="glass-panel flex-col gap-6" style={{ padding: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', color: 'var(--accent-danger)' }}>{t("data_management")}</h3>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>{t("data_management_desc")}</p>

              <button onClick={() => {}} className="neon-btn flex-center gap-2 w-full" style={{ justifyContent: 'center', padding: '16px' }}>
                <Download size={18} /> {t("export_data")}
              </button>

              <button onClick={() => {}} className="neon-btn danger flex-center gap-2 w-full" style={{ justifyContent: 'center', padding: '16px' }}>
                <Trash2 size={18} /> {t("delete_all_data")}
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
    else if (activeTab === 'all' || activeTab === 'fav') displayEntries = filteredEntries.filter(e => e.type === 'password');

    if (displayEntries.length === 0) {
      return (
        <div className="glass-panel flex-col flex-center" style={{ padding: '64px 24px', opacity: 0.6, marginTop: '24px' }}>
          <Key size={48} style={{ marginBottom: '16px', color: 'var(--text-secondary)' }} />
          <p style={{ color: 'var(--text-secondary)' }}>
            {t("vault_empty")}
          </p>
        </div>
      );
    }

    if (isNoteTab) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {displayEntries.map(entry => (
            <div key={entry.id} className="password-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '24px' }}>
              <div className="flex-center w-full" style={{ justifyContent: 'space-between', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{entry.title}</h3>
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
                {entry.plaintextPassword ? entry.plaintextPassword : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢\nâ€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}
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
                  <span style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '1px' }}>{entry.title}</span>
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
                  {ccData ? ccData.number : 'â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢ â€¢â€¢â€¢â€¢'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div className="flex-col">
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Kart Sahibi</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, letterSpacing: '1px' }}>{entry.username.toUpperCase() || t("name_surname")}</span>
                  </div>
                  <div className="flex-col" style={{ alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Son Kullanma</span>
                    <span style={{ fontSize: '14px', fontFamily: 'monospace' }}>{ccData ? ccData.expiry : 'â€¢â€¢/â€¢â€¢'}</span>
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
        {displayEntries.map(entry => (
          <div key={entry.id} className="password-card">
            <div style={{ flex: 1 }}>
              <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{entry.title}</h3>
                <button 
                  onClick={() => toggleFavorite(entry.id)} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Star size={16} fill={entry.isFavorite ? "gold" : "transparent"} color={entry.isFavorite ? "gold" : "var(--text-secondary)"} />
                </button>
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
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{entry.username}</p>
              )}
            </div>
            
            <div className="flex-center gap-2">
              <div className="password-text-box">
                {entry.plaintextPassword ? entry.plaintextPassword : 'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢'}
              </div>
              <button onClick={() => handleReveal(entry.id)} className="neon-btn" style={{ padding: '10px' }}>
                {entry.plaintextPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button 
                onClick={() => { if (entry.plaintextPassword) navigator.clipboard.writeText(entry.plaintextPassword); }} 
                className="neon-btn" style={{ padding: '10px' }}
              >
                <Copy size={18} />
              </button>
              <button onClick={() => openEditModal(entry)} className="neon-btn" style={{ padding: '10px' }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(entry.id)} className="neon-btn" style={{ padding: '10px', color: 'var(--accent-danger)' }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
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
          
          <div className="flex-center gap-4">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 600 }}>
                {activeTab === 'all' ? t('all_items') : 
                 activeTab === 'fav' ? t('favorites') : 
                 activeTab === 'subs' ? t('subscriptions') : 
                 activeTab === 'card' ? t('credit_cards') : 
                 activeTab === 'note' ? t('secure_notes') : 
                 activeTab === 'profile' ? t("profile") : 
                 t("data_management")}
              </h2>
              {activeTab === 'subs' && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                  {t("monthly_cost")} <strong style={{ color: 'var(--text-primary)' }}>~{totalMonthlyCostTRY.toFixed(2)} TL</strong>
                </p>
              )}
            </div>
            
            {(activeTab !== 'profile' && activeTab !== 'data') && (
              <button onClick={() => { setIsAdding(true); setEditingId(null); }} className="neon-btn primary flex-center gap-2" style={{ padding: '12px 20px', borderRadius: '12px' }}>
                <Plus size={18} /> {t("add_new")}
              </button>
            )}
          </div>

          {renderContent()}
        </div>
      </main>

      {/* Add/Edit Item Modal */}
      {isAdding && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600 }}>
                {editingId ? t("edit") : (
                  activeTab === 'card' ? t("new_card") : 
                  activeTab === 'note' ? t("new_note") : 
                  activeTab === 'subs' ? t("new_sub") : t("new_pass")
                )}
              </h3>
              <button onClick={closeModal} className="neon-btn" style={{ padding: '8px', border: 'none' }}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAdd} className="flex-col gap-4">
              <input 
                type="text" 
                className="neon-input" 
                placeholder={activeTab === 'card' ? t("bank_name_placeholder") : activeTab === 'note' ? t("note_title_placeholder") : t("platform_placeholder")} 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />

              {(activeTab === 'all' || activeTab === 'fav' || activeTab === 'subs' || activeTab === 'card') && (
                <input 
                  type="text" 
                  className="neon-input" 
                  placeholder={activeTab === 'card' ? t("card_name_placeholder") : t("username_placeholder")} 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                />
              )}

              {activeTab === 'card' && (
                <>
                  <input 
                    type="text" 
                    className="neon-input" 
                    placeholder={t("card_number_placeholder")} 
                    value={ccNumber}
                    onChange={(e) => setCcNumber(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input 
                      type="text" 
                      className="neon-input" 
                      placeholder="SKT (AA/YY)" 
                      value={ccExpiry}
                      onChange={(e) => setCcExpiry(e.target.value)}
                    />
                    <input 
                      type="text" 
                      className="neon-input" 
                      placeholder="CVV" 
                      value={ccCvv}
                      onChange={(e) => setCcCvv(e.target.value)}
                    />
                  </div>
                </>
              )}

              {activeTab === 'note' && (
                <textarea 
                  className="neon-input" 
                  placeholder={t("note_placeholder")} 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ minHeight: '120px', resize: 'vertical' }}
                  required={!editingId}
                />
              )}

              {activeTab === 'subs' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="number" 
                    className="neon-input" 
                    placeholder={t("monthly_cost") + " (200)"} 
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <select 
                    className="neon-input" 
                    value={subCurrency}
                    onChange={(e) => setSubCurrency(e.target.value)}
                    style={{ flex: 1, padding: '0 12px' }}
                  >
                    <option value="TRY">TRY (₺)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="RUB">RUB (₽)</option>
                    <option value="INR">INR (₹)</option>
                    <option value="KRW">KRW (₩)</option>
                    <option value="CNY">CNY (¥)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              )}
              {activeTab === 'subs' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="neon-input" 
                    placeholder={t("payment_method_placeholder")} 
                    value={subMethod}
                    onChange={(e) => setSubMethod(e.target.value)}
                  />
                  <input 
                    type="date" 
                    className="neon-input" 
                    value={subDate}
                    onChange={(e) => setSubDate(e.target.value)}
                  />
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'fav' || activeTab === 'subs') && (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      className="neon-input" 
                      style={{ paddingRight: '44px', width: '100%' }}
                      placeholder={editingId ? t("new_pass_placeholder") : t('password')} 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required={!editingId}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button type="button" onClick={generatePassword} className="neon-btn flex-center gap-2" style={{ whiteSpace: 'nowrap' }}>
                    <Key size={18} /> {t('generate')}
                  </button>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={closeModal} className="neon-btn w-full">{t('cancel')}</button>
                <button type="submit" className="neon-btn primary w-full">{t("save_encrypted")}</button>
              </div>
            </form>
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
          border: '1px solid var(--accent)',
          color: 'var(--text-primary)',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--accent)',
            boxShadow: '0 0 8px var(--accent)'
          }} />
          <span style={{ fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Vault;