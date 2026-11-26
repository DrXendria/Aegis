import type { SecurityGuide } from './guides.data-a';

export const GUIDES_B: Record<string, SecurityGuide[]> = {
  fa: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'چگونه AES-256-GCM و ۶۰۰٬۰۰۰ دور PBKDF2 از گاوصندوق شما محافظت می‌کنند',
      summary: 'نگاهی روشن به استخراج کلید، بردارهای IV تصادفی و رمزنگاری احراز هویت‌شده در Aegis Vault.',
      readTime: '۴ دقیقه مطالعه',
      paragraphs: [
        'Aegis Vault با استفاده از PBKDF2-HMAC-SHA256 و ۶۰۰٬۰۰۰ تکرار یک کلید ۲۵۶ بیتی AES از رمز اصلی شما می‌سازد تا حملات حدس رمز را به‌شدت کند کند.',
        'هر رکورد شامل نام سایت، نام کاربری، رمز عبور، کارت‌ها و یادداشت‌ها با AES-256-GCM و یک IV تصادفی ۹۶ بیتی جدید رمزگذاری می‌شود.',
        'حالت GCM هرگونه دستکاری فایل را فوراً تشخیص می‌دهد و بررسی کلید داخلی رمز اصلی اشتباه را همان ابتدا رد می‌کند.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'انتقال رمزها از Chrome، Bitwarden یا LastPass به گاوصندوق آفلاین',
      summary: 'راهنمای گام‌به‌گام خروجی گرفتن از مرورگر و قفل کردن رمزها در فایل محلی .aegis.',
      readTime: '۳ دقیقه مطالعه',
      paragraphs: [
        'ذخیره رمز در مرورگر راحت است اما پروفایل مرورگر هدف رایج بدافزارهاست. انتقال به گاوصندوق محلی ریسک را بسیار کمتر می‌کند.',
        'در Chrome به chrome://password-manager/settings بروید و فایل CSV بگیرید؛ در Bitwarden یا LastPass از بخش تنظیمات خروجی بگیرید.',
        'در Aegis Vault به مدیریت داده بروید، فایل را با یک کلیک وارد کنید و سپس فایل CSV موقت را برای همیشه پاک کنید.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'مدیر رمز عبور محلی در برابر ابری',
      summary: 'مقایسه راحتی فضای ابری با امنیت بدون سرور خارجی و پشتیبان‌گیری اتمی.',
      readTime: '۴ دقیقه مطالعه',
      paragraphs: [
        'سرویس‌های ابری همگام‌سازی را آسان می‌کنند اما هدف متمرکز می‌سازند و ریسک خطای تنظیمات، قطعی یا اشتراک پولی دارند.',
        'گاوصندوق محلی فایل .aegis رمزگذاری‌شده را فقط روی رایانه شما نگه می‌دارد و هیچ سرور خارجی وجود ندارد.',
        'با ذخیره اتمی (.tmp + .bak) و پشتیبان رمزگذاری‌شده ۱۴ روزه در Documents/Aegis-Backups کنترل کامل در دست شماست.',
      ],
    },
  ],
  el: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Πώς το AES-256-GCM και 600.000 γύροι PBKDF2 προστατεύουν το θησαυροφυλάκιό σου',
      summary: 'Καθαρή εξήγηση για την παραγωγή κλειδιού, τα τυχαία IV και την πιστοποιημένη κρυπτογράφηση στο Aegis Vault.',
      readTime: '4 λεπτά ανάγνωσης',
      paragraphs: [
        'Το Aegis Vault παράγει ένα κλειδί AES 256-bit από τον Κύριο Κωδικό σου με PBKDF2-HMAC-SHA256 και 600.000 επαναλήψεις.',
        'Κάθε εγγραφή — τίτλος, χρήστης, κωδικός, κάρτες και σημειώσεις — κρυπτογραφείται με AES-256-GCM και νέο τυχαίο IV 96-bit.',
        'Το GCM ανιχνεύει αμέσως κάθε αλλοίωση και ο ενσωματωμένος έλεγχος κλειδιού απορρίπτει άμεσα λάθος Κύριο Κωδικό.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Πώς να μεταφέρεις κωδικούς από Chrome, Bitwarden ή LastPass σε offline θησαυροφυλάκιο',
      summary: 'Οδηγός βήμα προς βήμα για εξαγωγή από τον browser και ασφαλή εισαγωγή στο τοπικό αρχείο .aegis.',
      readTime: '3 λεπτά ανάγνωσης',
      paragraphs: [
        'Η αποθήκευση κωδικών στον browser είναι βολική, αλλά τα προφίλ browser στοχοποιούνται συχνά. Ένα τοπικό κρυπτογραφημένο θησαυροφυλάκιο μειώνει τον κίνδυνο.',
        'Στο Chrome άνοιξε chrome://password-manager/settings και κάνε εξαγωγή CSV. Στα Bitwarden/LastPass χρησιμοποίησε την εξαγωγή από τις ρυθμίσεις.',
        'Άνοιξε τη Διαχείριση Δεδομένων στο Aegis Vault, εισήγαγε το αρχείο με ένα κλικ και διέγραψε οριστικά το προσωρινό CSV.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Τοπικοί (Local-First) έναντι cloud διαχειριστών κωδικών',
      summary: 'Σύγκριση της ευκολίας του cloud με μηδενική έκθεση διακομιστών και ατομικά αντίγραφα ασφαλείας.',
      readTime: '4 λεπτά ανάγνωσης',
      paragraphs: [
        'Οι cloud λύσεις προσφέρουν εύκολο συγχρονισμό αλλά δημιουργούν κεντρικούς στόχους και κινδύνους ρυθμίσεων ή συνδρομών.',
        'Ένα τοπικό θησαυροφυλάκιο κρατά το κρυπτογραφημένο αρχείο .aegis μόνο στον υπολογιστή σου.',
        'Με ατομικές εγγραφές (.tmp + .bak) και κρυπτογραφημένα αντίγραφα κάθε 14 ημέρες στο Documents/Aegis-Backups έχεις πλήρη έλεγχο.',
      ],
    },
  ],
  he: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'איך AES-256-GCM ו-600,000 סבבי PBKDF2 מגנים על הכספת שלך',
      summary: 'סקירה ברורה של גזירת מפתח, IV אקראיים והצפנה מאומתת ב-Aegis Vault.',
      readTime: '4 דקות קריאה',
      paragraphs: [
        'Aegis Vault גוזר מפתח AES של 256 ביט מסיסמת המאסטר שלך באמצעות PBKDF2-HMAC-SHA256 עם 600,000 איטרציות.',
        'כל רשומה — שם אתר, משתמש, סיסמה, כרטיסים והערות — מוצפנת ב-AES-256-GCM עם IV אקראי חדש של 96 ביט.',
        'הצפנת GCM מזהה כל שינוי או פגיעה בקובץ באופן מיידי, ובדיקת מפתח מובנית דוחה סיסמת מאסטר שגויה מיד בפתיחה.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'איך להעביר סיסמאות מ-Chrome, Bitwarden או LastPass לכספת אופליין',
      summary: 'מדריך שלב אחר שלב לייצוא סיסמאות מהדפדפן ושמירתן בקובץ .aegis מוצפן מקומית.',
      readTime: '3 דקות קריאה',
      paragraphs: [
        'שמירת סיסמאות בדפדפן נוחה, אך פרופילי דפדפן הם יעד נפוץ לנוזקות. כספת מקומית מוצפנת מצמצמת משמעותית את הסיכון.',
        'ב-Chrome פתח chrome://password-manager/settings וייצא לקובץ CSV. ב-Bitwarden או LastPass בחר ייצוא מההגדרות.',
        'פתח את ניהול הנתונים ב-Aegis Vault, ייבא את הקובץ בלחיצה אחת ומחק לצמיתות את קובץ ה-CSV הזמני.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'מנהלי סיסמאות מקומיים מול ענן',
      summary: 'השוואה בין נוחות הענן לאבטחה ללא שרתים חיצוניים וגיבויים אטומיים.',
      readTime: '4 דקות קריאה',
      paragraphs: [
        'מנהלי ענן מציעים סנכרון קל אך יוצרים מטרה מרכזית וחשופים לשגיאות הרשאות, תקלות או מנויים.',
        'כספת מקומית שומרת את קובץ ה-.aegis המוצפן רק במחשב שלך ללא שום שרת מרוחק.',
        'עם שמירה אטומית (.tmp + .bak) וגיבויים מוצפנים כל 14 יום ב-Documents/Aegis-Backups, השליטה המלאה נשארת אצלך.',
      ],
    },
  ],
  da: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Sådan beskytter AES-256-GCM og 600.000 PBKDF2-runder din boks',
      summary: 'Et klart indblik i nøgleafledning, tilfældige IV’er og autentificeret kryptering i Aegis Vault.',
      readTime: '4 min. læsning',
      paragraphs: [
        'Aegis Vault afleder en 256-bit AES-nøgle fra din hovedadgangskode med PBKDF2-HMAC-SHA256 og 600.000 iterationer.',
        'Hver post — titel, brugernavn, kode, kort og noter — krypteres med AES-256-GCM og en ny 96-bit tilfældig IV.',
        'GCM opdager straks enhver manipulation, og indbygget nøglekontrol afviser en forkert hovedadgangskode med det samme.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Sådan flytter du adgangskoder fra Chrome, Bitwarden eller LastPass til en offline-boks',
      summary: 'Trin-for-trin-guide til at eksportere browserkoder og sikre dem i din lokale .aegis-fil.',
      readTime: '3 min. læsning',
      paragraphs: [
        'Browsergemte koder er bekvemme, men browserprofiler rammes ofte af malware. En lokal krypteret boks mindsker risikoen.',
        'I Chrome åbner du chrome://password-manager/settings og eksporterer CSV. I Bitwarden eller LastPass eksporterer du fra indstillinger.',
        'Åbn Datastyring i Aegis Vault, importer filen med ét klik, og slet derefter den midlertidige CSV-fil permanent.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Lokal-først vs. skybaserede adgangskodeadministratorer',
      summary: 'Sammenligning af skybekvemmelighed mod nul servereksponering og atomiske sikkerhedskopier.',
      readTime: '4 min. læsning',
      paragraphs: [
        'Skybaserede løsninger gør synkronisering let, men skaber centrale mål og risiko for fejlkonfiguration eller abonnementer.',
        'En lokal boks holder din krypterede .aegis-fil udelukkende på din computer uden eksterne servere.',
        'Med atomisk lagring (.tmp + .bak) og automatiske 14-dages kopier i Documents/Aegis-Backups har du fuld kontrol.',
      ],
    },
  ],
  no: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Slik beskytter AES-256-GCM og 600 000 PBKDF2-runder hvelvet ditt',
      summary: 'En tydelig gjennomgang av nøkkelutledning, tilfeldige IV-er og autentisert kryptering i Aegis Vault.',
      readTime: '4 min lesetid',
      paragraphs: [
        'Aegis Vault utleder en 256-bits AES-nøkkel fra hovedpassordet ditt med PBKDF2-HMAC-SHA256 og 600 000 iterasjoner, noe som bremser offline brute-force-angrep kraftig.',
        'Hver oppføring — nettstedsnavn, brukernavn, passord, kort og notater — krypteres med AES-256-GCM og en fersk 96-bits tilfeldig IV.',
        'Fordi GCM er autentisert kryptering, oppdages enhver endring umiddelbart, og innebygd nøkkelsjekk avviser feil hovedpassord direkte ved opplåsing.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Slik flytter du passord fra Chrome, Bitwarden eller LastPass til et lokalt hvelv',
      summary: 'Steg-for-steg-guide for å eksportere nettleserpassord og låse dem i din lokale .aegis-fil.',
      readTime: '3 min lesetid',
      paragraphs: [
        'Passord lagret i nettleseren er praktisk, men nettleserprofiler er et vanlig mål for skadevare. Et kryptert lokalt hvelv reduserer risikoen betydelig.',
        'I Chrome åpner du chrome://password-manager/settings og eksporterer en CSV-fil. I Bitwarden eller LastPass eksporterer du fra innstillingene.',
        'Åpne Databehandling i Aegis Vault, importer filen med ett klikk, og slett den midlertidige CSV-filen permanent etterpå.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Lokalt (Local-First) vs. skybaserte passordbehandlere',
      summary: 'Sammenligning av skykomfort mot null servereksponering, atomisk lagring og egenkontroll.',
      readTime: '4 min lesetid',
      paragraphs: [
        'Skybaserte passordbehandlere gir enkel synkronisering, men skaper sentrale angrepsmål og risiko for feilkonfigurasjon, nedetid eller abonnementer.',
        'Et lokalt hvelv lagrer den krypterte .aegis-filen utelukkende på din egen maskin uten eksterne servere.',
        'Med atomisk skriving (.tmp + .bak) og automatisk 14-dagers kryptert backup i Documents/Aegis-Backups har du full kontroll og kan synkronisere selv via Syncthing eller Drive.',
      ],
    },
  ],
  sv: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Så skyddar AES-256-GCM och 600 000 PBKDF2-rundor ditt valv',
      summary: 'En tydlig genomgång av nyckelhärledning, slumpmässiga IV:er och autentiserad kryptering i Aegis Vault.',
      readTime: '4 min läsning',
      paragraphs: [
        'Aegis Vault härleder en 256-bitars AES-nyckel från ditt huvudlösenord med PBKDF2-HMAC-SHA256 och 600 000 iterationer.',
        'Varje post — sajt, användarnamn, lösenord, kort och anteckningar — krypteras med AES-256-GCM och en ny 96-bitars slumpmässig IV.',
        'GCM upptäcker manipulation omedelbart och inbyggd nyckelkontroll avvisar fel huvudlösenord direkt vid upplåsning.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Så flyttar du lösenord från Chrome, Bitwarden eller LastPass till ett offlinevalv',
      summary: 'Steg-för-steg-guide för att exportera webbläsarlösenord till din lokala .aegis-fil.',
      readTime: '3 min läsning',
      paragraphs: [
        'Webbläsarlösenord är bekväma men profiler är vanliga mål för skadlig kod. Ett lokalt krypterat valv minskar risken.',
        'I Chrome öppnar du chrome://password-manager/settings och exporterar CSV. I Bitwarden eller LastPass exporterar du i inställningarna.',
        'Öppna Datahantering i Aegis Vault, importera filen med ett klick och radera sedan den tillfälliga CSV-filen permanent.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Lokala (Local-First) vs molnbaserade lösenordshanterare',
      summary: 'Molnbekvämlighet jämfört med noll serverexponering, atomiska säkerhetskopior och full kontroll.',
      readTime: '4 min läsning',
      paragraphs: [
        'Molntjänster gör synk enkelt men skapar centrala mål och risker för felkonfiguration, driftstopp eller prenumerationer.',
        'Ett lokalt valv sparar din krypterade .aegis-fil enbart på din dator utan externa servrar.',
        'Med atomisk sparning (.tmp + .bak) och automatiska 14-dagarskopior i Documents/Aegis-Backups behåller du full kontroll.',
      ],
    },
  ],
  fi: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Näin AES-256-GCM ja 600 000 PBKDF2-kierrosta suojaavat holvisi',
      summary: 'Selkeä katsaus avaimen johtamiseen, satunnaisiin IV-arvoihin ja todennettuun salaukseen Aegis Vaultissa.',
      readTime: '4 min lukuaika',
      paragraphs: [
        'Aegis Vault johtaa pääsalasanastasi 256-bittisen AES-avaimen 600 000 kierroksen PBKDF2-HMAC-SHA256:lla.',
        'Jokainen merkintä — sivusto, tunnus, salasana, kortit ja muistiinpanot — salataan AES-256-GCM:llä ja uudella 96-bittisellä satunnaisella IV:llä.',
        'GCM havaitsee peukaloinnin heti ja sisäinen avaintarkistus hylkää väärän pääsalasanan välittömästi.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Salasanojen siirto Chromesta, Bitwardenista tai LastPassista offline-holviin',
      summary: 'Vaiheittainen ohje selainsalasanojen vientiin ja turvaamiseen paikalliseen .aegis-holviin.',
      readTime: '3 min lukuaika',
      paragraphs: [
        'Selaimeen tallennetut salasanat ovat helppoja, mutta selainprofiilit ovat yleinen haittaohjelmien kohde. Paikallinen salattu holvi pienentää riskiä.',
        'Vie CSV Chromessa osoitteessa chrome://password-manager/settings, tai käytä Bitwardenin/LastPassin vientiä asetuksista.',
        'Avaa Tietojen hallinta Aegis Vaultissa, tuo tiedosto yhdellä klikkauksella ja poista väliaikainen CSV pysyvästi.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Paikallinen (Local-First) vs. pilvipohjainen salasananhallinta',
      summary: 'Pilven helppous verrattuna nollaan palvelinriskiin, atomiseen tallennukseen ja omaan hallintaan.',
      readTime: '4 min lukuaika',
      paragraphs: [
        'Pilvipalvelut helpottavat synkronointia, mutta luovat keskitetyn kohteen ja riippuvuuden tilauksista sekä käyttökatkoista.',
        'Paikallinen holvi pitää salatun .aegis-tiedoston vain omalla koneellasi ilman ulkoisia palvelimia.',
        'Atomisella tallennuksella (.tmp + .bak) ja 14 päivän automaattisilla varmuuskopioilla Documents/Aegis-Backups-kansiossa tietosi pysyvät turvassa.',
      ],
    },
  ],
  nl: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Hoe AES-256-GCM en 600.000 PBKDF2-ronden jouw kluis beschermen',
      summary: 'Een heldere uitleg over sleutelafleiding, willekeurige IV’s en geauthenticeerde versleuteling in Aegis Vault.',
      readTime: '4 min leestijd',
      paragraphs: [
        'Aegis Vault leidt een 256-bits AES-sleutel af van je hoofdwachtwoord met PBKDF2-HMAC-SHA256 en 600.000 iteraties.',
        'Elk item — sitenaam, gebruikersnaam, wachtwoord, kaarten en notities — wordt versleuteld met AES-256-GCM en een nieuwe 96-bits willekeurige IV.',
        'GCM detecteert elke manipulatie direct en een ingebouwde sleutelcontrole weigert een fout hoofdwachtwoord meteen bij het ontgrendelen.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Wachtwoorden verhuizen van Chrome, Bitwarden of LastPass naar een offline kluis',
      summary: 'Stapsgewijze handleiding om browserwachtwoorden te exporteren naar je lokale .aegis-kluis.',
      readTime: '3 min leestijd',
      paragraphs: [
        'Wachtwoorden opslaan in de browser is handig, maar browserprofielen zijn een geliefd doelwit voor malware. Een lokale versleutelde kluis is veel veiliger.',
        'Exporteer in Chrome via chrome://password-manager/settings een CSV-bestand, of gebruik Export in Bitwarden/LastPass.',
        'Open Gegevensbeheer in Aegis Vault, importeer het bestand met één klik en verwijder daarna het tijdelijke CSV-bestand definitief.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Lokaal (Local-First) vs. cloud wachtwoordbeheerders',
      summary: 'Cloudgemak vergeleken met nul serverblootstelling, atomische back-ups en eigen controle.',
      readTime: '4 min leestijd',
      paragraphs: [
        'Cloudbeheerders maken synchronisatie eenvoudig, maar vormen centrale doelwitten en brengen risico’s van verkeerde rechten, storingen of abonnementen.',
        'Een lokale kluis bewaart je versleutelde .aegis-bestand uitsluitend op je eigen computer zonder externe servers.',
        'Met atomisch opslaan (.tmp + .bak) en automatische 14-daagse back-ups in Documents/Aegis-Backups blijf je volledig in controle.',
      ],
    },
  ],
  pl: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Jak AES-256-GCM i 600 000 rund PBKDF2 chronią Twój sejf',
      summary: 'Przejrzyste omówienie wyprowadzania klucza, losowych IV i szyfrowania uwierzytelnionego w Aegis Vault.',
      readTime: '4 min czytania',
      paragraphs: [
        'Aegis Vault wyprowadza 256-bitowy klucz AES z Hasła Głównego przy użyciu PBKDF2-HMAC-SHA256 z 600 000 iteracji.',
        'Każdy wpis — nazwa strony, login, hasło, karty i notatki — jest szyfrowany AES-256-GCM ze świeżym 96-bitowym losowym IV.',
        'Tryb GCM natychmiast wykrywa manipulacje, a wbudowana weryfikacja od razu odrzuca błędne Hasło Główne.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Jak przenieść hasła z Chrome, Bitwarden lub LastPass do sejfu offline',
      summary: 'Instrukcja krok po kroku eksportu haseł z przeglądarki do lokalnego pliku .aegis.',
      readTime: '3 min czytania',
      paragraphs: [
        'Zapisywanie haseł w przeglądarce jest wygodne, ale profile przeglądarek często padają łupem złośliwego oprogramowania. Lokalny sejf zmniejsza ryzyko.',
        'W Chrome otwórz chrome://password-manager/settings i wyeksportuj CSV. W Bitwarden lub LastPass użyj eksportu w ustawieniach.',
        'Otwórz Zarządzanie danymi w Aegis Vault, zaimportuj plik jednym kliknięciem i trwale usuń tymczasowy plik CSV.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Menedżery lokalne (Local-First) vs chmurowe',
      summary: 'Wygoda chmury w porównaniu z brakiem ekspozycji serwera, atomowymi kopiami i pełną kontrolą.',
      readTime: '4 min czytania',
      paragraphs: [
        'Menedżery w chmurze ułatwiają synchronizację, ale tworzą scentralizowane cele i niosą ryzyko błędnych uprawnień, awarii lub subskrypcji.',
        'Sejf lokalny przechowuje zaszyfrowany plik .aegis wyłącznie na Twoim komputerze bez zewnętrznych serwerów.',
        'Dzięki atomowemu zapisowi (.tmp + .bak) i automatycznym kopiom co 14 dni w Documents/Aegis-Backups masz pełne bezpieczeństwo i kontrolę.',
      ],
    },
  ],
  id: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Cara AES-256-GCM & 600.000 Putaran PBKDF2 Melindungi Brankas Anda',
      summary: 'Penjelasan ringkas tentang derivasi kunci, IV acak, dan enkripsi terautentikasi di Aegis Vault.',
      readTime: '4 mnt baca',
      paragraphs: [
        'Aegis Vault menurunkan kunci AES 256-bit dari Kata Sandi Utama menggunakan PBKDF2-HMAC-SHA256 sebanyak 600.000 iterasi.',
        'Setiap entri — nama situs, username, kata sandi, kartu, dan catatan — dienkripsi dengan AES-256-GCM dan IV acak 96-bit baru.',
        'Mode GCM mendeteksi kerusakan atau manipulasi secara instan dan langsung menolak Kata Sandi Utama yang salah saat dibuka.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Cara Memindahkan Sandi dari Chrome, Bitwarden, atau LastPass ke Brankas Offline',
      summary: 'Panduan langkah demi langkah mengekspor sandi browser ke file .aegis lokal terenkripsi.',
      readTime: '3 mnt baca',
      paragraphs: [
        'Menyimpan sandi di browser memang praktis, tetapi profil browser sering menjadi target malware. Brankas lokal terenkripsi jauh lebih aman.',
        'Di Chrome buka chrome://password-manager/settings lalu ekspor CSV. Di Bitwarden atau LastPass pilih Ekspor dari Pengaturan.',
        'Buka Manajemen Data di Aegis Vault, impor file dengan satu klik, lalu hapus permanen file CSV sementara.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Pengelola Sandi Lokal (Local-First) vs Cloud',
      summary: 'Membandingkan kemudahan cloud dengan keamanan tanpa server eksternal dan cadangan atomik.',
      readTime: '4 mnt baca',
      paragraphs: [
        'Layanan cloud memudahkan sinkronisasi, tetapi menciptakan target terpusat dan risiko salah konfigurasi, gangguan, atau langganan.',
        'Brankas lokal menyimpan file .aegis terenkripsi hanya di komputer Anda tanpa server jarak jauh.',
        'Dengan penyimpanan atomik (.tmp + .bak) dan cadangan otomatis tiap 14 hari di Documents/Aegis-Backups, kendali penuh tetap di tangan Anda.',
      ],
    },
  ],
  uk: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Як AES-256-GCM і 600 000 раундів PBKDF2 захищають ваше сховище',
      summary: 'Зрозумілий огляд формування ключа, випадкових IV та автентифікованого шифрування в Aegis Vault.',
      readTime: '4 хв читання',
      paragraphs: [
        'Aegis Vault формує 256-бітний ключ AES із вашого майстер-пароля через PBKDF2-HMAC-SHA256 (600 000 ітерацій).',
        'Кожен запис — назва сайту, логін, пароль, картки та нотатки — шифрується алгоритмом AES-256-GCM із новим 96-бітним випадковим IV.',
        'Режим GCM миттєво виявляє підміну або пошкодження файлу, а перевірка ключа одразу відхиляє хибний майстер-пароль.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Як перенести паролі з Chrome, Bitwarden або LastPass в офлайн-сховище',
      summary: 'Покрокова інструкція з експорту паролів браузера в локальний зашифрований файл .aegis.',
      readTime: '3 хв читання',
      paragraphs: [
        'Зберігати паролі в браузері зручно, але профілі браузерів часто атакують шкідливі програми. Локальне сховище зменшує ризики.',
        'У Chrome відкрийте chrome://password-manager/settings і експортуйте CSV. У Bitwarden або LastPass виберіть експорт у налаштуваннях.',
        'Відкрийте «Керування даними» в Aegis Vault, імпортуйте файл в один клік і назавжди видаліть тимчасовий CSV.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Локальні (Local-First) проти хмарних менеджерів паролів',
      summary: 'Порівняння зручності хмари з відсутністю віддалених серверів, атомарними копіями та повним контролем.',
      readTime: '4 хв читання',
      paragraphs: [
        'Хмарні менеджери спрощують синхронізацію, але створюють централізовану ціль і ризики збоїв, помилок доступу чи підписок.',
        'Локальне сховище тримає зашифрований файл .aegis виключно на вашому комп’ютері без сторонніх серверів.',
        'З атомарним записом (.tmp + .bak) і автокопіями кожні 14 днів у Documents/Aegis-Backups ваші дані під вашим повним контролем.',
      ],
    },
  ],
  fil: [
    {
      slug: 'zero-knowledge-encryption',
      title: 'Paano Pinoprotektahan ng AES-256-GCM at 600,000-Round PBKDF2 ang Vault Mo',
      summary: 'Malinaw na paliwanag sa key derivation, random IVs, at authenticated encryption sa Aegis Vault.',
      readTime: '4 min basahin',
      paragraphs: [
        'Gumagawa ang Aegis Vault ng 256-bit AES key mula sa iyong Master Password gamit ang PBKDF2-HMAC-SHA256 na may 600,000 iterations.',
        'Bawat entry—kasama ang pangalan ng site, username, password, card, at tala—ay naka-encrypt gamit ang AES-256-GCM at bagong 96-bit random IV.',
        'Agad na natutukoy ng GCM ang anumang pagkasira ng file at agad na tinatanggihan ang maling Master Password sa pag-unlock.',
      ],
    },
    {
      slug: 'migrate-from-chrome',
      title: 'Paano Ilipat ang mga Password mula Chrome, Bitwarden, o LastPass sa Offline Vault',
      summary: 'Hakbang-hakbang na gabay sa pag-export ng browser password papunta sa lokal na .aegis vault.',
      readTime: '3 min basahin',
      paragraphs: [
        'Maginhawa ang browser password storage ngunit madalas itong puntirya ng malware. Mas ligtas ang lokal na naka-encrypt na vault.',
        'Sa Chrome, buksan ang chrome://password-manager/settings at mag-export ng CSV. Sa Bitwarden o LastPass, gamitin ang Export sa Settings.',
        'Buksan ang Data Management sa Aegis Vault, i-import ang file sa isang click, at permanenteng burahin ang pansamantalang CSV file.',
      ],
    },
    {
      slug: 'local-first-vs-cloud',
      title: 'Local-First vs. Cloud Password Managers',
      summary: 'Paghahambing ng kaginhawaan ng cloud laban sa zero server exposure at awtomatikong lokal na backup.',
      readTime: '4 min basahin',
      paragraphs: [
        'Pinapadali ng cloud managers ang pag-sync ngunit nagdudulot ito ng panganib ng maling konfigurasyon, outage, o subscription.',
        'Pinapanatili ng local-first vault ang naka-encrypt mong .aegis file sa iyong computer lamang nang walang external server.',
        'Sa atomic saves (.tmp + .bak) at 14-araw na backup sa Documents/Aegis-Backups, nasa iyo ang buong kontrol.',
      ],
    },
  ],
};
