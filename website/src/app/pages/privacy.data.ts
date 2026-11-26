export interface PrivacyContent {
  updated: string;
  sections: Array<{ heading: string; body: string }>;
}

const EN_PRIVACY: PrivacyContent = {
  updated: 'Last updated: November 2026',
  sections: [
    {
      heading: '1. Desktop Application',
      body: 'Aegis Vault runs 100% locally on your device. We do not operate a cloud database, collect analytics, or have access to your passwords, usernames, or Master Password.',
    },
    {
      heading: '2. Website & Online Tools',
      body: 'The Password Generator runs strictly inside your browser. Generated passwords are never logged or transmitted to any server.',
    },
    {
      heading: '3. Advertising & Cookies',
      body: 'Guide and tool pages on this site may display third-party advertisements to support ongoing open-source development. Third-party ad providers may use cookies according to their own privacy policies.',
    },
    {
      heading: '4. Contact',
      body: 'For privacy questions or security reports, open an issue at github.com/DrXendria/Aegis.',
    },
  ],
};

export const PRIVACY_BY_LANG: Record<string, PrivacyContent> = {
  en: EN_PRIVACY,
  tr: {
    updated: 'Son güncelleme: Kasım 2026',
    sections: [
      {
        heading: '1. Masaüstü Uygulaması',
        body: 'Aegis Vault cihazınızda %100 yerel olarak çalışır. Bulut veritabanı işletmiyoruz, analitik toplamıyoruz ve şifrelerinize, kullanıcı adlarınıza veya Ana Şifrenize asla erişemiyoruz.',
      },
      {
        heading: '2. Web Sitesi ve Çevrimiçi Araçlar',
        body: 'Şifre Üretici tamamen tarayıcınızın içinde çalışır. Üretilen şifreler hiçbir sunucuya gönderilmez veya kaydedilmez.',
      },
      {
        heading: '3. Reklamlar ve Çerezler',
        body: 'Bu sitedeki rehber ve araç sayfaları açık kaynak geliştirmeyi desteklemek amacıyla üçüncü taraf reklamlar gösterebilir. Reklam sağlayıcıları kendi gizlilik politikalarına göre çerez kullanabilir.',
      },
      {
        heading: '4. İletişim',
        body: 'Gizlilik soruları veya güvenlik bildirimleri için github.com/DrXendria/Aegis üzerinden issue açabilirsiniz.',
      },
    ],
  },
  de: {
    updated: 'Stand: November 2026',
    sections: [
      { heading: '1. Desktop-Anwendung', body: 'Aegis Vault läuft zu 100 % lokal auf deinem Gerät. Wir betreiben keine Cloud-Datenbank, sammeln keine Telemetrie und haben keinen Zugriff auf deine Passwörter.' },
      { heading: '2. Website & Online-Tools', body: 'Der Passwort-Generator läuft ausschließlich lokal im Browser. Erzeugte Passwörter werden niemals an einen Server gesendet.' },
      { heading: '3. Werbung & Cookies', body: 'Ratgeber- und Tool-Seiten können Drittanbieter-Werbung enthalten, um die Open-Source-Entwicklung zu unterstützen.' },
      { heading: '4. Kontakt', body: 'Für Datenschutz- oder Sicherheitsfragen öffne ein Issue unter github.com/DrXendria/Aegis.' },
    ],
  },
  es: {
    updated: 'Última actualización: noviembre de 2026',
    sections: [
      { heading: '1. Aplicación de escritorio', body: 'Aegis Vault funciona 100 % en local. No operamos servidores en la nube, no recopilamos analíticas ni accedemos a tus contraseñas.' },
      { heading: '2. Sitio web y herramientas', body: 'El Generador de Contraseñas se ejecuta únicamente en tu navegador y nunca envía datos a ningún servidor.' },
      { heading: '3. Publicidad y cookies', body: 'Las páginas de guías y herramientas pueden mostrar anuncios de terceros para apoyar el desarrollo de código abierto.' },
      { heading: '4. Contacto', body: 'Para consultas de privacidad o seguridad, abre un issue en github.com/DrXendria/Aegis.' },
    ],
  },
  fr: {
    updated: 'Dernière mise à jour : novembre 2026',
    sections: [
      { heading: '1. Application de bureau', body: 'Aegis Vault fonctionne à 100 % localement. Nous n’exploitons aucune base cloud, ne collectons aucune télémétrie et n’avons jamais accès à vos mots de passe.' },
      { heading: '2. Site web et outils', body: 'Le générateur de mots de passe s’exécute strictement dans votre navigateur et ne transmet rien à aucun serveur.' },
      { heading: '3. Publicité et cookies', body: 'Les pages de guides et d’outils peuvent afficher des annonces tierces afin de soutenir le développement open source.' },
      { heading: '4. Contact', body: 'Pour toute question de confidentialité ou sécurité, ouvrez une issue sur github.com/DrXendria/Aegis.' },
    ],
  },
  it: {
    updated: 'Ultimo aggiornamento: novembre 2026',
    sections: [
      { heading: '1. Applicazione desktop', body: 'Aegis Vault gira al 100% in locale. Non gestiamo database cloud, non raccogliamo telemetria e non abbiamo accesso alle tue password.' },
      { heading: '2. Sito web e strumenti', body: 'Il Generatore di Password funziona solo nel browser senza inviare alcun dato in rete.' },
      { heading: '3. Pubblicità e cookie', body: 'Le pagine di guide e strumenti possono mostrare annunci di terze parti per sostenere lo sviluppo open source.' },
      { heading: '4. Contatti', body: 'Per domande su privacy o sicurezza apri una issue su github.com/DrXendria/Aegis.' },
    ],
  },
  pt: {
    updated: 'Última atualização: novembro de 2026',
    sections: [
      { heading: '1. Aplicativo Desktop', body: 'O Aegis Vault roda 100% localmente. Não mantemos banco de dados na nuvem, não coletamos telemetria e nunca temos acesso às suas senhas.' },
      { heading: '2. Site e ferramentas', body: 'O Gerador de Senhas funciona apenas no navegador e nunca envia senhas para servidores.' },
      { heading: '3. Anúncios e cookies', body: 'Páginas de guias e ferramentas podem exibir anúncios de terceiros para apoiar o desenvolvimento open source.' },
      { heading: '4. Contato', body: 'Para dúvidas de privacidade ou segurança, abra uma issue em github.com/DrXendria/Aegis.' },
    ],
  },
  ru: {
    updated: 'Обновлено: ноябрь 2026',
    sections: [
      { heading: '1. Настольное приложение', body: 'Aegis Vault работает на 100% локально. Мы не используем облачные базы, не собираем телеметрию и не имеем доступа к вашим паролям.' },
      { heading: '2. Сайт и онлайн-инструменты', body: 'Генератор паролей работает исключительно в браузере и ничего не отправляет на сервер.' },
      { heading: '3. Реклама и cookies', body: 'Страницы руководств и инструментов могут показывать рекламу сторонних сетей для поддержки проекта.' },
      { heading: '4. Контакты', body: 'По вопросам конфиденциальности и безопасности откройте issue на github.com/DrXendria/Aegis.' },
    ],
  },
  zh: {
    updated: '最后更新：2026 年 11 月',
    sections: [
      { heading: '1. 桌面应用程序', body: 'Aegis Vault 100% 在本地运行。我们不运营云端数据库，不收集分析数据，也无法访问您的密码或主密码。' },
      { heading: '2. 网站与在线工具', body: '密码生成器完全在您的浏览器中运行，生成的密码不会发送到任何服务器。' },
      { heading: '3. 广告与 Cookie', body: '本网站的指南和工具页面可能会展示第三方广告，以支持持续的开源开发。' },
      { heading: '4. 联系我们', body: '如有隐私或安全问题，请在 github.com/DrXendria/Aegis 提交 Issue。' },
    ],
  },
  hi: {
    updated: 'अंतिम अपडेट: नवंबर 2026',
    sections: [
      { heading: '1. डेस्कटॉप एप्लिकेशन', body: 'Aegis Vault 100% लोकल चलता है। हम कोई क्लाउड डेटाबेस नहीं चलाते, कोई एनालिटिक्स नहीं जुटाते और आपके पासवर्ड तक हमारी कोई पहुँच नहीं है।' },
      { heading: '2. वेबसाइट और ऑनलाइन टूल', body: 'पासवर्ड जेनरेटर पूरी तरह आपके ब्राउज़र में चलता है और कोई भी पासवर्ड सर्वर पर नहीं भेजता।' },
      { heading: '3. विज्ञापन और कुकीज़', body: 'ओपन-सोर्स विकास के समर्थन के लिए गाइड और टूल पेजों पर तृतीय-पक्ष विज्ञापन दिखाए जा सकते हैं।' },
      { heading: '4. संपर्क', body: 'गोपनीयता या सुरक्षा संबंधी प्रश्नों के लिए github.com/DrXendria/Aegis पर Issue खोलें।' },
    ],
  },
  ko: {
    updated: '최종 업데이트: 2026년 11월',
    sections: [
      { heading: '1. 데스크톱 애플리케이션', body: 'Aegis Vault는 100% 로컬로 실행됩니다. 클라우드 데이터베이스를 운영하지 않으며 비밀번호나 마스터 비밀번호에 접근하지 않습니다.' },
      { heading: '2. 웹사이트 및 도구', body: '비밀번호 생성기는 브라우저 내에서만 작동하며 생성된 비밀번호는 서버로 전송되지 않습니다.' },
      { heading: '3. 광고 및 쿠키', body: '가이드 및 도구 페이지에는 오픈소스 개발 지원을 위한 제3자 광고가 표시될 수 있습니다.' },
      { heading: '4. 문의', body: '개인정보 또는 보안 관련 문의는 github.com/DrXendria/Aegis에 이슈를 등록해 주세요.' },
    ],
  },
  ja: {
    updated: '最終更新: 2026年11月',
    sections: [
      { heading: '1. デスクトップアプリ', body: 'Aegis Vaultは100%ローカルで動作します。クラウドDBは運用せず、解析データも収集せず、パスワードへ一切アクセスしません。' },
      { heading: '2. Webサイトとツール', body: 'パスワード生成器はブラウザ内のみで実行され、生成されたパスワードがサーバーへ送信されることはありません。' },
      { heading: '3. 広告とCookie', body: 'ガイドやツールページにはオープンソース開発支援のため第三者広告が表示される場合があります。' },
      { heading: '4. お問い合わせ', body: 'プライバシーやセキュリティに関するご連絡は github.com/DrXendria/Aegis のIssueをご利用ください。' },
    ],
  },
  ar: {
    updated: 'آخر تحديث: نوفمبر 2026',
    sections: [
      { heading: '1. تطبيق سطح المكتب', body: 'يعمل Aegis Vault محليًا بنسبة 100%. لا ندير أي قاعدة بيانات سحابية ولا نجمع بيانات تحليلية ولا نملك وصولًا لكلمات مرورك.' },
      { heading: '2. الموقع والأدوات', body: 'يعمل مولّد كلمات المرور داخل متصفحك فقط ولا يرسل أي بيانات إلى أي خادم.' },
      { heading: '3. الإعلانات وملفات الارتباط', body: 'قد تعرض صفحات الأدلة والأدوات إعلانات لدعم التطوير مفتوح المصدر.' },
      { heading: '4. التواصل', body: 'للاستفسارات أو بلاغات الأمان افتح Issue عبر github.com/DrXendria/Aegis.' },
    ],
  },
  fa: {
    updated: 'آخرین به‌روزرسانی: نوامبر ۲۰۲۶',
    sections: [
      { heading: '۱. برنامه دسکتاپ', body: 'Aegis Vault صددرصد محلی اجرا می‌شود. هیچ پایگاه داده ابری نداریم، داده‌ای جمع‌آوری نمی‌کنیم و به رمزهای شما دسترسی نداریم.' },
      { heading: '۲. وب‌سایت و ابزارها', body: 'تولیدکننده رمز عبور صرفاً در مرورگر شما اجرا می‌شود و هیچ رمزی به سرور ارسال نمی‌شود.' },
      { heading: '۳. تبلیغات و کوکی‌ها', body: 'صفحات راهنما و ابزار ممکن است برای حمایت از توسعه متن‌باز تبلیغات نمایش دهند.' },
      { heading: '۴. تماس', body: 'برای پرسش‌های امنیتی یا حریم خصوصی در github.com/DrXendria/Aegis یک Issue ثبت کنید.' },
    ],
  },
  el: {
    updated: 'Τελευταία ενημέρωση: Νοέμβριος 2026',
    sections: [
      { heading: '1. Εφαρμογή υπολογιστή', body: 'Το Aegis Vault τρέχει 100% τοπικά. Δεν λειτουργούμε cloud βάση, δεν συλλέγουμε δεδομένα και δεν έχουμε πρόσβαση στους κωδικούς σου.' },
      { heading: '2. Ιστότοπος & εργαλεία', body: 'Η Γεννήτρια Κωδικών εκτελείται αποκλειστικά στον browser χωρίς αποστολή δεδομένων.' },
      { heading: '3. Διαφημίσεις & Cookies', body: 'Οι σελίδες οδηγών και εργαλείων ενδέχεται να προβάλλουν διαφημίσεις τρίτων για στήριξη του έργου.' },
      { heading: '4. Επικοινωνία', body: 'Για θέματα απορρήτου ή ασφάλειας άνοιξε ένα issue στο github.com/DrXendria/Aegis.' },
    ],
  },
  he: {
    updated: 'עודכן לאחרונה: נובמבר 2026',
    sections: [
      { heading: '1. אפליקציית שולחן עבודה', body: 'Aegis Vault פועל 100% מקומית. איננו מפעילים שרת ענן, איננו אוספים אנליטיקה ואין לנו גישה לסיסמאות שלך.' },
      { heading: '2. אתר וכלים מקוונים', body: 'מחולל הסיסמאות פועל בדפדפן בלבד ולעולם אינו שולח סיסמאות לשרת.' },
      { heading: '3. פרסומות וקובצי Cookie', body: 'עמודי המדריכים והכלים עשויים להציג פרסומות צד שלישי לתמיכה בפיתוח קוד פתוח.' },
      { heading: '4. יצירת קשר', body: 'לשאלות פרטיות או אבטחה פתח Issue בכתובת github.com/DrXendria/Aegis.' },
    ],
  },
  da: {
    updated: 'Sidst opdateret: november 2026',
    sections: [
      { heading: '1. Desktop-app', body: 'Aegis Vault kører 100 % lokalt på din enhed. Vi driver ingen skydatabase, indsamler ingen telemetri og har aldrig adgang til dine adgangskoder.' },
      { heading: '2. Website & værktøjer', body: 'Adgangskodegeneratoren kører udelukkende i din browser og sender intet til nogen server.' },
      { heading: '3. Annoncer & cookies', body: 'Guide- og værktøjssider kan vise tredjepartsannoncer for at støtte open source-udviklingen.' },
      { heading: '4. Kontakt', body: 'Ved spørgsmål om privatliv eller sikkerhed kan du åbne et issue på github.com/DrXendria/Aegis.' },
    ],
  },
  no: {
    updated: 'Sist oppdatert: november 2026',
    sections: [
      { heading: '1. Skrivebordsprogram', body: 'Aegis Vault kjører 100 % lokalt på enheten din. Vi driver ingen skydatabase, samler ikke inn telemetri og har aldri tilgang til passordene dine.' },
      { heading: '2. Nettside og verktøy', body: 'Passordgeneratoren kjører kun i nettleseren din og sender aldri passord til noen server.' },
      { heading: '3. Annonser og informasjonskapsler', body: 'Guide- og verktøysider kan vise tredjepartsannonser for å støtte videre åpen kildekode-utvikling.' },
      { heading: '4. Kontakt', body: 'For spørsmål om personvern eller sikkerhet, åpne en sak på github.com/DrXendria/Aegis.' },
    ],
  },
  sv: {
    updated: 'Senast uppdaterad: november 2026',
    sections: [
      { heading: '1. Skrivbordsapp', body: 'Aegis Vault körs 100 % lokalt på din enhet. Vi driver ingen molndatabas, samlar ingen telemetri och har aldrig tillgång till dina lösenord.' },
      { heading: '2. Webbplats & verktyg', body: 'Lösenordsgeneratorn körs enbart i din webbläsare och skickar aldrig data till någon server.' },
      { heading: '3. Annonser & cookies', body: 'Guide- och verktygssidor kan visa tredjepartsannonser för att stödja open source-utvecklingen.' },
      { heading: '4. Kontakt', body: 'För integritets- eller säkerhetsfrågor, öppna ett ärende på github.com/DrXendria/Aegis.' },
    ],
  },
  fi: {
    updated: 'Päivitetty: marraskuu 2026',
    sections: [
      { heading: '1. Työpöytäsovellus', body: 'Aegis Vault toimii 100 % paikallisesti laitteellasi. Emme ylläpidä pilvitietokantaa emmekä kerää telemetriaa tai näe salasanojasi.' },
      { heading: '2. Verkkosivusto ja työkalut', body: 'Salasanageneraattori toimii vain selaimessasi eikä lähetä salasanoja millekään palvelimelle.' },
      { heading: '3. Mainokset ja evästeet', body: 'Opas- ja työkalusivuilla voidaan näyttää mainoksia avoimen lähdekoodin kehityksen tukemiseksi.' },
      { heading: '4. Yhteydenotto', body: 'Tietosuoja- tai tietoturvakysymyksissä avaa issue osoitteessa github.com/DrXendria/Aegis.' },
    ],
  },
  nl: {
    updated: 'Laatst bijgewerkt: november 2026',
    sections: [
      { heading: '1. Desktop-app', body: 'Aegis Vault draait 100% lokaal op je apparaat. Wij beheren geen clouddatabase, verzamelen geen telemetrie en hebben geen toegang tot je wachtwoorden.' },
      { heading: '2. Website & tools', body: 'De wachtwoordgenerator werkt volledig in je browser en verstuurt nooit wachtwoorden naar een server.' },
      { heading: '3. Advertenties & cookies', body: 'Gids- en toolpagina’s kunnen advertenties van derden tonen ter ondersteuning van open-source ontwikkeling.' },
      { heading: '4. Contact', body: 'Open voor privacy- of beveiligingsvragen een issue op github.com/DrXendria/Aegis.' },
    ],
  },
  pl: {
    updated: 'Ostatnia aktualizacja: listopad 2026',
    sections: [
      { heading: '1. Aplikacja desktopowa', body: 'Aegis Vault działa w 100% lokalnie. Nie prowadzimy bazy w chmurze, nie zbieramy telemetrii i nie mamy dostępu do Twoich haseł.' },
      { heading: '2. Strona i narzędzia', body: 'Generator haseł działa wyłącznie w przeglądarce i nigdy nie wysyła haseł na serwer.' },
      { heading: '3. Reklamy i pliki cookie', body: 'Strony poradników i narzędzi mogą wyświetlać reklamy wspierające rozwój open source.' },
      { heading: '4. Kontakt', body: 'W sprawach prywatności lub bezpieczeństwa otwórz zgłoszenie na github.com/DrXendria/Aegis.' },
    ],
  },
  id: {
    updated: 'Terakhir diperbarui: November 2026',
    sections: [
      { heading: '1. Aplikasi Desktop', body: 'Aegis Vault berjalan 100% lokal di perangkat Anda. Kami tidak mengoperasikan database cloud, tidak mengumpulkan analitik, dan tidak memiliki akses ke kata sandi Anda.' },
      { heading: '2. Situs Web & Alat Online', body: 'Pembuat Kata Sandi berjalan murni di browser Anda dan tidak pernah mengirim data ke server mana pun.' },
      { heading: '3. Iklan & Cookie', body: 'Halaman panduan dan alat dapat menampilkan iklan pihak ketiga untuk mendukung pengembangan open source.' },
      { heading: '4. Kontak', body: 'Untuk pertanyaan privasi atau laporan keamanan, buka issue di github.com/DrXendria/Aegis.' },
    ],
  },
  uk: {
    updated: 'Останнє оновлення: листопад 2026',
    sections: [
      { heading: '1. Настільний додаток', body: 'Aegis Vault працює на 100% локально. Ми не використовуємо хмарні бази, не збираємо телеметрію і не маємо доступу до ваших паролів.' },
      { heading: '2. Сайт та онлайн-інструменти', body: 'Генератор паролів працює виключно у браузері та ніколи не передає паролі на сервер.' },
      { heading: '3. Реклама та cookies', body: 'Сторінки посібників та інструментів можуть показувати рекламу для підтримки проєкту.' },
      { heading: '4. Контакти', body: 'З питань приватності або безпеки відкрийте issue на github.com/DrXendria/Aegis.' },
    ],
  },
  fil: {
    updated: 'Huling na-update: Nobyembre 2026',
    sections: [
      { heading: '1. Desktop Application', body: '100% lokal na tumatakbo ang Aegis Vault sa iyong device. Wala kaming cloud database, hindi kami nangongolekta ng analytics, at wala kaming access sa iyong mga password.' },
      { heading: '2. Website at Online Tools', body: 'Ang Password Generator ay gumagana lamang sa loob ng iyong browser at hindi nagpapadala ng data sa server.' },
      { heading: '3. Mga Ad at Cookies', body: 'Maaaring magpakita ng third-party ads ang mga gabay at tool upang suportahan ang open-source development.' },
      { heading: '4. Makipag-ugnayan', body: 'Para sa mga tanong sa privacy o seguridad, magbukas ng issue sa github.com/DrXendria/Aegis.' },
    ],
  },
};

export function getPrivacyContent(lang: string): PrivacyContent {
  return PRIVACY_BY_LANG[lang] ?? EN_PRIVACY;
}
