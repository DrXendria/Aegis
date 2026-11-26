export interface LangOption {
  code: string;
  label: string;
  rtl?: boolean;
}

export const SUPPORTED_LANGUAGES: LangOption[] = [
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'fa', label: 'فارسی', rtl: true },
  { code: 'el', label: 'Ελληνικά' },
  { code: 'he', label: 'עברית', rtl: true },
  { code: 'da', label: 'Dansk' },
  { code: 'no', label: 'Norsk' },
  { code: 'sv', label: 'Svenska' },
  { code: 'fi', label: 'Suomi' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'pl', label: 'Polski' },
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'uk', label: 'Українська' },
  { code: 'fil', label: 'Filipino' },
];

export type TranslationKeys = {
  nav_overview: string;
  nav_generator: string;
  nav_guides: string;
  nav_download: string;
  hero_badge: string;
  hero_title: string;
  hero_desc: string;
  download_for: string;
  other_platforms: string;
  hero_footnote: string;
  downloads_title: string;
  downloads_subtitle: string;
  view_github: string;
  your_os: string;
  features_title: string;
  features_subtitle: string;
  f1_title: string;
  f1_desc: string;
  f2_title: string;
  f2_desc: string;
  f3_title: string;
  f3_desc: string;
  f4_title: string;
  f4_desc: string;
  f5_title: string;
  f5_desc: string;
  f6_title: string;
  f6_desc: string;
  faq_title: string;
  faq_subtitle: string;
  read_guides: string;
  gen_badge: string;
  gen_title: string;
  gen_subtitle: string;
  copy: string;
  copied: string;
  new_btn: string;
  strength: string;
  entropy_unit: string;
  length_label: string;
  chars_unit: string;
  footer_desc: string;
  privacy_policy: string;
};

const EN: TranslationKeys = {
  nav_overview: 'Overview',
  nav_generator: 'Password Generator',
  nav_guides: 'Guides',
  nav_download: 'Download',
  hero_badge: 'Free & Open Source',
  hero_title: 'A password manager that stays on your computer.',
  hero_desc:
    'No cloud account to get breached, no subscription, and no hidden tracking. Aegis keeps your logins, cards, and notes locked in an encrypted local file with automatic two-week backups.',
  download_for: 'Download for',
  other_platforms: 'Other platforms',
  hero_footnote: 'Windows, macOS, and Linux • MIT License • Works completely offline',
  downloads_title: 'Download Aegis',
  downloads_subtitle: 'Pick the installer for your system. Everything runs locally right out of the box.',
  view_github: 'View on GitHub',
  your_os: 'Your OS',
  features_title: 'Built for peace of mind',
  features_subtitle: 'Simple day-to-day workflow backed by strict local cryptography and crash-safe saves.',
  f1_title: 'Two-layer local lock',
  f1_desc: 'Sign in with your local account password, then unlock your encrypted vault with a separate Master Password. Supports multiple isolated profiles on one computer.',
  f2_title: 'Full entry encryption',
  f2_desc: 'Site names, usernames, passwords, cards, and notes are encrypted together with AES-256-GCM and 600,000-round PBKDF2 key derivation.',
  f3_title: 'Crash-safe & auto-backed up',
  f3_desc: 'Every change writes safely to a temporary file first, keeps the previous working copy as .bak, and saves an encrypted backup every 14 days.',
  f4_title: 'Switch in one minute',
  f4_desc: 'Import existing passwords from Chrome, Bitwarden, LastPass, or previous Aegis backups without manual re-entry.',
  f5_title: 'Subscriptions & cards',
  f5_desc: 'Keep track of renewal dates and monthly costs across 18 currencies alongside your logins and secure notes.',
  f6_title: 'Quiet security habits',
  f6_desc: 'Copied passwords clear from your clipboard after 30 seconds, and logins untouched for 90+ days get a gentle reminder.',
  faq_title: 'Common questions',
  faq_subtitle: 'Straight answers about how your data is stored and protected.',
  read_guides: 'Read security guides',
  gen_badge: 'Generated locally in your browser',
  gen_title: 'Password Generator',
  gen_subtitle: 'Create strong, random passwords without sending anything over the internet.',
  copy: 'Copy',
  copied: 'Copied',
  new_btn: 'New',
  strength: 'Strength',
  entropy_unit: 'bits of entropy',
  length_label: 'Length',
  chars_unit: 'characters',
  footer_desc: 'Free, open-source offline password manager for Windows, macOS, and Linux.',
  privacy_policy: 'Privacy Policy',
};

const TR: TranslationKeys = {
  nav_overview: 'Genel Bakış',
  nav_generator: 'Şifre Üretici',
  nav_guides: 'Rehberler',
  nav_download: 'İndir',
  hero_badge: 'Ücretsiz & Açık Kaynak',
  hero_title: 'Sadece bilgisayarında kalan şifre yöneticisi.',
  hero_desc:
    'Ele geçirilecek bulut hesabı yok, abonelik yok, gizli takip yok. Aegis şifrelerini, kartlarını ve notlarını 2 haftalık otomatik şifreli yedeklerle yerel dosyada saklar.',
  download_for: 'İndir:',
  other_platforms: 'Diğer platformlar',
  hero_footnote: 'Windows, macOS ve Linux • MIT Lisansı • Tamamen çevrimdışı çalışır',
  downloads_title: 'Aegis İndir',
  downloads_subtitle: 'İşletim sistemine uygun kurulum dosyasını seç. Kurulumdan sonra internet gerektirmez.',
  view_github: "GitHub'da Gör",
  your_os: 'Sistemin',
  features_title: 'İçin rahat olsun diye tasarlandı',
  features_subtitle: 'Günlük sade kullanım, güçlü yerel şifreleme ve çökme korumalı kayıt sistemi.',
  f1_title: 'İki katmanlı yerel kilit',
  f1_desc: 'Önce yerel hesap şifrenle giriş yap, ardından ayrı Ana Şifrenle şifreli kasanı aç. Tek bilgisayarda birden fazla izole profil destekler.',
  f2_title: 'Tam kayıt şifreleme',
  f2_desc: 'Site adları, kullanıcı adları, şifreler, kartlar ve notlar birlikte AES-256-GCM ve 600.000 turlu PBKDF2 ile şifrelenir.',
  f3_title: 'Çökme korumalı & otomatik yedek',
  f3_desc: 'Her değişiklik önce geçici dosyaya yazılır, önceki sağlam kopya .bak olarak korunur ve 14 günde bir şifreli disk yedeği alınır.',
  f4_title: 'Bir dakikada geçiş',
  f4_desc: 'Chrome, Bitwarden, LastPass veya eski Aegis yedeklerini tek tıkla içeri aktar.',
  f5_title: 'Abonelikler & kartlar',
  f5_desc: 'Şifrelerinin yanında kredi kartlarını, güvenli notlarını ve 18 para birimindeki aboneliklerini takip et.',
  f6_title: 'Sessiz güvenlik alışkanlıkları',
  f6_desc: 'Kopyalanan şifreler 30 saniye sonra panodan silinir, 90+ gündür yenilenmeyen şifreler için hatırlatma çıkar.',
  faq_title: 'Sık sorulanlar',
  faq_subtitle: 'Verilerinin nasıl saklandığı ve korunduğu hakkında net yanıtlar.',
  read_guides: 'Güvenlik rehberlerini oku',
  gen_badge: 'Tarayıcında yerel olarak üretilir',
  gen_title: 'Şifre Üretici',
  gen_subtitle: 'İnternete hiçbir veri göndermeden güçlü, rastgele şifreler oluştur.',
  copy: 'Kopyala',
  copied: 'Kopyalandı',
  new_btn: 'Yenile',
  strength: 'Güç',
  entropy_unit: 'bit entropi',
  length_label: 'Uzunluk',
  chars_unit: 'karakter',
  footer_desc: 'Windows, macOS ve Linux için ücretsiz, açık kaynaklı çevrimdışı şifre yöneticisi.',
  privacy_policy: 'Gizlilik Politikası',
};

const PARTIAL_TRANSLATIONS: Record<string, Partial<TranslationKeys>> = {
  de: {
    nav_overview: 'Übersicht', nav_generator: 'Passwort-Generator', nav_guides: 'Ratgeber', nav_download: 'Download',
    hero_badge: 'Kostenlos & Open Source', hero_title: 'Ein Passwort-Manager, der auf deinem Computer bleibt.',
    hero_desc: 'Keine Cloud, kein Abo, kein Tracking. Aegis speichert deine Passwörter, Karten und Notizen lokal verschlüsselt mit automatischen 14-Tage-Backups.',
    download_for: 'Download für', other_platforms: 'Weitere Plattformen', downloads_title: 'Aegis herunterladen',
    your_os: 'Dein System', features_title: 'Für echte Datensicherheit gemacht', faq_title: 'Häufige Fragen',
    gen_title: 'Passwort-Generator', copy: 'Kopieren', copied: 'Kopiert', new_btn: 'Neu', privacy_policy: 'Datenschutz',
  },
  es: {
    nav_overview: 'Inicio', nav_generator: 'Generador', nav_guides: 'Guías', nav_download: 'Descargar',
    hero_badge: 'Gratis y Open Source', hero_title: 'Un gestor de contraseñas que se queda en tu equipo.',
    hero_desc: 'Sin nube, sin suscripciones ni rastreo. Aegis guarda tus contraseñas, tarjetas y notas cifradas localmente con copias automáticas cada 14 días.',
    download_for: 'Descargar para', other_platforms: 'Otras plataformas', downloads_title: 'Descargar Aegis',
    your_os: 'Tu sistema', features_title: 'Hecho para tu tranquilidad', faq_title: 'Preguntas frecuentes',
    gen_title: 'Generador de Contraseñas', copy: 'Copiar', copied: 'Copiado', new_btn: 'Nueva', privacy_policy: 'Privacidad',
  },
  fr: {
    nav_overview: 'Aperçu', nav_generator: 'Générateur', nav_guides: 'Guides', nav_download: 'Télécharger',
    hero_badge: 'Gratuit & Open Source', hero_title: 'Un gestionnaire de mots de passe qui reste sur votre ordinateur.',
    hero_desc: 'Aucun cloud, aucun abonnement, aucun pistage. Aegis protège vos identifiants localement avec des sauvegardes chiffrées automatiques tous les 14 jours.',
    download_for: 'Télécharger pour', other_platforms: 'Autres plateformes', downloads_title: 'Télécharger Aegis',
    your_os: 'Votre système', features_title: 'Conçu pour votre tranquillité', faq_title: 'Questions fréquentes',
    gen_title: 'Générateur de mots de passe', copy: 'Copier', copied: 'Copié', new_btn: 'Nouveau', privacy_policy: 'Confidentialité',
  },
  it: {
    nav_overview: 'Panoramica', nav_generator: 'Generatore', nav_guides: 'Guide', nav_download: 'Scarica',
    hero_badge: 'Gratuito & Open Source', hero_title: 'Un gestore di password che resta sul tuo computer.',
    hero_desc: 'Nessun cloud, nessun abbonamento, nessun tracciamento. Aegis protegge i tuoi dati in locale con backup cifrati ogni 14 giorni.',
    download_for: 'Scarica per', other_platforms: 'Altre piattaforme', downloads_title: 'Scarica Aegis',
    your_os: 'Il tuo sistema', features_title: 'Progettato per la tua serenità', faq_title: 'Domande frequenti',
    gen_title: 'Generatore di Password', copy: 'Copia', copied: 'Copiato', new_btn: 'Nuova', privacy_policy: 'Privacy',
  },
  pt: {
    nav_overview: 'Início', nav_generator: 'Gerador', nav_guides: 'Guias', nav_download: 'Baixar',
    hero_badge: 'Grátis & Open Source', hero_title: 'Um gerenciador de senhas que fica no seu computador.',
    hero_desc: 'Sem nuvem, sem assinatura e sem rastreamento. O Aegis protege suas senhas localmente com backups criptografados a cada 14 dias.',
    download_for: 'Baixar para', other_platforms: 'Outras plataformas', downloads_title: 'Baixar Aegis',
    your_os: 'Seu sistema', features_title: 'Feito para sua tranquilidade', faq_title: 'Perguntas frequentes',
    gen_title: 'Gerador de Senhas', copy: 'Copiar', copied: 'Copiado', new_btn: 'Nova', privacy_policy: 'Privacidade',
  },
  ru: {
    nav_overview: 'Обзор', nav_generator: 'Генератор', nav_guides: 'Руководства', nav_download: 'Скачать',
    hero_badge: 'Бесплатно и Open Source', hero_title: 'Менеджер паролей, который остаётся на вашем компьютере.',
    hero_desc: 'Без облака, подписок и слежки. Aegis хранит ваши пароли, карты и заметки локально в зашифрованном файле с автобэкапом каждые 14 дней.',
    download_for: 'Скачать для', other_platforms: 'Другие платформы', downloads_title: 'Скачать Aegis',
    your_os: 'Ваша ОС', features_title: 'Создан для спокойствия', faq_title: 'Частые вопросы',
    gen_title: 'Генератор паролей', copy: 'Копировать', copied: 'Скопировано', new_btn: 'Новый', privacy_policy: 'Конфиденциальность',
  },
  zh: {
    nav_overview: '概览', nav_generator: '密码生成器', nav_guides: '安全指南', nav_download: '下载',
    hero_badge: '免费开源', hero_title: '只留在您电脑上的密码管理器。',
    hero_desc: '无云端风险、无订阅费、无隐藏追踪。Aegis 将您的密码、银行卡和笔记加密保存在本地，并每两周自动加密备份。',
    download_for: '下载版本：', other_platforms: '其他平台', downloads_title: '下载 Aegis',
    your_os: '当前系统', features_title: '为安心而打造', faq_title: '常见问题',
    gen_title: '密码生成器', copy: '复制', copied: '已复制', new_btn: '重新生成', privacy_policy: '隐私政策',
  },
  hi: {
    nav_overview: 'अवलोकन', nav_generator: 'पासवर्ड जेनरेटर', nav_guides: 'गाइड', nav_download: 'डाउनलोड',
    hero_badge: 'मुफ़्त और ओपन सोर्स', hero_title: 'एक पासवर्ड मैनेजर जो आपके कंप्यूटर पर ही रहता है।',
    download_for: 'डाउनलोड करें:', other_platforms: 'अन्य प्लेटफ़ॉर्म', downloads_title: 'Aegis डाउनलोड करें',
    your_os: 'आपका सिस्टम', faq_title: 'सामान्य प्रश्न', gen_title: 'पासवर्ड जेनरेटर', copy: 'कॉपी', copied: 'कॉपी हो गया', new_btn: 'नया',
  },
  ko: {
    nav_overview: '개요', nav_generator: '비밀번호 생성기', nav_guides: '가이드', nav_download: '다운로드',
    hero_badge: '무료 오픈소스', hero_title: '내 컴퓨터에만 머무는 비밀번호 관리자.',
    hero_desc: '클라우드 유출 위험, 구독료, 추적 없이 로컬 암호화 파일에 안전하게 보관하고 2주마다 자동 백업합니다.',
    download_for: '다운로드:', other_platforms: '다른 플랫폼', downloads_title: 'Aegis 다운로드',
    your_os: '내 OS', features_title: '안심할 수 있는 설계', faq_title: '자주 묻는 질문',
    gen_title: '비밀번호 생성기', copy: '복사', copied: '복사됨', new_btn: '새로 생성', privacy_policy: '개인정보 처리방침',
  },
  ja: {
    nav_overview: '概要', nav_generator: 'パスワード生成', nav_guides: 'ガイド', nav_download: 'ダウンロード',
    hero_badge: '無料・オープンソース', hero_title: 'あなたのPCの中だけで完結するパスワード管理。',
    hero_desc: 'クラウド不要、サブスク不要、追跡ゼロ。ローカル暗号化ファイルと2週間ごとの自動バックアップで安全に守ります。',
    download_for: 'ダウンロード:', other_platforms: '他のプラットフォーム', downloads_title: 'Aegis をダウンロード',
    your_os: 'お使いのOS', features_title: '安心のための設計', faq_title: 'よくある質問',
    gen_title: 'パスワード生成器', copy: 'コピー', copied: 'コピー済み', new_btn: '再生成', privacy_policy: 'プライバシーポリシー',
  },
  ar: {
    nav_overview: 'نظرة عامة', nav_generator: 'مولّد كلمات المرور', nav_guides: 'الأدلة', nav_download: 'تنزيل',
    hero_badge: 'مجاني ومفتوح المصدر', hero_title: 'مدير كلمات مرور يبقى على جهازك فقط.',
    hero_desc: 'بدون سحابة، بدون اشتراكات، وبدون تتبع. يحفظ Aegis بياناتك مشفرة محليًا مع نسخ احتياطي تلقائي كل أسبوعين.',
    download_for: 'تنزيل لنظام', other_platforms: 'منصات أخرى', downloads_title: 'تنزيل Aegis',
    your_os: 'نظامك', features_title: 'مصمم لراحة بالك', faq_title: 'الأسئلة الشائعة',
    gen_title: 'مولّد كلمات المرور', copy: 'نسخ', copied: 'تم النسخ', new_btn: 'جديد', privacy_policy: 'سياسة الخصوصية',
  },
  fa: {
    nav_overview: 'نمای کلی', nav_generator: 'تولید رمز عبور', nav_guides: 'راهنماها', nav_download: 'دانلود',
    hero_badge: 'رایگان و متن‌باز', hero_title: 'مدیر رمز عبوری که فقط روی رایانه شما می‌ماند.',
    download_for: 'دانلود برای', other_platforms: 'سایر سیستم‌عامل‌ها', downloads_title: 'دانلود Aegis',
    your_os: 'سیستم شما', faq_title: 'پرسش‌های متداول', gen_title: 'تولید رمز عبور', copy: 'کپی', copied: 'کپی شد', new_btn: 'جدید',
  },
  el: {
    nav_overview: 'Επισκόπηση', nav_generator: 'Γεννήτρια κωδικών', nav_guides: 'Οδηγοί', nav_download: 'Λήψη',
    hero_badge: 'Δωρεάν & Ανοιχτού Κώδικα', hero_title: 'Ένας διαχειριστής κωδικών που μένει στον υπολογιστή σου.',
    download_for: 'Λήψη για', other_platforms: 'Άλλες πλατφόρμες', downloads_title: 'Λήψη Aegis',
    your_os: 'Το σύστημά σου', faq_title: 'Συχνές ερωτήσεις', copy: 'Αντιγραφή', copied: 'Αντιγράφηκε', new_btn: 'Νέος',
  },
  he: {
    nav_overview: 'סקירה', nav_generator: 'מחולל סיסמאות', nav_guides: 'מדריכים', nav_download: 'הורדה',
    hero_badge: 'חינמי וקוד פתוח', hero_title: 'מנהל סיסמאות שנשאר רק על המחשב שלך.',
    download_for: 'הורדה עבור', other_platforms: 'פלטפורמות נוספות', downloads_title: 'הורדת Aegis',
    your_os: 'המערכת שלך', faq_title: 'שאלות נפוצות', copy: 'העתק', copied: 'הועתק', new_btn: 'חדש',
  },
  da: {
    nav_overview: 'Oversigt', nav_generator: 'Adgangskodegenerator', nav_guides: 'Guider', nav_download: 'Download',
    hero_badge: 'Gratis & Open Source', hero_title: 'En adgangskodeadministrator der bliver på din computer.',
    download_for: 'Download til', other_platforms: 'Andre platforme', downloads_title: 'Download Aegis', your_os: 'Dit system',
  },
  no: {
    nav_overview: 'Oversikt', nav_generator: 'Passordgenerator', nav_guides: 'Guider', nav_download: 'Last ned',
    hero_badge: 'Gratis & Åpen kildekode', hero_title: 'En passordbehandler som blir på datamaskinen din.',
    download_for: 'Last ned for', other_platforms: 'Andre plattformer', downloads_title: 'Last ned Aegis', your_os: 'Ditt system',
  },
  sv: {
    nav_overview: 'Översikt', nav_generator: 'Lösenordsgenerator', nav_guides: 'Guider', nav_download: 'Ladda ner',
    hero_badge: 'Gratis & Öppen källkod', hero_title: 'En lösenordshanterare som stannar på din dator.',
    download_for: 'Ladda ner för', other_platforms: 'Andra plattformar', downloads_title: 'Ladda ner Aegis', your_os: 'Ditt system',
  },
  fi: {
    nav_overview: 'Yleiskatsaus', nav_generator: 'Salasanageneraattori', nav_guides: 'Oppaat', nav_download: 'Lataa',
    hero_badge: 'Ilmainen & Avoin lähdekoodi', hero_title: 'Salasananhallinta, joka pysyy tietokoneellasi.',
    download_for: 'Lataa:', other_platforms: 'Muut alustat', downloads_title: 'Lataa Aegis', your_os: 'Järjestelmäsi',
  },
  nl: {
    nav_overview: 'Overzicht', nav_generator: 'Wachtwoordgenerator', nav_guides: 'Gidsen', nav_download: 'Downloaden',
    hero_badge: 'Gratis & Open Source', hero_title: 'Een wachtwoordbeheerder die op jouw computer blijft.',
    download_for: 'Download voor', other_platforms: 'Andere platforms', downloads_title: 'Aegis downloaden', your_os: 'Jouw systeem',
  },
  pl: {
    nav_overview: 'Przegląd', nav_generator: 'Generator haseł', nav_guides: 'Poradniki', nav_download: 'Pobierz',
    hero_badge: 'Darmowy & Open Source', hero_title: 'Menedżer haseł, który zostaje na Twoim komputerze.',
    download_for: 'Pobierz dla', other_platforms: 'Inne platformy', downloads_title: 'Pobierz Aegis', your_os: 'Twój system',
  },
  id: {
    nav_overview: 'Ringkasan', nav_generator: 'Pembuat Sandi', nav_guides: 'Panduan', nav_download: 'Unduh',
    hero_badge: 'Gratis & Open Source', hero_title: 'Pengelola kata sandi yang tetap di komputer Anda.',
    download_for: 'Unduh untuk', other_platforms: 'Platform lain', downloads_title: 'Unduh Aegis', your_os: 'Sistem Anda',
  },
  uk: {
    nav_overview: 'Огляд', nav_generator: 'Генератор паролів', nav_guides: 'Посібники', nav_download: 'Завантажити',
    hero_badge: 'Безкоштовно та Open Source', hero_title: 'Менеджер паролів, що залишається на вашому комп’ютері.',
    download_for: 'Завантажити для', other_platforms: 'Інші платформи', downloads_title: 'Завантажити Aegis', your_os: 'Ваша ОС',
  },
  fil: {
    nav_overview: 'Pangkalahatan', nav_generator: 'Password Generator', nav_guides: 'Mga Gabay', nav_download: 'I-download',
    hero_badge: 'Libre at Open Source', hero_title: 'Password manager na nananatili sa iyong computer.',
    download_for: 'I-download para sa', other_platforms: 'Ibang platform', downloads_title: 'I-download ang Aegis', your_os: 'Iyong OS',
  },
};

export function getTranslations(lang: string): TranslationKeys {
  if (lang === 'tr') return TR;
  if (lang === 'en') return EN;
  const partial = PARTIAL_TRANSLATIONS[lang];
  return partial ? { ...EN, ...partial } : EN;
}
