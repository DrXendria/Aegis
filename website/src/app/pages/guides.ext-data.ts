import type { SecurityGuide } from './guides.data-a';

const EN_EXT_GUIDE: SecurityGuide = {
  slug: 'browser-extension-autofill',
  title: 'Offline Browser Extension: Autofill, Cards & Subscriptions',
  summary: 'How Aegis fills logins, saves payment cards, detects subscriptions, and keeps working even when the desktop app is closed.',
  readTime: '3 min read',
  paragraphs: [
    'The Aegis Vault browser extension works on Opera GX, Chrome, Brave, Edge, and Firefox without touching any cloud server. After one-time pairing via your local 32-character token in Aegis Desktop, it communicates strictly over 127.0.0.1.',
    'When you open a login or checkout page, Aegis suggests matching accounts or saved credit cards right beneath the input field. Submitting a new login, payment card, or subscription checkout (such as Netflix, Spotify, or Amazon) prompts you to save it directly into your encrypted vault—even across 2FA redirects.',
    'When you close Aegis Desktop, nothing stays running in the background. The extension keeps an AES-256-GCM encrypted offline cache so Autofill and Auto-Save continue working seamlessly, then syncs any newly saved items into your .aegis file the next time you open the desktop app.',
  ],
};

export const EXTENSION_GUIDE_BY_LANG: Record<string, SecurityGuide> = {
  en: EN_EXT_GUIDE,
  tr: {
    slug: 'browser-extension-autofill',
    title: 'Çevrimdışı Tarayıcı Eklentisi: Otomatik Doldurma, Kartlar ve Abonelikler',
    summary: 'Aegis eklentisinin şifreleri, kartları ve abonelikleri bulutsuz nasıl yönettiği ve masaüstü kapalıyken nasıl çalıştığı.',
    readTime: '3 dk okuma',
    paragraphs: [
      'Aegis Vault tarayıcı eklentisi Opera GX, Chrome, Brave, Edge ve Firefox üzerinde hiçbir bulut sunucusuna bağlanmadan çalışır. Masaüstü uygulamasındaki 32 karakterlik yerel eşleştirme anahtarıyla bir kez bağlandıktan sonra sadece 127.0.0.1 üzerinden haberleşir.',
      'Bir giriş veya ödeme sayfası açtığında Aegis, eşleşen hesaplarını ya da kayıtlı kredi kartlarını doğrudan kutucuğun altında önerir. Yeni bir hesap, kart veya abonelik ödemesi (Netflix, Spotify, Amazon gibi) yaptığında 2FA yönlendirmelerinde bile kaybolmadan kasana kaydetmeni sorar.',
      'Masaüstü uygulamasını kapattığında arkada hiçbir süreç çalışmaya devam etmez. Eklenti, AES-256-GCM ile şifreli yerel önbelleği sayesinde Autofill ve Auto-Save yapmayı sürdürür; masaüstünü bir sonraki açışında yeni kayıtları .aegis dosyana otomatik aktarır.',
    ],
  },
  de: {
    slug: 'browser-extension-autofill',
    title: 'Offline-Browser-Erweiterung: Auto-Fill, Karten & Abos',
    summary: 'Wie Aegis Logins ausfüllt, Zahlungskarten speichert, Abos erkennt und auch bei geschlossener Desktop-App funktioniert.',
    readTime: '3 Min.',
    paragraphs: [
      'Die Aegis-Vault-Erweiterung läuft in Opera GX, Chrome, Brave, Edge und Firefox völlig ohne Cloud-Server. Nach einmaliger Kopplung über den lokalen Token kommuniziert sie ausschließlich über 127.0.0.1.',
      'Auf Login- und Checkout-Seiten schlägt Aegis passende Zugänge oder gespeicherte Karten direkt unter dem Eingabefeld vor und erkennt neue Logins, Karten und Abonnements automatisch.',
      'Wird die Desktop-App geschlossen, läuft nichts im Hintergrund weiter. Ein mit AES-256-GCM verschlüsselter Offline-Cache hält Auto-Fill und Auto-Save aktiv und synchronisiert neue Einträge beim nächsten Start.',
    ],
  },
  es: {
    slug: 'browser-extension-autofill',
    title: 'Extensión sin conexión: Autocompletado, tarjetas y suscripciones',
    summary: 'Cómo Aegis rellena accesos, guarda tarjetas, detecta suscripciones y sigue funcionando con la app de escritorio cerrada.',
    readTime: '3 min',
    paragraphs: [
      'La extensión de Aegis Vault funciona en Opera GX, Chrome, Brave, Edge y Firefox sin usar servidores en la nube. Tras emparejarla una vez con el token local, solo se comunica mediante 127.0.0.1.',
      'En páginas de acceso o pago, sugiere cuentas o tarjetas guardadas bajo el campo de entrada y ofrece guardar nuevos inicios de sesión, tarjetas o suscripciones incluso tras redirecciones 2FA.',
      'Al cerrar la app de escritorio no queda ningún proceso en segundo plano: la caché cifrada AES-256-GCM mantiene todo activo y sincroniza los nuevos registros al volver a abrir Aegis.',
    ],
  },
  fr: {
    slug: 'browser-extension-autofill',
    title: 'Extension hors ligne : remplissage auto, cartes et abonnements',
    summary: 'Comment Aegis remplit vos accès, enregistre vos cartes et abonnements, même lorsque l’application de bureau est fermée.',
    readTime: '3 min',
    paragraphs: [
      'L’extension Aegis Vault fonctionne sur Opera GX, Chrome, Brave, Edge et Firefox sans aucun serveur cloud. Après un jumelage local unique, elle communique uniquement via 127.0.0.1.',
      'Sur les pages de connexion ou de paiement, Aegis propose vos comptes et cartes enregistrés sous le champ de saisie et détecte automatiquement les nouveaux identifiants, cartes et abonnements.',
      'Lorsque vous fermez l’application de bureau, aucun processus ne reste en arrière-plan : un cache local chiffré AES-256-GCM assure la continuité et synchronise les ajouts à la prochaine ouverture.',
    ],
  },
  it: {
    slug: 'browser-extension-autofill',
    title: 'Estensione offline: compilazione auto, carte e abbonamenti',
    summary: 'Come Aegis compila accessi, salva carte, rileva abbonamenti e continua a funzionare ad app desktop chiusa.',
    readTime: '3 min',
    paragraphs: [
      'L’estensione Aegis Vault funziona su Opera GX, Chrome, Brave, Edge e Firefox senza alcun cloud. Dopo l’abbinamento locale comunica solo su 127.0.0.1.',
      'Nelle pagine di accesso o pagamento suggerisce account e carte salvate sotto il campo e propone il salvataggio automatico di nuovi login, carte e abbonamenti anche dopo i redirect 2FA.',
      'Chiudendo l’app desktop non resta alcun processo in background: la cache locale cifrata AES-256-GCM mantiene tutto operativo e sincronizza i nuovi elementi alla riapertura.',
    ],
  },
  pt: {
    slug: 'browser-extension-autofill',
    title: 'Extensão offline: preenchimento automático, cartões e assinaturas',
    summary: 'Como o Aegis preenche logins, salva cartões, detecta assinaturas e continua funcionando com o app desktop fechado.',
    readTime: '3 min',
    paragraphs: [
      'A extensão Aegis Vault funciona no Opera GX, Chrome, Brave, Edge e Firefox sem tocar na nuvem. Após o pareamento local único, comunica-se apenas em 127.0.0.1.',
      'Em páginas de login ou pagamento, sugere contas e cartões salvos logo abaixo do campo e oferece salvar novos logins, cartões e assinaturas automaticamente.',
      'Ao fechar o app desktop nada fica rodando em segundo plano: um cache local criptografado com AES-256-GCM mantém o preenchimento ativo e sincroniza tudo na próxima abertura.',
    ],
  },
  ru: {
    slug: 'browser-extension-autofill',
    title: 'Офлайн-расширение: автозаполнение, карты и подписки',
    summary: 'Как Aegis заполняет пароли, сохраняет карты, распознаёт подписки и работает даже при закрытом приложении.',
    readTime: '3 мин',
    paragraphs: [
      'Расширение Aegis Vault работает в Opera GX, Chrome, Brave, Edge и Firefox без облачных серверов — только через локальный адрес 127.0.0.1 после разового сопряжения токеном.',
      'На страницах входа и оплаты оно предлагает сохранённые логины и карты прямо под полем ввода и умеет сохранять новые пароли, карты и подписки даже после редиректов 2FA.',
      'При закрытии настольного приложения фоновых процессов не остаётся: зашифрованный кэш AES-256-GCM обеспечивает работу офлайн и синхронизирует новые записи при следующем запуске.',
    ],
  },
  zh: {
    slug: 'browser-extension-autofill',
    title: '离线浏览器扩展：自动填充、银行卡与订阅管理',
    summary: '了解 Aegis 如何在无云端、无后台进程的情况下自动填充密码、保存银行卡并识别订阅。',
    readTime: '3 分钟',
    paragraphs: [
      'Aegis Vault 浏览器扩展支持 Opera GX、Chrome、Brave、Edge 和 Firefox，完全不连接任何云服务器。通过本地配对令牌连接后，仅通过 127.0.0.1 通信。',
      '在登录或结账页面，Aegis 会在输入框下方直接提示匹配的账号或已保存的银行卡，并在提交新账号、银行卡或订阅结账时提供一键保存。',
      '关闭桌面应用后不会在后台驻留进程：扩展内置 AES-256-GCM 加密离线缓存，继续支持自动填充与保存，并在下次打开桌面端时自动同步。',
    ],
  },
  hi: {
    slug: 'browser-extension-autofill',
    title: 'ऑफ़लाइन ब्राउज़र एक्सटेंशन: ऑटोफ़िल, कार्ड और सब्सक्रिप्शन',
    summary: 'जानें कि डेस्कटॉप ऐप बंद होने पर भी Aegis लॉगिन, कार्ड और सब्सक्रिप्शन को कैसे सुरक्षित रखता है।',
    readTime: '3 मिनट',
    paragraphs: [
      'Aegis Vault ब्राउज़र एक्सटेंशन Opera GX, Chrome, Brave, Edge और Firefox पर बिना किसी क्लाउड सर्वर के चलता है और केवल लोकल 127.0.0.1 से जुड़ता है।',
      'लॉगिन या भुगतान पेज पर यह सीधे इनपुट बॉक्स के नीचे सहेजे गए खाते और कार्ड सुझाता है और नए लॉगिन, कार्ड व सब्सक्रिप्शन सहेजने की सुविधा देता है।',
      'डेस्कटॉप ऐप बंद होने पर बैकग्राउंड में कुछ नहीं चलता; AES-256-GCM एन्क्रिप्टेड ऑफ़लाइन कैश काम जारी रखता है और अगली बार ऐप खोलने पर सब सिंक हो जाता है।',
    ],
  },
  ko: {
    slug: 'browser-extension-autofill',
    title: '오프라인 브라우저 확장: 자동 완성, 카드 및 구독 관리',
    summary: '데스크톱 앱이 닫혀 있어도 Aegis가 로그인, 카드, 구독을 클라우드 없이 처리하는 방법.',
    readTime: '3분',
    paragraphs: [
      'Aegis Vault 확장 프로그램은 Opera GX, Chrome, Brave, Edge, Firefox에서 클라우드 없이 127.0.0.1 로컬 브리지로만 통신합니다.',
      '로그인 및 결제 페이지에서 입력창 바로 아래에 저장된 계정과 카드를 제안하며, 새 로그인·카드·구독 결제를 자동으로 감지해 저장합니다.',
      '데스크톱 앱을 닫아도 백그라운드 프로세스가 남지 않으며, AES-256-GCM 암호화 오프라인 캐시로 계속 작동하고 다음 실행 시 자동 동기화됩니다.',
    ],
  },
  ja: {
    slug: 'browser-extension-autofill',
    title: 'オフラインブラウザ拡張：自動入力・カード・サブスク管理',
    summary: 'デスクトップアプリ終了後でもクラウドなしで自動入力・保存を続ける仕組み。',
    readTime: '3分',
    paragraphs: [
      'Aegis Vault 拡張機能は Opera GX、Chrome、Brave、Edge、Firefox に対応し、クラウドを一切使わず 127.0.0.1 のローカル接続のみで動作します。',
      'ログインや決済画面で入力欄のすぐ下に候補を表示し、新しいログイン・クレジットカード・サブスクリプション決済を自動検出して保存できます。',
      'デスクトップアプリを閉じてもバックグラウンド常駐は不要です。AES-256-GCM 暗号化オフラインキャッシュで動作し、次回起動時に自動同期されます。',
    ],
  },
  ar: {
    slug: 'browser-extension-autofill',
    title: 'إضافة المتصفح دون اتصال: التعبئة التلقائية والبطاقات والاشتراكات',
    summary: 'كيف يملأ Aegis بيانات الدخول ويحفظ البطاقات والاشتراكات حتى عند إغلاق تطبيق سطح المكتب.',
    readTime: '3 دقائق',
    paragraphs: [
      'تعمل إضافة Aegis Vault على Opera GX وChrome وBrave وEdge وFirefox دون أي خادم سحابي، وتتصل محلياً عبر 127.0.0.1 فقط.',
      'تقترح الإضافة الحسابات والبطاقات المحفوظة مباشرة أسفل حقول الإدخال، وتعرض حفظ بيانات الدخول والبطاقات والاشتراكات الجديدة تلقائياً.',
      'عند إغلاق التطبيق لا تبقى أي عمليات في الخلفية؛ يحتفظ المتصفح بذاكرة مؤقتة مشفرة بـ AES-256-GCM ويزامن الإضافات الجديدة عند فتح التطبيق لاحقاً.',
    ],
  },
  fa: {
    slug: 'browser-extension-autofill',
    title: 'افزونه آفلاین مرورگر: تکمیل خودکار، کارت‌ها و اشتراک‌ها',
    summary: 'چگونه Aegis ورودها، کارت‌ها و اشتراک‌ها را حتی هنگام بسته بودن برنامه دسکتاپ مدیریت می‌کند.',
    readTime: '3 دقیقه',
    paragraphs: [
      'افزونه Aegis Vault روی Opera GX، Chrome، Brave، Edge و Firefox بدون هیچ سرور ابری و فقط از طریق 127.0.0.1 کار می‌کند.',
      'در صفحات ورود و پرداخت، حساب‌ها و کارت‌های ذخیره‌شده را زیر فیلد نمایش می‌دهد و ورودها، کارت‌ها و اشتراک‌های جدید را خودکار پیشنهاد ذخیره می‌دهد.',
      'با بستن برنامه دسکتاپ هیچ فرآیندی در پس‌زمینه نمی‌ماند؛ حافظه نهان رمزنگاری‌شده AES-256-GCM کار را ادامه می‌دهد و در اجرای بعدی همگام‌سازی می‌کند.',
    ],
  },
  el: {
    slug: 'browser-extension-autofill',
    title: 'Επέκταση εκτός σύνδεσης: Αυτόματη συμπλήρωση, κάρτες & συνδρομές',
    summary: 'Πώς το Aegis συμπληρώνει συνδέσεις, αποθηκεύει κάρτες και συνδρομές ακόμα και με κλειστή την εφαρμογή.',
    readTime: '3 λεπτά',
    paragraphs: [
      'Η επέκταση Aegis Vault λειτουργεί σε Opera GX, Chrome, Brave, Edge και Firefox χωρίς cloud, επικοινωνώντας μόνο τοπικά μέσω 127.0.0.1.',
      'Προτείνει αποθηκευμένους λογαριασμούς και κάρτες κάτω από τα πεδία εισαγωγής και εντοπίζει αυτόματα νέες συνδέσεις, κάρτες και συνδρομές.',
      'Όταν κλείνετε την εφαρμογή δεν μένει καμία διεργασία στο παρασκήνιο· η κρυπτογραφημένη cache AES-256-GCM συγχρονίζει τα νέα στοιχεία στο επόμενο άνοιγμα.',
    ],
  },
  he: {
    slug: 'browser-extension-autofill',
    title: 'תוסף אופליין: מילוי אוטומטי, כרטיסים ומנויים',
    summary: 'איך Aegis ממלא סיסמאות, שומר כרטיסים ומזהה מנויים גם כשהאפליקציה סגורה.',
    readTime: '3 דקות',
    paragraphs: [
      'תוסף Aegis Vault עובד ב-Opera GX, Chrome, Brave, Edge ו-Firefox ללא שרת ענן ומתקשר מקומית בלבד דרך 127.0.0.1.',
      'בעמודי התחברות ותשלום הוא מציע חשבונות וכרטיסים שמורים מתחת לשדה ומאפשר שמירה אוטומטית של סיסמאות, כרטיסים ומנויים חדשים.',
      'כשסוגרים את האפליקציה לא נשאר תהליך ברקע; מטמון מקומי מוצפן ב-AES-256-GCM ממשיך לעבוד ומסנכרן בפתיחה הבאה.',
    ],
  },
  da: {
    slug: 'browser-extension-autofill',
    title: 'Offline browserudvidelse: Auto-udfyld, kort og abonnementer',
    summary: 'Sådan udfylder Aegis logins, gemmer betalingskort og registrerer abonnementer selv når desktopappen er lukket.',
    readTime: '3 min.',
    paragraphs: [
      'Aegis Vault-udvidelsen fungerer i Opera GX, Chrome, Brave, Edge og Firefox uden cloud og kommunikerer kun lokalt over 127.0.0.1.',
      'På login- og betalingssider foreslår den gemte konti og kort direkte under feltet og tilbyder automatisk lagring af nye logins, kort og abonnementer.',
      'Når desktopappen lukkes, kører intet i baggrunden: en AES-256-GCM-krypteret offline-cache holder alt i gang og synkroniserer ved næste åbning.',
    ],
  },
  no: {
    slug: 'browser-extension-autofill',
    title: 'Frakoblet nettleserutvidelse: Autofyll, kort og abonnementer',
    summary: 'Slik fyller Aegis ut pålogginger, lagrer kort og fanger opp abonnementer selv når appen er lukket.',
    readTime: '3 min',
    paragraphs: [
      'Aegis Vault-utvidelsen fungerer i Opera GX, Chrome, Brave, Edge og Firefox uten skytjenester og kommuniserer kun lokalt via 127.0.0.1.',
      'På innloggings- og betalingssider foreslår den lagrede kontoer og kort rett under feltet og tilbyr lagring av nye pålogginger, kort og abonnementer.',
      'Når skrivebordsappen lukkes, kjører ingenting i bakgrunnen: en AES-256-GCM-kryptert hurtigbuffer synkroniserer nye oppføringer neste gang appen åpnes.',
    ],
  },
  sv: {
    slug: 'browser-extension-autofill',
    title: 'Offline-webbläsartillägg: Autofyll, kort och prenumerationer',
    summary: 'Hur Aegis fyller i inloggningar, sparar betalkort och känner igen prenumerationer även när appen är stängd.',
    readTime: '3 min',
    paragraphs: [
      'Aegis Vault-tillägget fungerar i Opera GX, Chrome, Brave, Edge och Firefox helt utan moln och kommunicerar bara lokalt via 127.0.0.1.',
      'På inloggnings- och betalningssidor föreslår det sparade konton och kort direkt under fältet och kan spara nya inloggningar, kort och prenumerationer.',
      'När skrivbordsappen stängs körs inget i bakgrunden: en AES-256-GCM-krypterad offline-cache håller allt igång och synkar nästa gång appen öppnas.',
    ],
  },
  fi: {
    slug: 'browser-extension-autofill',
    title: 'Offline-selainlaajennus: Automaattinen täyttö, kortit ja tilaukset',
    summary: 'Näin Aegis täyttää kirjautumiset, tallentaa kortit ja tunnistaa tilaukset myös työpöytäsovelluksen ollessa suljettuna.',
    readTime: '3 min',
    paragraphs: [
      'Aegis Vault -laajennus toimii Opera GX-, Chrome-, Brave-, Edge- ja Firefox-selaimissa ilman pilveä ja käyttää vain paikallista 127.0.0.1-yhteyttä.',
      'Kirjautumis- ja maksusivuilla se ehdottaa tallennettuja tilejä ja kortteja suoraan kentän alla sekä tallentaa uudet tunnukset, kortit ja tilaukset.',
      'Kun työpöytäsovellus suljetaan, mikään ei jää taustalle: AES-256-GCM-salattu välimuisti pitää täytön toiminnassa ja synkronoi uudet tiedot seuraavalla avauskerralla.',
    ],
  },
  nl: {
    slug: 'browser-extension-autofill',
    title: 'Offline browserextensie: automatisch invullen, kaarten & abonnementen',
    summary: 'Hoe Aegis logins invult, betaalkaarten opslaat en abonnementen herkent zonder cloud of achtergrondproces.',
    readTime: '3 min',
    paragraphs: [
      'De Aegis Vault-extensie werkt in Opera GX, Chrome, Brave, Edge en Firefox zonder cloud en praat uitsluitend lokaal via 127.0.0.1.',
      'Op inlog- en betaalpagina’s toont Aegis opgeslagen accounts en kaarten direct onder het veld en biedt het aan nieuwe logins, kaarten en abonnementen op te slaan.',
      'Wanneer je de desktop-app sluit blijft er niets op de achtergrond draaien: een AES-256-GCM versleutelde offline cache synchroniseert nieuwe items bij de volgende start.',
    ],
  },
  pl: {
    slug: 'browser-extension-autofill',
    title: 'Rozszerzenie offline: autouzupełnianie, karty i subskrypcje',
    summary: 'Jak Aegis uzupełnia loginy, zapisuje karty i wykrywa subskrypcje nawet przy zamkniętej aplikacji.',
    readTime: '3 min',
    paragraphs: [
      'Rozszerzenie Aegis Vault działa w Opera GX, Chrome, Brave, Edge i Firefox bez żadnej chmury, łącząc się lokalnie wyłącznie przez 127.0.0.1.',
      'Na stronach logowania i płatności podpowiada zapisane konta i karty bezpośrednio pod polem oraz pozwala zapisać nowe loginy, karty i subskrypcje.',
      'Po zamknięciu aplikacji desktopowej nic nie działa w tle: zaszyfrowana pamięć podręczna AES-256-GCM synchronizuje nowe wpisy przy kolejnym uruchomieniu.',
    ],
  },
  id: {
    slug: 'browser-extension-autofill',
    title: 'Ekstensi Browser Offline: Isi Otomatis, Kartu & Langganan',
    summary: 'Cara Aegis mengisi login, menyimpan kartu, mendeteksi langganan, dan tetap bekerja saat aplikasi desktop ditutup.',
    readTime: '3 mnt',
    paragraphs: [
      'Ekstensi Aegis Vault berjalan di Opera GX, Chrome, Brave, Edge, dan Firefox tanpa server cloud dan hanya berkomunikasi lokal melalui 127.0.0.1.',
      'Di halaman login atau pembayaran, Aegis menampilkan akun dan kartu tersimpan tepat di bawah kolom input serta menawarkan penyimpanan login, kartu, dan langganan baru.',
      'Saat aplikasi desktop ditutup tidak ada proses latar belakang yang tersisa: cache offline terenkripsi AES-256-GCM menyinkronkan data baru saat aplikasi dibuka kembali.',
    ],
  },
  uk: {
    slug: 'browser-extension-autofill',
    title: 'Офлайн-розширення: автозаповнення, картки та підписки',
    summary: 'Як Aegis заповнює паролі, зберігає картки, розпізнає підписки та працює навіть із закритим додатком.',
    readTime: '3 хв',
    paragraphs: [
      'Розширення Aegis Vault працює в Opera GX, Chrome, Brave, Edge і Firefox без хмарних серверів — лише локально через 127.0.0.1.',
      'На сторінках входу та оплати воно підказує збережені акаунти й картки під полем вводу та дозволяє зберегти нові логіни, картки й підписки.',
      'Після закриття настільного додатка фонових процесів не залишається: зашифрований кеш AES-256-GCM автоматично синхронізує нові записи під час наступного запуску.',
    ],
  },
  fil: {
    slug: 'browser-extension-autofill',
    title: 'Offline Browser Extension: Autofill, Mga Card at Subscription',
    summary: 'Paano pinupunan ng Aegis ang mga login, card, at subscription kahit nakasara ang desktop app.',
    readTime: '3 min',
    paragraphs: [
      'Gumagana ang Aegis Vault browser extension sa Opera GX, Chrome, Brave, Edge, at Firefox nang walang cloud server at lokal lang nakikipag-ugnayan sa 127.0.0.1.',
      'Sa mga login o checkout page, ipinapakita nito ang mga naka-save na account at card sa ilalim ng field at nag-aalok na i-save ang bagong login, card, o subscription.',
      'Kapag isinara ang desktop app walang natitirang background process: patuloy itong gumagana sa AES-256-GCM encrypted offline cache at kusang nagsi-sync sa susunod na bukas.',
    ],
  },
};

export function getExtensionGuide(lang: string): SecurityGuide {
  return EXTENSION_GUIDE_BY_LANG[lang] ?? EN_EXT_GUIDE;
}
