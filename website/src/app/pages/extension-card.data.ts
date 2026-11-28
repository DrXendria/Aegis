export interface ExtensionCardCopy {
  badge: string;
  title: string;
  desc: string;
  storeNote: string;
  browsers: string;
}

const EN_EXT: ExtensionCardCopy = {
  badge: '100% Local Bridge',
  title: 'Browser Extension — Autofill & Auto-Save',
  desc: 'Fill saved logins with one click and save new accounts automatically. Connects only to your unlocked Aegis Desktop app on 127.0.0.1—never touches the cloud.',
  storeNote: 'Coming to Browser Stores',
  browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
};

export const EXTENSION_CARD_BY_LANG: Record<string, ExtensionCardCopy> = {
  en: EN_EXT,
  tr: {
    badge: '%100 Yerel Köprü',
    title: 'Tarayıcı Eklentisi — Otomatik Doldurma & Kaydetme',
    desc: 'Kayıtlı şifrelerini tek tıkla doldur, yeni hesap açtığında otomatik olarak kasana kaydet. Sadece bilgisayarındaki Aegis masaüstü uygulamasıyla yerel olarak haberleşir.',
    storeNote: 'Tarayıcı Mağazalarında Yakında',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  de: {
    badge: '100 % Lokale Brücke',
    title: 'Browser-Erweiterung — Auto-Fill & Auto-Save',
    desc: 'Fülle gespeicherte Logins mit einem Klick aus und speichere neue Zugänge automatisch. Verbindet sich nur lokal mit deiner Aegis-Desktop-App.',
    storeNote: 'Bald in Browser-Stores',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  es: {
    badge: 'Puente 100 % local',
    title: 'Extensión de navegador — Autocompletado y autoguardado',
    desc: 'Rellena tus accesos en un clic y guarda nuevas cuentas automáticamente. Solo se conecta de forma local con tu app de escritorio Aegis.',
    storeNote: 'Próximamente en tiendas',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  fr: {
    badge: 'Pont 100 % local',
    title: 'Extension navigateur — Remplissage & enregistrement auto',
    desc: 'Remplissez vos identifiants en un clic et enregistrez vos nouveaux comptes automatiquement. Connexion uniquement locale avec Aegis Desktop.',
    storeNote: 'Bientôt sur les stores',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  it: {
    badge: 'Bridge 100% locale',
    title: 'Estensione browser — Compilazione e salvataggio auto',
    desc: 'Compila gli accessi con un clic e salva automaticamente i nuovi account. Comunica solo in locale con la tua app desktop Aegis.',
    storeNote: 'Presto negli store',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  pt: {
    badge: 'Ponte 100% local',
    title: 'Extensão de navegador — Preenchimento e salvamento auto',
    desc: 'Preencha logins salvos com um clique e salve novas contas automaticamente. Conecta-se apenas localmente ao seu app desktop Aegis.',
    storeNote: 'Em breve nas lojas',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  ru: {
    badge: '100% локальный мост',
    title: 'Расширение для браузера — Автозаполнение и сохранение',
    desc: 'Заполняйте сохранённые логины в один клик и автоматически сохраняйте новые аккаунты. Работает строго локально с настольным Aegis.',
    storeNote: 'Скоро в магазинах браузеров',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  zh: {
    badge: '100% 本地桥接',
    title: '浏览器扩展 — 自动填充与自动保存',
    desc: '一键填充已保存的登录信息，并在注册新账号时自动提示保存。仅与本地已解锁的 Aegis 桌面端通信，绝不上传云端。',
    storeNote: '即将上线浏览器商店',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  hi: {
    badge: '100% लोकल ब्रिज',
    title: 'ब्राउज़र एक्सटेंशन — ऑटोफ़िल और ऑटो-सेव',
    desc: 'एक क्लिक में सहेजे गए लॉगिन भरें और नए खाते अपने आप सहेजें। केवल आपके कंप्यूटर के Aegis डेस्कटॉप ऐप से लोकली जुड़ता है।',
    storeNote: 'ब्राउज़र स्टोर पर जल्द आ रहा है',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  ko: {
    badge: '100% 로컬 브리지',
    title: '브라우저 확장 프로그램 — 자동 완성 및 자동 저장',
    desc: '저장된 로그인을 한 번의 클릭으로 입력하고 새 계정을 자동으로 저장합니다. 클라우드 없이 로컬 Aegis 데스크톱 앱과만 연결됩니다.',
    storeNote: '브라우저 스토어 출시 예정',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  ja: {
    badge: '100% ローカル接続',
    title: 'ブラウザ拡張機能 — 自動入力・自動保存',
    desc: '保存済みログインをワンクリックで入力し、新規アカウントを自動で保存します。クラウドを使わずローカルの Aegis デスクトップとのみ通信します。',
    storeNote: '各ブラウザストアで近日公開',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  ar: {
    badge: 'جسر محلي 100%',
    title: 'إضافة المتصفح — التعبئة والحفظ التلقائي',
    desc: 'املأ بيانات الدخول بنقرة واحدة واحفظ الحسابات الجديدة تلقائياً. تتصل محلياً فقط بتطبيق Aegis على جهازك دون أي سحابة.',
    storeNote: 'قريباً في متاجر المتصفحات',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  fa: {
    badge: 'پل ۱۰۰٪ محلی',
    title: 'افزونه مرورگر — تکمیل و ذخیره خودکار',
    desc: 'ورودهای ذخیره‌شده را با یک کلیک پر کنید و حساب‌های جدید را خودکار ذخیره نمایید. فقط به صورت محلی به برنامه دسکتاپ Aegis متصل می‌شود.',
    storeNote: 'به‌زودی در فروشگاه مرورگرها',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  el: {
    badge: '100% Τοπική Γέφυρα',
    title: 'Επέκταση προγράμματος περιήγησης — Αυτόματη συμπλήρωση',
    desc: 'Συμπληρώστε αποθηκευμένες συνδέσεις με ένα κλικ και αποθηκεύστε νέους λογαριασμούς αυτόματα, μόνο τοπικά με το Aegis Desktop.',
    storeNote: 'Σύντομα στα καταστήματα',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  he: {
    badge: 'גשר מקומי 100%',
    title: 'תוסף דפדפן — מילוי ושמירה אוטומטית',
    desc: 'מלא פרטי התחברות בלחיצה אחת ושמור חשבונות חדשים אוטומטית. מתחבר מקומית בלבד לאפליקציית Aegis על המחשב שלך.',
    storeNote: 'בקרוב בחנויות הדפדפנים',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  da: {
    badge: '100 % lokal bro',
    title: 'Browserudvidelse — Auto-udfyld og auto-gem',
    desc: 'Udfyld gemte logins med ét klik og gem nye konti automatisk. Forbinder kun lokalt til din Aegis-desktopapp.',
    storeNote: 'Snart i browserbutikker',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  no: {
    badge: '100 % lokal bro',
    title: 'Nettleserutvidelse — Autofyll og autolagring',
    desc: 'Fyll inn lagrede pålogginger med ett klikk og lagre nye kontoer automatisk. Kobler seg kun lokalt til Aegis-skrivebordsappen.',
    storeNote: 'Snart i nettleserbutikker',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  sv: {
    badge: '100 % lokal brygga',
    title: 'Webbläsartillägg — Autofyll och autospara',
    desc: 'Fyll i sparade inloggningar med ett klick och spara nya konton automatiskt. Ansluter endast lokalt till Aegis skrivbordsapp.',
    storeNote: 'Snart i webbläsarbutiker',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  fi: {
    badge: '100 % paikallinen silta',
    title: 'Selainlaajennus — Automaattinen täyttö ja tallennus',
    desc: 'Täytä tallennetut kirjautumiset yhdellä napsautuksella ja tallenna uudet tilit automaattisesti. Yhdistää vain paikalliseen Aegis-sovellukseen.',
    storeNote: 'Pian selainkaupoissa',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  nl: {
    badge: '100% Lokale brug',
    title: 'Browserextensie — Automatisch invullen & opslaan',
    desc: 'Vul opgeslagen logins met één klik in en sla nieuwe accounts automatisch op. Verbindt alleen lokaal met je Aegis desktop-app.',
    storeNote: 'Binnenkort in browserwinkels',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  pl: {
    badge: '100% lokalny most',
    title: 'Rozszerzenie przeglądarki — Autouzupełnianie i zapis',
    desc: 'Uzupełniaj zapisane loginy jednym kliknięciem i automatycznie zapisuj nowe konta. Łączy się wyłącznie lokalnie z aplikacją Aegis.',
    storeNote: 'Wkrótce w sklepach przeglądarek',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  id: {
    badge: 'Jembatan 100% Lokal',
    title: 'Ekstensi Browser — Isi Otomatis & Simpan Otomatis',
    desc: 'Isi login tersimpan dalam satu klik dan simpan akun baru secara otomatis. Hanya terhubung secara lokal ke aplikasi desktop Aegis.',
    storeNote: 'Segera hadir di toko browser',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  uk: {
    badge: '100% локальний міст',
    title: 'Розширення браузера — Автозаповнення та збереження',
    desc: 'Заповнюйте збережені логіни в один клік і автоматично зберігайте нові акаунти. Працює виключно локально з настільним Aegis.',
    storeNote: 'Незабаром у магазинах браузерів',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
  fil: {
    badge: '100% Lokal na Bridge',
    title: 'Browser Extension — Autofill at Auto-Save',
    desc: 'Punan ang mga naka-save na login sa isang click at awtomatikong i-save ang bagong account. Lokal lamang na kumokonekta sa Aegis Desktop.',
    storeNote: 'Malapit na sa mga Browser Store',
    browsers: 'Opera GX • Chrome • Brave • Edge • Firefox',
  },
};

export function getExtensionCardCopy(lang: string): ExtensionCardCopy {
  return EXTENSION_CARD_BY_LANG[lang] ?? EN_EXT;
}
