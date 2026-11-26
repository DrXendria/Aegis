export interface SecurityGuide {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  paragraphs: string[];
}

export const GUIDES_A: Record<string, SecurityGuide[]> = {
  en: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'How AES-256-GCM & 600,000-Round PBKDF2 Protect Your Vault',
      summary: 'A clear look at key derivation, random initialization vectors (IVs), and authenticated encryption in Aegis Vault.',
      readTime: '4 min read',
      paragraphs: [
        'Aegis Vault derives a 256-bit AES key from your Master Password using PBKDF2-HMAC-SHA256 with 600,000 iterations, slowing down offline brute-force attempts dramatically.',
        'Every entry in your vault—including site title, username, password, card details, and notes—is encrypted with AES-256-GCM using a fresh 96-bit random Initialization Vector (IV).',
        'Because GCM is authenticated encryption, any tampering or corruption is detected immediately, and a built-in key check rejects a wrong Master Password right at unlock.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'How to Move Passwords from Chrome, Bitwarden, or LastPass to an Offline Vault',
      summary: 'Step-by-step instructions to export browser-saved passwords and lock them inside a local encrypted .aegis vault.',
      readTime: '3 min read',
      paragraphs: [
        'Browser-saved passwords are convenient, but browser profiles are frequent targets for infostealers. Moving logins into a Master-Password-locked local vault reduces your exposure.',
        'In Chrome, open chrome://password-manager/settings and export your passwords as CSV. In Bitwarden or LastPass, open Settings and choose Export Vault (CSV or JSON).',
        'Open Aegis Vault, go to Data Management, click Import Data, and select the exported file. Once imported, permanently delete the temporary plaintext CSV file.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Local-First vs. Cloud Password Managers',
      summary: 'Comparing cloud convenience against zero-server-exposure security, atomic backups, and user-controlled sync.',
      readTime: '4 min read',
      paragraphs: [
        'Cloud password managers make multi-device sync effortless, but they create centralized targets and introduce risks like misconfigured permissions, outages, or subscription lock-in.',
        'A local-first vault keeps your encrypted .aegis file strictly on your machine. No remote server can be probed, rate-limited, or wiped by a third party.',
        'With atomic saves (.tmp + .bak) and automatic 14-day encrypted backups in Documents/Aegis-Backups, you stay protected—and can sync the encrypted file yourself via Syncthing or Drive whenever you want.',
      ],
    },
  ],
  tr: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'AES-256-GCM ve 600.000 Turlu PBKDF2 Kasanızı Nasıl Korur?',
      summary: 'Aegis Vault içindeki anahtar türetme, rastgele IV ve kimlik doğrulamalı şifrelemenin sade özeti.',
      readTime: '4 dk okuma',
      paragraphs: [
        'Aegis Vault, Ana Şifrenizden 600.000 iterasyonlu PBKDF2-HMAC-SHA256 ile 256-bit AES anahtarı türetir ve çevrimdışı kaba kuvvet saldırılarını ciddi ölçüde yavaşlatır.',
        'Site adı, kullanıcı adı, şifre, kart bilgileri ve notlar dahil her kayıt, her seferinde yeni üretilen 96-bit rastgele IV ile AES-256-GCM kullanılarak şifrelenir.',
        'GCM kimlik doğrulamalı şifreleme sunduğu için dosyadaki en ufak bozulma anında tespit edilir ve yerleşik anahtar kontrolü yanlış Ana Şifreyi daha girişte reddeder.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Chrome, Bitwarden veya LastPass Şifrelerini Çevrimdışı Kasaya Taşıma',
      summary: 'Tarayıcıdaki kayıtlı şifreleri dışa aktarıp yerel şifreli .aegis kasasına taşıma rehberi.',
      readTime: '3 dk okuma',
      paragraphs: [
        'Tarayıcıya şifre kaydetmek pratiktir ancak tarayıcı profilleri zararlı yazılımların ilk hedefidir. Giriş bilgilerini Ana Şifre korumalı yerel kasaya taşımak riski ciddi biçimde azaltır.',
        'Google Chrome’da chrome://password-manager/settings sayfasından CSV dışa aktarın. Bitwarden veya LastPass’ta Ayarlar altından Kasayı Dışa Aktar (CSV/JSON) seçin.',
        'Aegis Vault’ta Veri Yönetimi → Verileri İçe Aktar ile dosyanızı seçin. Aktarım bitince geçici düz metin CSV dosyasını kalıcı olarak silmeyi unutmayın.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Yerel (Local-First) vs. Bulut Şifre Yöneticileri',
      summary: 'Bulut kolaylığı ile sıfır sunucu riski, atomik yedekleme ve kullanıcı kontrollü senkronun karşılaştırması.',
      readTime: '4 dk okuma',
      paragraphs: [
        'Bulut şifre yöneticileri çoklu cihaz senkronunu kolaylaştırır ancak merkezi hedef oluşturur; yanlış yetki kuralları, kesintiler veya abonelik bağımlılığı riski taşır.',
        'Yerel odaklı bir kasa, şifreli .aegis dosyasını yalnızca bilgisayarınızda tutar. Dışarıdan hiçbir sunucu taranamaz veya üçüncü taraflarca silinemez.',
        'Atomik kayıt (.tmp + .bak) ve Documents/Aegis-Backups içindeki 14 günlük otomatik şifreli yedeklerle veriniz güvende kalır; isterseniz şifreli dosyayı Syncthing veya Drive ile kendiniz eşitleyebilirsiniz.',
      ],
    },
  ],
  de: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Wie AES-256-GCM & 600.000 PBKDF2-Runden deinen Tresor schützen',
      summary: 'Ein klarer Überblick über Schlüsselableitung, zufällige IVs und authentifizierte Verschlüsselung in Aegis Vault.',
      readTime: '4 Min. Lesezeit',
      paragraphs: [
        'Aegis Vault leitet aus deinem Master-Passwort mittels PBKDF2-HMAC-SHA256 und 600.000 Iterationen einen 256-Bit-AES-Schlüssel ab und verlangsamt Offline-Brute-Force-Angriffe drastisch.',
        'Jeder Eintrag – inklusive Seitenname, Benutzername, Passwort, Karten und Notizen – wird mit AES-256-GCM und einem frischen 96-Bit-Zufalls-IV verschlüsselt.',
        'Da GCM authentifizierte Verschlüsselung bietet, werden Manipulationen sofort erkannt und ein falsches Master-Passwort wird direkt beim Entsperren abgewiesen.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Passwörter aus Chrome, Bitwarden oder LastPass in einen Offline-Tresor umziehen',
      summary: 'Schritt-für-Schritt-Anleitung zum Exportieren von Browser-Passwörtern in deinen lokalen .aegis-Tresor.',
      readTime: '3 Min. Lesezeit',
      paragraphs: [
        'Im Browser gespeicherte Passwörter sind praktisch, doch Browserprofile sind ein häufiges Ziel für Infostealer. Ein lokaler Tresor mit Master-Passwort senkt das Risiko deutlich.',
        'Exportiere in Chrome unter chrome://password-manager/settings eine CSV-Datei. In Bitwarden oder LastPass findest du den Export in den Einstellungen (CSV/JSON).',
        'Öffne in Aegis Vault die Datenverwaltung, klicke auf Daten importieren und wähle die Datei. Lösche danach die temporäre unverschlüsselte CSV-Datei dauerhaft.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Local-First vs. Cloud-Passwort-Manager',
      summary: 'Cloud-Komfort im Vergleich zu null Server-Angriffsfläche, atomaren Backups und eigener Kontrolle.',
      readTime: '4 Min. Lesezeit',
      paragraphs: [
        'Cloud-Passwort-Manager bieten einfache Synchronisation, schaffen aber zentrale Angriffsziele und Risiken durch Fehlkonfigurationen, Ausfälle oder Abo-Zwang.',
        'Ein Local-First-Tresor hält deine verschlüsselte .aegis-Datei strikt auf deinem Gerät. Kein externer Server kann angegriffen oder gelöscht werden.',
        'Mit atomarem Speichern (.tmp + .bak) und automatischen 14-Tage-Backups in Documents/Aegis-Backups bleiben deine Daten sicher – und auf Wunsch synchronisierst du die verschlüsselte Datei selbst via Syncthing oder Drive.',
      ],
    },
  ],
  es: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Cómo AES-256-GCM y PBKDF2 de 600.000 rondas protegen tu bóveda',
      summary: 'Explicación clara de derivación de claves, vectores IV aleatorios y cifrado autenticado en Aegis Vault.',
      readTime: '4 min de lectura',
      paragraphs: [
        'Aegis Vault deriva una clave AES de 256 bits desde tu Contraseña Maestra usando PBKDF2-HMAC-SHA256 con 600.000 iteraciones, frenando ataques de fuerza bruta.',
        'Cada entrada —incluyendo título, usuario, contraseña, tarjetas y notas— se cifra con AES-256-GCM usando un vector IV aleatorio de 96 bits.',
        'Al ser cifrado autenticado, cualquier alteración se detecta al instante y una comprobación interna rechaza contraseñas maestras incorrectas al desbloquear.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Cómo migrar contraseñas de Chrome, Bitwarden o LastPass a una bóveda offline',
      summary: 'Guía paso a paso para exportar contraseñas del navegador y guardarlas en tu archivo local .aegis.',
      readTime: '3 min de lectura',
      paragraphs: [
        'Guardar contraseñas en el navegador es cómodo, pero los perfiles de navegador son un blanco habitual de malware. Pasarlas a una bóveda local cifrada reduce el riesgo.',
        'En Chrome abre chrome://password-manager/settings y exporta tus contraseñas en CSV. En Bitwarden o LastPass usa Exportar bóveda en Ajustes.',
        'Abre Gestión de Datos en Aegis Vault, pulsa Importar y elige tu archivo. Al terminar, borra definitivamente el CSV temporal sin cifrar.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Gestores locales (Local-First) frente a gestores en la nube',
      summary: 'Comodidad en la nube frente a cero exposición de servidores, copias atómicas y control total.',
      readTime: '4 min de lectura',
      paragraphs: [
        'Los gestores en la nube sincronizan fácilmente, pero crean objetivos centralizados y riesgos por reglas mal configuradas, caídas o suscripciones.',
        'Una bóveda local mantiene tu archivo cifrado .aegis exclusivamente en tu ordenador, sin servidores remotos que terceros puedan atacar o borrar.',
        'Con guardado atómico (.tmp + .bak) y copias cifradas cada 14 días en Documents/Aegis-Backups, tus datos siguen seguros y puedes sincronizar el archivo cifrado con Syncthing o Drive si lo deseas.',
      ],
    },
  ],
  fr: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Comment AES-256-GCM et PBKDF2 (600 000 tours) protègent votre coffre',
      summary: 'Un aperçu clair de la dérivation de clé, des IV aléatoires et du chiffrement authentifié dans Aegis Vault.',
      readTime: '4 min de lecture',
      paragraphs: [
        'Aegis Vault dérive une clé AES 256 bits depuis votre mot de passe maître via PBKDF2-HMAC-SHA256 à 600 000 itérations pour freiner les attaques par force brute.',
        'Chaque entrée — titre, identifiant, mot de passe, cartes et notes — est chiffrée en AES-256-GCM avec un vecteur d’initialisation aléatoire de 96 bits.',
        'Grâce au chiffrement authentifié GCM, toute altération est immédiatement détectée et un mot de passe maître erroné est rejeté dès l’ouverture.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Migrer vos mots de passe de Chrome, Bitwarden ou LastPass vers un coffre hors ligne',
      summary: 'Guide étape par étape pour exporter vos mots de passe et les sécuriser dans un fichier local .aegis.',
      readTime: '3 min de lecture',
      paragraphs: [
        'Enregistrer ses mots de passe dans le navigateur est pratique, mais les profils de navigateur sont souvent ciblés par les malwares. Un coffre local réduit fortement ce risque.',
        'Dans Chrome, ouvrez chrome://password-manager/settings et exportez en CSV. Dans Bitwarden ou LastPass, exportez le coffre depuis les paramètres.',
        'Dans Aegis Vault, ouvrez Gestion des données, cliquez sur Importer et sélectionnez le fichier. Supprimez ensuite définitivement le fichier CSV temporaire.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Gestionnaires locaux (Local-First) vs gestionnaires cloud',
      summary: 'Comparer la commodité du cloud à l’absence de serveur exposé, aux sauvegardes atomiques et au contrôle total.',
      readTime: '4 min de lecture',
      paragraphs: [
        'Les gestionnaires cloud simplifient la synchronisation, mais créent des cibles centralisées exposées aux erreurs de configuration, pannes ou abonnements.',
        'Un coffre local conserve votre fichier .aegis chiffré uniquement sur votre machine, sans aucun serveur distant accessible par un tiers.',
        'Avec les écritures atomiques (.tmp + .bak) et les sauvegardes chiffrées tous les 14 jours dans Documents/Aegis-Backups, vous gardez le contrôle complet.',
      ],
    },
  ],
  it: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Come AES-256-GCM e PBKDF2 a 600.000 round proteggono il tuo vault',
      summary: 'Panoramica su derivazione della chiave, IV casuali e crittografia autenticata in Aegis Vault.',
      readTime: '4 min di lettura',
      paragraphs: [
        'Aegis Vault deriva una chiave AES a 256 bit dalla Master Password tramite PBKDF2-HMAC-SHA256 con 600.000 iterazioni per rallentare attacchi brute-force.',
        'Ogni voce — titolo, utente, password, carte e note — viene cifrata con AES-256-GCM usando un IV casuale a 96 bit sempre nuovo.',
        'GCM garantisce integrità autenticata: eventuali manomissioni vengono rilevate subito e una Master Password errata viene rifiutata all’accesso.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Come spostare le password da Chrome, Bitwarden o LastPass in un vault offline',
      summary: 'Guida rapida per esportare le password del browser e proteggerle nel tuo file locale .aegis.',
      readTime: '3 min di lettura',
      paragraphs: [
        'Salvare le password nel browser è comodo, ma i profili del browser sono spesso presi di mira dai malware. Un vault locale cifrato riduce il rischio.',
        'In Chrome apri chrome://password-manager/settings ed esporta in CSV. In Bitwarden o LastPass scegli Esporta Vault dalle impostazioni.',
        'Apri Gestione Dati in Aegis Vault, importa il file con un clic e poi elimina definitivamente il file CSV temporaneo.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Password manager locali (Local-First) vs cloud',
      summary: 'Comodità del cloud a confronto con zero esposizione server, backup atomici e pieno controllo.',
      readTime: '4 min di lettura',
      paragraphs: [
        'I gestori cloud semplificano la sincronizzazione, ma creano bersagli centralizzati soggetti a errori di configurazione, interruzioni o abbonamenti.',
        'Un vault locale mantiene il file .aegis cifrato solo sul tuo computer, senza server remoti esposti.',
        'Con salvataggi atomici (.tmp + .bak) e backup cifrati ogni 14 giorni in Documents/Aegis-Backups, i dati restano al sicuro e sincronizzabili a tua scelta.',
      ],
    },
  ],
  pt: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Como AES-256-GCM e 600.000 rodadas de PBKDF2 protegem seu cofre',
      summary: 'Resumo prático de derivação de chave, IVs aleatórios e criptografia autenticada no Aegis Vault.',
      readTime: '4 min de leitura',
      paragraphs: [
        'O Aegis Vault deriva uma chave AES de 256 bits a partir da sua Senha Mestra usando PBKDF2-HMAC-SHA256 com 600.000 iterações.',
        'Cada registro — site, usuário, senha, cartões e notas — é criptografado com AES-256-GCM usando um IV aleatório de 96 bits.',
        'Como o GCM autentica os dados, qualquer corrupção é detectada na hora e senhas mestras incorretas são rejeitadas no desbloqueio.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Como migrar senhas do Chrome, Bitwarden ou LastPass para um cofre offline',
      summary: 'Passo a passo para exportar senhas do navegador e protegê-las no arquivo local .aegis.',
      readTime: '3 min de leitura',
      paragraphs: [
        'Salvar senhas no navegador é prático, mas perfis de navegador são alvos frequentes de malwares. Um cofre local reduz sua exposição.',
        'No Chrome acesse chrome://password-manager/settings e exporte em CSV. No Bitwarden ou LastPass, exporte pelas configurações.',
        'No Aegis Vault abra Gestão de Dados, importe o arquivo em um clique e depois apague permanentemente o CSV temporário.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Cofres locais (Local-First) vs gerenciadores na nuvem',
      summary: 'Conveniência da nuvem comparada a zero exposição de servidor, backups atômicos e controle total.',
      readTime: '4 min de leitura',
      paragraphs: [
        'Gerenciadores na nuvem facilitam a sincronização, mas criam alvos centralizados sujeitos a falhas de permissão, quedas ou assinaturas.',
        'Um cofre local mantém seu arquivo .aegis criptografado apenas no seu computador, sem servidores externos.',
        'Com gravações atômicas (.tmp + .bak) e backups criptografados a cada 14 dias em Documents/Aegis-Backups, você mantém durabilidade e autonomia.',
      ],
    },
  ],
  ru: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Как AES-256-GCM и 600 000 раундов PBKDF2 защищают хранилище',
      summary: 'Понятный разбор генерации ключа, случайных IV и аутентифицированного шифрования в Aegis Vault.',
      readTime: '4 мин чтения',
      paragraphs: [
        'Aegis Vault получает 256-битный ключ AES из вашего мастер-пароля с помощью PBKDF2-HMAC-SHA256 (600 000 итераций), замедляя офлайн-перебор.',
        'Каждая запись — название сайта, логин, пароль, карты и заметки — шифруется алгоритмом AES-256-GCM со случайным 96-битным вектором IV.',
        'Режим GCM проверяет целостность данных, мгновенно обнаруживая подмену, а встроенная проверка сразу отклоняет неверный мастер-пароль.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Как перенести пароли из Chrome, Bitwarden или LastPass в офлайн-хранилище',
      summary: 'Пошаговая инструкция по экспорту паролей из браузера в локальный зашифрованный файл .aegis.',
      readTime: '3 мин чтения',
      paragraphs: [
        'Хранить пароли в браузере удобно, но профили браузеров часто становятся целью стилеров. Перенос в локальное хранилище снижает риски.',
        'В Chrome откройте chrome://password-manager/settings и экспортируйте CSV. В Bitwarden или LastPass выберите экспорт в настройках.',
        'Откройте «Управление данными» в Aegis Vault, импортируйте файл в один клик и обязательно удалите временный незашифрованный CSV.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Локальные (Local-First) против облачных менеджеров паролей',
      summary: 'Сравнение удобства облака с нулевой поверхностью атаки на сервере, атомарными бэкапами и полным контролем.',
      readTime: '4 мин чтения',
      paragraphs: [
        'Облачные менеджеры удобны для синхронизации, но создают централизованную цель и зависят от правил доступа, доступности серверов и подписок.',
        'Локальное хранилище держит зашифрованный файл .aegis строго на вашем компьютере — сторонние серверы не могут быть взломаны или очищены.',
        'Атомарная запись (.tmp + .bak) и автоматические копии каждые 14 дней в Documents/Aegis-Backups гарантируют сохранность, а при желании файл легко синхронизировать через Syncthing.',
      ],
    },
  ],
  zh: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'AES-256-GCM 与 600,000 次 PBKDF2 如何保护您的密码库',
      summary: '简明解析 Aegis Vault 的密钥派生、随机 IV 与认证加密机制。',
      readTime: '4 分钟阅读',
      paragraphs: [
        'Aegis Vault 使用 600,000 次迭代的 PBKDF2-HMAC-SHA256 从主密码派生 256 位 AES 密钥，大幅拖慢离线暴力破解。',
        '密码库中的每条记录（站点名、用户名、密码、卡片与笔记）均使用全新的 96 位随机 IV 进行 AES-256-GCM 加密。',
        'GCM 具备完整性校验能力，任何篡改都会被立即发现，内置密钥校验也会在解锁时立刻拒绝错误的主密码。',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: '如何将 Chrome、Bitwarden 或 LastPass 密码迁移到离线密码库',
      summary: '从浏览器导出密码并安全导入本地 .aegis 加密文件的分步指南。',
      readTime: '3 分钟阅读',
      paragraphs: [
        '将密码保存在浏览器中虽方便，但浏览器配置文件常成为窃密木马的目标。迁移到本地加密库可显著降低风险。',
        '在 Chrome 中打开 chrome://password-manager/settings 导出 CSV；在 Bitwarden 或 LastPass 的设置中选择导出。',
        '打开 Aegis Vault 的数据管理页面一键导入文件。导入完成后请彻底删除临时的明文 CSV 文件。',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: '本地优先 vs 云端密码管理器',
      summary: '对比云端便利性与零服务器暴露风险、原子备份和自主同步。',
      readTime: '4 分钟阅读',
      paragraphs: [
        '云端密码管理器多端同步方便，但会形成集中攻击目标，并伴随权限配置失误、服务中断或订阅绑定等风险。',
        '本地优先方案将加密的 .aegis 文件完全留在您的设备上，没有可被外部探测或清空的云端数据库。',
        '结合原子写入（.tmp + .bak）与 Documents/Aegis-Backups 中每 14 天一次的加密备份，兼顾可靠性与完全掌控权。',
      ],
    },
  ],
  hi: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'AES-256-GCM और 600,000-राउंड PBKDF2 आपके वॉल्ट को कैसे सुरक्षित रखते हैं',
      summary: 'Aegis Vault में की डेरिवेशन, रैंडम IV और प्रमाणित एन्क्रिप्शन की सरल व्याख्या।',
      readTime: '4 मिनट पढ़ें',
      paragraphs: [
        'Aegis Vault आपके मास्टर पासवर्ड से 600,000 इटरेशन वाले PBKDF2-HMAC-SHA256 द्वारा 256-बिट AES कुंजी बनाता है।',
        'साइट नाम, यूज़रनेम, पासवर्ड, कार्ड और नोट्स सहित हर प्रविष्टि नए 96-बिट रैंडम IV के साथ AES-256-GCM से एन्क्रिप्ट होती है।',
        'GCM छेड़छाड़ को तुरंत पहचान लेता है और गलत मास्टर पासवर्ड को अनलॉक करते समय ही रोक देता है।',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Chrome, Bitwarden या LastPass से ऑफ़लाइन वॉल्ट में पासवर्ड कैसे लाएँ',
      summary: 'ब्राउज़र पासवर्ड एक्सपोर्ट करके स्थानीय .aegis वॉल्ट में सुरक्षित रखने की चरणबद्ध गाइड।',
      readTime: '3 मिनट पढ़ें',
      paragraphs: [
        'ब्राउज़र में पासवर्ड रखना आसान है, लेकिन मालवेयर अक्सर ब्राउज़र प्रोफ़ाइल को निशाना बनाते हैं। स्थानीय एन्क्रिप्टेड वॉल्ट ज़्यादा सुरक्षित है।',
        'Chrome में chrome://password-manager/settings से CSV एक्सपोर्ट करें, या Bitwarden/LastPass की सेटिंग्स से वॉल्ट एक्सपोर्ट करें।',
        'Aegis Vault में डेटा प्रबंधन से फ़ाइल इम्पोर्ट करें और इम्पोर्ट के बाद अस्थायी CSV फ़ाइल को स्थायी रूप से हटा दें।',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'लोकल-फ़र्स्ट बनाम क्लाउड पासवर्ड मैनेजर',
      summary: 'क्लाउड सुविधा बनाम शून्य सर्वर जोखिम, ऑटोमैटिक बैकअप और पूर्ण नियंत्रण।',
      readTime: '4 मिनट पढ़ें',
      paragraphs: [
        'क्लाउड पासवर्ड मैनेजर सिंक आसान बनाते हैं, लेकिन केंद्रीकृत लक्ष्य और सब्सक्रिप्शन निर्भरता पैदा करते हैं।',
        'लोकल-फ़र्स्ट वॉल्ट आपकी एन्क्रिप्टेड .aegis फ़ाइल को केवल आपके कंप्यूटर पर रखता है।',
        'एटॉमिक सेव (.tmp + .bak) और Documents/Aegis-Backups में हर 14 दिन के ऑटो बैकअप से डेटा सुरक्षित रहता है।',
      ],
    },
  ],
  ko: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'AES-256-GCM과 600,000회 PBKDF2가 금고를 보호하는 원리',
      summary: 'Aegis Vault의 키 유도, 무작위 IV, 인증 암호화 구조에 대한 알기 쉬운 설명.',
      readTime: '4분 읽기',
      paragraphs: [
        'Aegis Vault는 600,000회 반복되는 PBKDF2-HMAC-SHA256으로 마스터 비밀번호에서 256비트 AES 키를 유도해 오프라인 무차별 대입 공격을 크게 늦춥니다.',
        '사이트명, 아이디, 비밀번호, 카드, 메모 등 모든 항목은 매번 새로 생성되는 96비트 무작위 IV와 함께 AES-256-GCM으로 암호화됩니다.',
        'GCM 인증 암호화는 파일 변조를 즉시 감지하며, 내장 키 검증을 통해 잘못된 마스터 비밀번호를 잠금 해제 단계에서 바로 차단합니다.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Chrome, Bitwarden, LastPass 비밀번호를 오프라인 금고로 옮기는 방법',
      summary: '브라우저에 저장된 비밀번호를 내보내 로컬 .aegis 금고에 안전하게 보관하는 단계별 안내.',
      readTime: '3분 읽기',
      paragraphs: [
        '브라우저 저장 기능은 편리하지만 정보 탈취 악성코드의 주요 표적이 됩니다. 마스터 비밀번호로 잠긴 로컬 금고로 옮기면 위험을 크게 줄일 수 있습니다.',
        'Chrome에서는 chrome://password-manager/settings에서 CSV로 내보내고, Bitwarden/LastPass에서는 설정의 내보내기 메뉴를 사용하세요.',
        'Aegis Vault의 데이터 관리에서 파일을 한 번에 가져온 뒤, 임시 평문 CSV 파일은 반드시 영구 삭제하세요.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: '로컬 우선(Local-First) vs 클라우드 비밀번호 관리자',
      summary: '클라우드 편의성과 서버 노출 제로, 원자적 백업, 사용자 주도 동기화의 비교.',
      readTime: '4분 읽기',
      paragraphs: [
        '클라우드 관리자는 동기화가 쉽지만 중앙 공격 표적이 되며 권한 설정 오류, 장애, 구독 종속 위험이 따릅니다.',
        '로컬 우선 금고는 암호화된 .aegis 파일을 오직 내 컴퓨터에만 보관해 외부 서버 침해 위험을 없앱니다.',
        '원자적 저장(.tmp + .bak)과 14일마다 생성되는 Documents/Aegis-Backups 백업으로 안전성을 확보하며 원할 때 Syncthing 등으로 직접 동기화할 수 있습니다.',
      ],
    },
  ],
  ja: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'AES-256-GCMと60万回PBKDF2が金庫を守る仕組み',
      summary: 'Aegis Vaultの鍵導出、ランダムIV、認証付き暗号化をわかりやすく解説。',
      readTime: '4分で読了',
      paragraphs: [
        'Aegis Vaultは60万回のPBKDF2-HMAC-SHA256でマスターパスワードから256ビットAES鍵を導出し、オフライン総当たり攻撃を大幅に遅延させます。',
        'サイト名・ユーザー名・パスワード・カード・メモを含む全エントリは、毎回生成される96ビットのランダムIVを用いてAES-256-GCMで暗号化されます。',
        'GCMは改ざん検知機能を備えており、内蔵の鍵チェックにより誤ったマスターパスワードは解錠時に即座に拒否されます。',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Chrome・Bitwarden・LastPassからオフライン金庫へ移行する方法',
      summary: 'ブラウザ保存のパスワードをエクスポートし、ローカルの.aegis金庫に保護する手順。',
      readTime: '3分で読了',
      paragraphs: [
        'ブラウザ保存は手軽ですが情報窃取マルウェアの標的になりやすいため、ローカル暗号化金庫への移行が安全です。',
        'Chromeでは chrome://password-manager/settings からCSVを出力し、BitwardenやLastPassでは設定からエクスポートします。',
        'Aegis Vaultのデータ管理からワンクリックで取り込み、完了後は一時的な平文CSVファイルを完全に削除してください。',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'ローカルファースト vs クラウド型パスワード管理',
      summary: 'クラウドの利便性と、サーバー露出ゼロ・アトミック保存・自己管理同期の比較。',
      readTime: '4分で読了',
      paragraphs: [
        'クラウド型は同期が簡単ですが、集中攻撃の標的になりやすく設定ミス・障害・サブスク依存のリスクがあります。',
        'ローカルファースト型では暗号化された.aegisファイルが自分のPC内にのみ留まり、外部からアクセスされることはありません。',
        'アトミック保存（.tmp + .bak）と14日ごとの自動暗号化バックアップで堅牢性を確保し、必要ならSyncthing等で自由に同期できます。',
      ],
    },
  ],
  ar: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'كيف يحمي AES-256-GCM و 600,000 جولة PBKDF2 خزنتك',
      summary: 'شرح واضح لاشتقاق المفاتيح ومتجهات IV العشوائية والتشفير الموثق في Aegis Vault.',
      readTime: '4 دقائق قراءة',
      paragraphs: [
        'يشتق Aegis Vault مفتاح AES بطول 256 بت من كلمة المرور الرئيسية عبر PBKDF2-HMAC-SHA256 بـ 600,000 جولة لإبطاء هجمات التخمين.',
        'يتم تشفير كل سجل — بما يشمل اسم الموقع واسم المستخدم وكلمة المرور والبطاقات والملاحظات — باستخدام AES-256-GCM مع IV عشوائي جديد.',
        'يكتشف وضع GCM أي عبث أو تلف فورًا، ويرفض فحص المفتاح المدمج كلمة المرور الرئيسية الخاطئة عند الفتح.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'كيفية نقل كلمات المرور من Chrome أو Bitwarden أو LastPass إلى خزنة محلية',
      summary: 'دليل خطوة بخطوة لتصدير كلمات المرور من المتصفح وتأمينها داخل ملف .aegis المحلي.',
      readTime: '3 دقائق قراءة',
      paragraphs: [
        'حفظ كلمات المرور في المتصفح مريح لكنه هدف شائع للبرمجيات الخبيثة. نقلها إلى خزنة محلية مشفرة يقلل المخاطر.',
        'في Chrome افتح chrome://password-manager/settings وصدّر ملف CSV. في Bitwarden أو LastPass اختر التصدير من الإعدادات.',
        'افتح إدارة البيانات في Aegis Vault واستورد الملف بنقرة واحدة، ثم احذف ملف CSV المؤقت نهائيًا.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'مديرو كلمات المرور المحليون مقابل السحابيين',
      summary: 'مقارنة بين سهولة السحابة والأمان بدون خوادم خارجية والنسخ الاحتياطي الذري.',
      readTime: '4 دقائق قراءة',
      paragraphs: [
        'تسهل الحلول السحابية المزامنة لكنها تخلق أهدافًا مركزية معرضة لأخطاء الإعداد أو الأعطال أو الاشتراكات.',
        'تبقي الخزنة المحلية ملف .aegis المشفر على جهازك فقط دون أي خادم بعيد يمكن اختراقه أو مسحه.',
        'مع الحفظ الذري (.tmp + .bak) والنسخ الاحتياطي المشفر كل 14 يومًا في Documents/Aegis-Backups، تبقى بياناتك آمنة وتحت سيطرتك.',
      ],
    },
  ],
};
