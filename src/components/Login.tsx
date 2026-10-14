import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Mail, User, ChevronRight, CheckCircle2, Eye, EyeOff, Fingerprint } from 'lucide-react';

const tryHaptic = (action: () => Promise<any>) => action().catch(() => {});

const safeNotificationFeedback = async (type: string) => {
  try {
    const mod = await import('@tauri-apps/plugin-haptics');
    return mod.notificationFeedback(type as any);
  } catch { /* plugin not available */ }
};

const safeBiometricCheckStatus = async () => {
  try {
    const mod = await import('@tauri-apps/plugin-biometric');
    return mod.checkStatus();
  } catch { return { isAvailable: false }; }
};

const safeBiometricAuthenticate = async (reason: string) => {
  const mod = await import('@tauri-apps/plugin-biometric');
  return mod.authenticate(reason);
};
import { deriveKeyFromMasterPassword } from '../crypto';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

interface LoginProps {
  onUnlock: (key: CryptoKey, uid: string) => void;
}

const Login: React.FC<LoginProps> = ({ onUnlock }) => {
  const { t, i18n } = useTranslation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [userName, setUserName] = useState('');
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [savedMasterPassword, setSavedMasterPassword] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUser(user);
        setEmail(user.email || '');
      } else {
        setFirebaseUser(null);
      }
    });
    
    const checkBio = async () => {
      try {
        const status = await safeBiometricCheckStatus();
        if (status.isAvailable) {
          setBiometricAvailable(true);
        }
      } catch (e) {
        console.warn("Biometrics not available or not supported on this platform.", e);
      }
    };
    checkBio();
    
    const saved = localStorage.getItem('aegis_master');
    if (saved) setSavedMasterPassword(saved);
    
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchName = async () => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'vaults', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            if (docSnap.data().userName) setUserName(docSnap.data().userName);
            if (docSnap.data().language && docSnap.data().language !== i18n.language) {
              i18n.changeLanguage(docSnap.data().language);
              localStorage.setItem('i18nextLng', docSnap.data().language);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchName();
  }, [firebaseUser]);

  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFirebaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !authPassword) {
      setError(t("login_err_empty"));
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, authPassword);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, authPassword);
      }
      setFirebaseUser(userCredential.user);
    } catch (err: any) {
      if (err.code === 'auth/configuration-not-found') {
        setError('Firebase panelinde "Authentication > Email/Password" ayarını açmayı unutmuşsunuz!');
      } else if (err.code === 'auth/invalid-credential') {
        setError(t("login_err_invalid"));
      } else {
        setError(err.message || t("login_err_fail"));
      }
      tryHaptic(() => safeNotificationFeedback('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const performUnlock = async (pass: string) => {
    setIsLoading(true);
    setError('');
    try {
      const encoder = new TextEncoder();
      const salt = new Uint8Array(16);
      const uidBytes = encoder.encode(firebaseUser.uid);
      for(let i=0; i<Math.min(16, uidBytes.length); i++) {
        salt[i] = uidBytes[i];
      }
      const key = await deriveKeyFromMasterPassword(pass, salt);
      localStorage.setItem('aegis_master', pass);
      setTimeout(() => {
        onUnlock(key, firebaseUser.uid);
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(t("login_err_master_invalid"));
      setIsLoading(false);
      tryHaptic(() => safeNotificationFeedback('error'));
    }
  };

  const handleMasterUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterPassword) {
      setError(t("login_err_master"));
      return;
    }
    performUnlock(masterPassword);
  };

  const handleBiometricUnlock = async () => {
    if (!savedMasterPassword) return;
    try {
      await safeBiometricAuthenticate(t("biometric_prompt") || 'Aegis kilidini açmak için parmak izinizi okutun');
      setMasterPassword(savedMasterPassword);
      performUnlock(savedMasterPassword);
    } catch (e) {
      setError(t("biometric_failed") || 'Biyometrik doğrulama başarısız oldu veya iptal edildi.');
      tryHaptic(() => safeNotificationFeedback('error'));
    }
  };

  return (
    <div className="flex-center w-full" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="auth-glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '420px' }}>
        <div className="flex-col flex-center mb-8">
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            padding: '16px',
            borderRadius: '20px',
            marginBottom: '20px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 8px 16px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <Shield size={42} style={{ color: 'var(--text-primary)' }} strokeWidth={1.5} />
          </div>
          <h2 className="elite-gradient-text" style={{ fontSize: '28px', fontWeight: 600, textAlign: 'center', letterSpacing: '-0.8px', marginBottom: '8px' }}>
            {firebaseUser ? `${t('login_welcome')}, ${userName || firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || t('login_user')}!` : 'Aegis'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', letterSpacing: '0.2px', textAlign: 'center', lineHeight: '1.5' }}>
            {firebaseUser 
              ? t("login_desc_vault") 
              : t("login_desc_cloud")}
          </p>
        </div>

        {!firebaseUser ? (
          <form onSubmit={handleFirebaseAuth} className="flex-col gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "8px" }}>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input
                  type="email"
                  className="neon-input"
                  style={{ padding: '15px 16px 15px 44px', borderRadius: '14px' }}
                  placeholder={t("login_email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
                <input
                  type={showAuthPassword ? "text" : "password"}
                  className="neon-input"
                  style={{ padding: '15px 44px 15px 44px', borderRadius: '14px' }}
                  placeholder={t("login_cloud_pass")}
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowAuthPassword(!showAuthPassword)}
                  style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  {showAuthPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ background: 'rgba(229, 72, 77, 0.1)', border: '1px solid rgba(229, 72, 77, 0.2)', padding: '12px', borderRadius: '10px', marginTop: '4px' }}>
                <p style={{ color: 'var(--accent-danger)', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>{error}</p>
              </div>
            )}
            <button 
              type="submit" 
              className="neon-btn primary w-full mt-2"
              disabled={isLoading}
              style={{ padding: '16px', fontSize: '15px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{isLoading ? '...' : (isRegistering ? t("login_register") : t("login_signin"))}</span>
              <ChevronRight size={18} opacity={0.7} />
            </button>
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
              className="w-full mt-2"
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', transition: 'color 0.2s', padding: '8px' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              {isRegistering ? t("login_has_account") : t("login_no_account")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleMasterUnlock} className="flex-col gap-4 animate-slide-up">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '20px', width: 'fit-content', margin: '0 auto 24px auto', border: '1px solid rgba(255,255,255,0.05)' }}>
              <CheckCircle2 size={14} style={{ color: '#4CC38A' }} />
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{email}</span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', top: '16px', left: '16px', color: 'var(--text-secondary)' }} />
              <input
                type={showMasterPassword ? "text" : "password"}
                className="neon-input"
                style={{ padding: '15px 44px 15px 44px', borderRadius: '14px', border: error ? '1px solid var(--accent-danger)' : undefined }}
                placeholder={t("login_master_pass")}
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowMasterPassword(!showMasterPassword)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                {showMasterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: 'var(--accent-danger)', fontSize: '13px', marginTop: '4px', textAlign: 'center', fontWeight: 500 }}>{error}</p>}
            <button 
              type="submit" 
              className="neon-btn primary w-full mt-2"
              disabled={isLoading}
              style={{ padding: '16px', fontSize: '15px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span>{isLoading ? t("login_opening") : t("login_unlock")}</span>
              <Lock size={18} opacity={0.7} />
            </button>
            {biometricAvailable && savedMasterPassword && (
              <button 
                type="button" 
                onClick={handleBiometricUnlock}
                className="neon-btn w-full flex-center gap-2"
                disabled={isLoading}
                style={{ padding: '16px', fontSize: '15px', borderRadius: '14px', marginTop: '4px', background: 'var(--bg-primary)' }}
              >
                <Fingerprint size={18} style={{ color: 'var(--text-primary)' }} />
                <span>{t("login_biometric") || "Parmak İzi ile Hızlı Giriş"}</span>
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
