import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Vault from './components/Vault';

function App() {
  const { t } = useTranslation();
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleUnlock = (key: CryptoKey, uid: string) => {
    setCryptoKey(key);
    setUserId(uid);
  };

  const handleLock = () => {
    setCryptoKey(null);
    setUserId(null);
  };

  return (
    <>
      {!cryptoKey || !userId ? (
        <Login onUnlock={handleUnlock} />
      ) : (
        <Vault cryptoKey={cryptoKey} userId={userId} onLock={handleLock} />
      )}
      <div style={{ position: 'fixed', bottom: '16px', width: '100%', textAlign: 'center', fontSize: '12px', color: 'rgba(255, 255, 255, 0.3)', pointerEvents: 'none', zIndex: 100, letterSpacing: '0.5px' }}>
        {t('developed_by')}
      </div>
    </>
  );
}

export default App;
