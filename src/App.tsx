import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Login from './components/Login';
import Vault from './components/Vault';
import type { LocalAccount } from './localStore';

function App() {
  const { t } = useTranslation();
  const [cryptoKey, setCryptoKey] = useState<CryptoKey | null>(null);
  const [account, setAccount] = useState<LocalAccount | null>(null);

  const handleUnlock = (key: CryptoKey, unlockedAccount: LocalAccount) => {
    setCryptoKey(key);
    setAccount(unlockedAccount);
  };

  const handleLock = () => {
    setCryptoKey(null);
    setAccount(null);
  };

  return (
    <>
      {!cryptoKey || !account ? (
        <Login onUnlock={handleUnlock} />
      ) : (
        <Vault
          cryptoKey={cryptoKey}
          userId={account.id}
          userEmail={account.email}
          onLock={handleLock}
          onAccountUpdate={(updated) => setAccount(updated)}
          onMasterKeyChange={(newKey) => setCryptoKey(newKey)}
        />
      )}
      <div className="developer-credit">
        {t('developed_by')}
      </div>
    </>
  );
}

export default App;
