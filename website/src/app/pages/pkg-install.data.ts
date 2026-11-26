export interface PkgInstallCopy {
  heading: string;
  subtitle: string;
  copy: string;
  copied: string;
}

const EN_PKG: PkgInstallCopy = {
  heading: 'Install via package manager',
  subtitle: 'Prefer the terminal? Install and update Aegis Vault directly from your system package manager.',
  copy: 'Copy',
  copied: 'Copied',
};

export const PKG_INSTALL_BY_LANG: Record<string, PkgInstallCopy> = {
  en: EN_PKG,
  tr: {
    heading: 'Paket yöneticisi ile kur',
    subtitle: 'Terminali mi tercih ediyorsun? Aegis Vault\'u sisteminin paket yöneticisinden doğrudan kur.',
    copy: 'Kopyala',
    copied: 'Kopyalandı',
  },
  de: {
    heading: 'Per Paketmanager installieren',
    subtitle: 'Lieber im Terminal? Installiere Aegis Vault direkt über deinen Paketmanager.',
    copy: 'Kopieren',
    copied: 'Kopiert',
  },
  es: {
    heading: 'Instalar con gestor de paquetes',
    subtitle: '¿Prefieres la terminal? Instala Aegis Vault directamente desde tu gestor de paquetes.',
    copy: 'Copiar',
    copied: 'Copiado',
  },
  fr: {
    heading: 'Installer via un gestionnaire de paquets',
    subtitle: 'Vous préférez le terminal ? Installez Aegis Vault directement depuis votre gestionnaire de paquets.',
    copy: 'Copier',
    copied: 'Copié',
  },
  it: {
    heading: 'Installa tramite gestore di pacchetti',
    subtitle: 'Preferisci il terminale? Installa Aegis Vault direttamente dal tuo gestore di pacchetti.',
    copy: 'Copia',
    copied: 'Copiato',
  },
  pt: {
    heading: 'Instalar via gerenciador de pacotes',
    subtitle: 'Prefere o terminal? Instale o Aegis Vault diretamente pelo gerenciador de pacotes.',
    copy: 'Copiar',
    copied: 'Copiado',
  },
  ru: {
    heading: 'Установка через менеджер пакетов',
    subtitle: 'Предпочитаете терминал? Установите Aegis Vault напрямую через менеджер пакетов.',
    copy: 'Копировать',
    copied: 'Скопировано',
  },
  zh: {
    heading: '通过包管理器安装',
    subtitle: '更喜欢终端？直接通过系统的包管理器安装和更新 Aegis Vault。',
    copy: '复制',
    copied: '已复制',
  },
  hi: {
    heading: 'पैकेज मैनेजर से इंस्टॉल करें',
    subtitle: 'टर्मिनल पसंद है? अपने सिस्टम के पैकेज मैनेजर से सीधे Aegis Vault इंस्टॉल करें।',
    copy: 'कॉपी',
    copied: 'कॉपी किया गया',
  },
  ko: {
    heading: '패키지 관리자로 설치',
    subtitle: '터미널을 선호하시나요? 시스템 패키지 관리자로 Aegis Vault를 바로 설치하세요.',
    copy: '복사',
    copied: '복사됨',
  },
  ja: {
    heading: 'パッケージマネージャーでインストール',
    subtitle: 'ターミナル派ですか？お使いのパッケージマネージャーから直接 Aegis Vault をインストールできます。',
    copy: 'コピー',
    copied: 'コピーしました',
  },
  ar: {
    heading: 'التثبيت عبر مدير الحزم',
    subtitle: 'تفضل الطرفية؟ ثبّت Aegis Vault مباشرة عبر مدير الحزم الخاص بنظامك.',
    copy: 'نسخ',
    copied: 'تم النسخ',
  },
  fa: {
    heading: 'نصب با مدیر بسته',
    subtitle: 'ترمینال را ترجیح می‌دهید؟ Aegis Vault را مستقیماً از مدیر بسته سیستم نصب کنید.',
    copy: 'کپی',
    copied: 'کپی شد',
  },
  el: {
    heading: 'Εγκατάσταση μέσω διαχειριστή πακέτων',
    subtitle: 'Προτιμάτε το τερματικό; Εγκαταστήστε το Aegis Vault απευθείας από τον διαχειριστή πακέτων.',
    copy: 'Αντιγραφή',
    copied: 'Αντιγράφηκε',
  },
  he: {
    heading: 'התקנה דרך מנהל חבילות',
    subtitle: 'מעדיף את הטרמינל? התקן את Aegis Vault ישירות ממנהל החבילות של המערכת.',
    copy: 'העתק',
    copied: 'הועתק',
  },
  da: {
    heading: 'Installer via pakkehåndtering',
    subtitle: 'Foretrækker du terminalen? Installer Aegis Vault direkte fra din pakkehåndtering.',
    copy: 'Kopiér',
    copied: 'Kopieret',
  },
  no: {
    heading: 'Installer via pakkebehandler',
    subtitle: 'Foretrekker du terminalen? Installer Aegis Vault direkte fra pakkebehandleren din.',
    copy: 'Kopier',
    copied: 'Kopiert',
  },
  sv: {
    heading: 'Installera via pakethanterare',
    subtitle: 'Föredrar du terminalen? Installera Aegis Vault direkt från din pakethanterare.',
    copy: 'Kopiera',
    copied: 'Kopierat',
  },
  fi: {
    heading: 'Asenna paketinhallinnalla',
    subtitle: 'Suositko päätettä? Asenna Aegis Vault suoraan järjestelmäsi paketinhallinnasta.',
    copy: 'Kopioi',
    copied: 'Kopioitu',
  },
  nl: {
    heading: 'Installeren via pakketbeheerder',
    subtitle: 'Liever de terminal? Installeer Aegis Vault rechtstreeks via je pakketbeheerder.',
    copy: 'Kopiëren',
    copied: 'Gekopieerd',
  },
  pl: {
    heading: 'Zainstaluj przez menedżer pakietów',
    subtitle: 'Wolisz terminal? Zainstaluj Aegis Vault bezpośrednio przez menedżer pakietów.',
    copy: 'Kopiuj',
    copied: 'Skopiowano',
  },
  id: {
    heading: 'Pasang lewat pengelola paket',
    subtitle: 'Lebih suka terminal? Pasang Aegis Vault langsung dari pengelola paket sistem Anda.',
    copy: 'Salin',
    copied: 'Disalin',
  },
  uk: {
    heading: 'Встановлення через менеджер пакетів',
    subtitle: 'Надаєте перевагу терміналу? Встановіть Aegis Vault безпосередньо через менеджер пакетів.',
    copy: 'Копіювати',
    copied: 'Скопійовано',
  },
  fil: {
    heading: 'I-install gamit ang package manager',
    subtitle: 'Mas gusto ang terminal? Direktang i-install ang Aegis Vault mula sa iyong package manager.',
    copy: 'Kopyahin',
    copied: 'Nakopya',
  },
};

export function getPkgInstallCopy(lang: string): PkgInstallCopy {
  return PKG_INSTALL_BY_LANG[lang] ?? EN_PKG;
}
