export interface CookieCopy {
  title: string;
  message: string;
  accept: string;
  decline: string;
  privacyLink: string;
  manageLabel: string;
}

const EN_COOKIE: CookieCopy = {
  title: 'Cookies on this website',
  message:
    'We use optional cookies on this website to understand visitor regions and download counts. The Aegis desktop app itself remains 100% offline with zero tracking.',
  accept: 'Accept',
  decline: 'Decline',
  privacyLink: 'Privacy Policy',
  manageLabel: 'Cookie Preferences',
};

export const COOKIE_COPY_BY_LANG: Record<string, CookieCopy> = {
  en: EN_COOKIE,
  tr: {
    title: 'Bu sitede çerezler',
    message:
      'Bu web sitesinde ziyaretçi bölgelerini ve indirme sayılarını görmek için isteğe bağlı çerezler kullanıyoruz. Aegis masaüstü uygulaması %100 çevrimdışı kalır ve hiç veri toplamaz.',
    accept: 'Kabul Et',
    decline: 'Reddet',
    privacyLink: 'Gizlilik Politikası',
    manageLabel: 'Çerez Tercihleri',
  },
  de: {
    title: 'Cookies auf dieser Website',
    message:
      'Wir verwenden auf dieser Website optionale Cookies, um Besucherregionen und Downloadzahlen zu erfassen. Die Aegis-Desktop-App bleibt zu 100 % offline ohne Tracking.',
    accept: 'Akzeptieren',
    decline: 'Ablehnen',
    privacyLink: 'Datenschutz',
    manageLabel: 'Cookie-Einstellungen',
  },
  es: {
    title: 'Cookies en este sitio web',
    message:
      'Usamos cookies opcionales en este sitio para conocer las regiones de visita y las descargas. La app de escritorio Aegis sigue siendo 100 % sin conexión y sin rastreo.',
    accept: 'Aceptar',
    decline: 'Rechazar',
    privacyLink: 'Privacidad',
    manageLabel: 'Preferencias de cookies',
  },
  fr: {
    title: 'Cookies sur ce site',
    message:
      'Nous utilisons des cookies optionnels sur ce site pour mesurer les régions de visite et les téléchargements. L’application de bureau Aegis reste 100 % hors ligne et sans suivi.',
    accept: 'Accepter',
    decline: 'Refuser',
    privacyLink: 'Confidentialité',
    manageLabel: 'Préférences de cookies',
  },
  it: {
    title: 'Cookie su questo sito',
    message:
      'Usiamo cookie opzionali su questo sito per conoscere le aree di visita e i download. L’app desktop Aegis rimane al 100% offline e senza alcun tracciamento.',
    accept: 'Accetta',
    decline: 'Rifiuta',
    privacyLink: 'Privacy',
    manageLabel: 'Preferenze cookie',
  },
  pt: {
    title: 'Cookies neste site',
    message:
      'Usamos cookies opcionais neste site para entender regiões de acesso e downloads. O aplicativo desktop Aegis continua 100% offline e sem rastreamento.',
    accept: 'Aceitar',
    decline: 'Recusar',
    privacyLink: 'Privacidade',
    manageLabel: 'Preferências de cookies',
  },
  ru: {
    title: 'Файлы cookie на этом сайте',
    message:
      'Мы используем необязательные cookie на сайте для статистики посещений и загрузок. Настольное приложение Aegis остаётся на 100% офлайн без отслеживания.',
    accept: 'Принять',
    decline: 'Отклонить',
    privacyLink: 'Конфиденциальность',
    manageLabel: 'Настройки cookie',
  },
  zh: {
    title: '本网站的 Cookie',
    message:
      '我们在本网站使用可选 Cookie 来统计访问地区和下载次数。Aegis 桌面应用本身保持 100% 离线，绝不追踪任何数据。',
    accept: '接受',
    decline: '拒绝',
    privacyLink: '隐私政策',
    manageLabel: 'Cookie 偏好',
  },
  hi: {
    title: 'इस वेबसाइट पर कुकीज़',
    message:
      'हम विज़िटर क्षेत्रों और डाउनलोड संख्या को समझने के लिए इस वेबसाइट पर वैकल्पिक कुकीज़ का उपयोग करते हैं। Aegis डेस्कटॉप ऐप 100% ऑफ़लाइन और बिना किसी ट्रैकिंग के रहता है।',
    accept: 'स्वीकार करें',
    decline: 'अस्वीकार करें',
    privacyLink: 'गोपनीयता नीति',
    manageLabel: 'कुकी प्राथमिकताएँ',
  },
  ko: {
    title: '웹사이트 쿠키 안내',
    message:
      '이 웹사이트에서는 방문 지역과 다운로드 수를 파악하기 위해 선택적 쿠키를 사용합니다. Aegis 데스크톱 앱 자체는 100% 오프라인이며 추적이 없습니다.',
    accept: '수락',
    decline: '거부',
    privacyLink: '개인정보 처리방침',
    manageLabel: '쿠키 설정',
  },
  ja: {
    title: 'このサイトの Cookie について',
    message:
      '本サイトでは訪問地域やダウンロード数を把握するために任意の Cookie を使用します。Aegis デスクトップアプリ自体は 100% オフラインで一切追跡しません。',
    accept: '同意する',
    decline: '拒否する',
    privacyLink: 'プライバシーポリシー',
    manageLabel: 'Cookie 設定',
  },
  ar: {
    title: 'ملفات تعريف الارتباط على هذا الموقع',
    message:
      'نستخدم ملفات تعريف ارتباط اختيارية على هذا الموقع لفهم مناطق الزوار وعدد التنزيلات. يبقى تطبيق Aegis لسطح المكتب يعمل دون اتصال بنسبة 100% ودون أي تتبع.',
    accept: 'قبول',
    decline: 'رفض',
    privacyLink: 'سياسة الخصوصية',
    manageLabel: 'تفضيلات ملفات الارتباط',
  },
  fa: {
    title: 'کوکی‌ها در این وب‌سایت',
    message:
      'ما در این وب‌سایت از کوکی‌های اختیاری برای درک مناطق بازدیدکنندگان و تعداد دانلودها استفاده می‌کنیم. برنامه دسکتاپ Aegis کاملاً آفلاین و بدون هیچ‌گونه ردیابی است.',
    accept: 'پذیرفتن',
    decline: 'رد کردن',
    privacyLink: 'حریم خصوصی',
    manageLabel: 'تنظیمات کوکی',
  },
  el: {
    title: 'Cookies σε αυτόν τον ιστότοπο',
    message:
      'Χρησιμοποιούμε προαιρετικά cookies σε αυτόν τον ιστότοπο για στατιστικά επισκεπτών και λήψεων. Η εφαρμογή υπολογιστή Aegis παραμένει 100% εκτός σύνδεσης χωρίς παρακολούθηση.',
    accept: 'Αποδοχή',
    decline: 'Απόρριψη',
    privacyLink: 'Απόρρητο',
    manageLabel: 'Προτιμήσεις cookies',
  },
  he: {
    title: 'עוגיות באתר זה',
    message:
      'אנו משתמשים בעוגיות אופציונליות באתר כדי להבין אזורי ביקור ומספר הורדות. אפליקציית שולחן העבודה Aegis נשארת 100% אופליין וללא כל מעקב.',
    accept: 'אישור',
    decline: 'דחייה',
    privacyLink: 'מדיניות פרטיות',
    manageLabel: 'העדפות עוגיות',
  },
  da: {
    title: 'Cookies på denne hjemmeside',
    message:
      'Vi bruger valgfrie cookies på dette websted til at se besøgsregioner og downloadtal. Aegis-desktopappen forbliver 100 % offline uden sporing.',
    accept: 'Accepter',
    decline: 'Afvis',
    privacyLink: 'Privatlivspolitik',
    manageLabel: 'Cookie-indstillinger',
  },
  no: {
    title: 'Informasjonskapsler på dette nettstedet',
    message:
      'Vi bruker valgfrie informasjonskapsler på dette nettstedet for å se besøksregioner og nedlastinger. Aegis-skrivebordsappen er fortsatt 100 % frakoblet uten sporing.',
    accept: 'Godta',
    decline: 'Avslå',
    privacyLink: 'Personvern',
    manageLabel: 'Cookie-innstillinger',
  },
  sv: {
    title: 'Kakor på den här webbplatsen',
    message:
      'Vi använder valfria kakor på den här webbplatsen för att förstå besöksregioner och nedladdningar. Aegis skrivbordsapp förblir 100 % offline utan spårning.',
    accept: 'Acceptera',
    decline: 'Avböj',
    privacyLink: 'Integritetspolicy',
    manageLabel: 'Cookie-inställningar',
  },
  fi: {
    title: 'Evästeet tällä sivustolla',
    message:
      'Käytämme tällä sivustolla valinnaisia evästeitä kävijäalueiden ja latausmäärien seuraamiseen. Aegis-työpöytäsovellus pysyy 100 % offline-tilassa ilman seurantaa.',
    accept: 'Hyväksy',
    decline: 'Hylkää',
    privacyLink: 'Tietosuoja',
    manageLabel: 'Evästeasetukset',
  },
  nl: {
    title: 'Cookies op deze website',
    message:
      'We gebruiken optionele cookies op deze website om bezoekersregio’s en downloads te meten. De Aegis desktop-app blijft 100% offline zonder tracking.',
    accept: 'Accepteren',
    decline: 'Weigeren',
    privacyLink: 'Privacybeleid',
    manageLabel: 'Cookievoorkeuren',
  },
  pl: {
    title: 'Pliki cookie na tej stronie',
    message:
      'Używamy opcjonalnych plików cookie na tej stronie, aby poznać regiony odwiedzin i liczbę pobrań. Aplikacja desktopowa Aegis pozostaje w 100% offline bez śledzenia.',
    accept: 'Akceptuj',
    decline: 'Odrzuć',
    privacyLink: 'Prywatność',
    manageLabel: 'Ustawienia cookie',
  },
  id: {
    title: 'Cookie di situs web ini',
    message:
      'Kami menggunakan cookie opsional di situs ini untuk memahami wilayah pengunjung dan jumlah unduhan. Aplikasi desktop Aegis tetap 100% offline tanpa pelacakan.',
    accept: 'Terima',
    decline: 'Tolak',
    privacyLink: 'Kebijakan Privasi',
    manageLabel: 'Preferensi Cookie',
  },
  uk: {
    title: 'Файли cookie на цьому сайті',
    message:
      'Ми використовуємо необов’язкові файли cookie на сайті для статистики регіонів і завантажень. Настільний додаток Aegis залишається на 100% офлайн без відстеження.',
    accept: 'Прийняти',
    decline: 'Відхилити',
    privacyLink: 'Конфіденційність',
    manageLabel: 'Налаштування cookie',
  },
  fil: {
    title: 'Mga cookie sa website na ito',
    message:
      'Gumagamit kami ng opsyonal na cookies sa website na ito upang makita ang mga rehiyon ng bisita at bilang ng download. Ang Aegis desktop app ay nananatiling 100% offline nang walang tracking.',
    accept: 'Tanggapin',
    decline: 'Tanggihan',
    privacyLink: 'Patakaran sa Privacy',
    manageLabel: 'Mga Kagustuhan sa Cookie',
  },
};

export function getCookieCopy(lang: string): CookieCopy {
  return COOKIE_COPY_BY_LANG[lang] ?? EN_COOKIE;
}
