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
      <div className="developer-credit">
        {t('developed_by')}
      </div>
    </>
  );
}

export default App;
