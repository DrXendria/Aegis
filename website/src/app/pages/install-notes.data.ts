export interface InstallNotesCopy {
  heading: string;
  macosTitle: string;
  macosBody: string;
  windowsTitle: string;
  windowsBody: string;
  linuxTitle: string;
  linuxBody: string;
}

const EN_INSTALL_NOTES: InstallNotesCopy = {
  heading: 'First-time installation notes',
  macosTitle: 'macOS',
  macosBody:
    'Because Aegis is not notarized with a paid Apple certificate yet, macOS may show an "unidentified developer" warning. Right-click Aegis in Applications and choose Open, or run: xattr -cr /Applications/Aegis.app',
  windowsTitle: 'Windows',
  windowsBody:
    'If Windows SmartScreen appears on first launch, click "More info" and then "Run anyway".',
  linuxTitle: 'Linux',
  linuxBody:
    'For AppImage, make it executable first (chmod +x Aegis_*.AppImage). On Fedora or Debian/Ubuntu, install the .rpm or .deb package directly.',
};

export const INSTALL_NOTES_BY_LANG: Record<string, InstallNotesCopy> = {
  en: EN_INSTALL_NOTES,
  tr: {
    heading: 'İlk kurulum notları',
    macosTitle: 'macOS',
    macosBody:
      'Aegis henüz ücretli Apple sertifikasıyla imzalanmadığı için ilk açılışta "tanınmayan geliştirici" uyarısı çıkabilir. Uygulamalar klasöründe Aegis\'e sağ tıklayıp Aç de veya terminalde çalıştır: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'İlk açılışta Windows SmartScreen uyarısı çıkarsa "Ek bilgi" ve ardından "Yine de çalıştır" seçeneğine tıkla.',
    linuxTitle: 'Linux',
    linuxBody:
      'AppImage için dosyayı çalıştırılabilir yap (chmod +x Aegis_*.AppImage). Fedora veya Debian/Ubuntu\'da .rpm / .deb paketini doğrudan kurabilirsin.',
  },
  de: {
    heading: 'Hinweise zur Erstinstallation',
    macosTitle: 'macOS',
    macosBody:
      'Da Aegis noch nicht mit einem kostenpflichtigen Apple-Zertifikat signiert ist, kann eine Warnung erscheinen. Rechtsklicke auf Aegis und wähle „Öffnen“ oder führe aus: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Falls Windows SmartScreen erscheint, klicke auf „Weitere Informationen“ und dann auf „Trotzdem ausführen“.',
    linuxTitle: 'Linux',
    linuxBody:
      'Mache das AppImage zuerst ausführbar (chmod +x Aegis_*.AppImage) oder installiere direkt das .deb- bzw. .rpm-Paket.',
  },
  es: {
    heading: 'Notas de primera instalación',
    macosTitle: 'macOS',
    macosBody:
      'Como Aegis aún no está firmado con un certificado pago de Apple, macOS puede mostrar una advertencia. Haz clic derecho en Aegis y elige Abrir, o ejecuta: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Si aparece Windows SmartScreen al iniciar, haz clic en «Más información» y luego en «Ejecutar de todas formas».',
    linuxTitle: 'Linux',
    linuxBody:
      'Para AppImage, dale permisos de ejecución (chmod +x Aegis_*.AppImage) o instala directamente el paquete .deb o .rpm.',
  },
  fr: {
    heading: 'Notes de première installation',
    macosTitle: 'macOS',
    macosBody:
      'Aegis n’étant pas encore signé avec un certificat Apple payant, macOS peut afficher un avertissement. Faites un clic droit sur Aegis puis « Ouvrir », ou lancez : xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Si Windows SmartScreen s’affiche, cliquez sur « Informations complémentaires » puis « Exécuter quand même ».',
    linuxTitle: 'Linux',
    linuxBody:
      'Pour l’AppImage, rendez-le exécutable (chmod +x Aegis_*.AppImage) ou installez directement le paquet .deb ou .rpm.',
  },
  it: {
    heading: 'Note per la prima installazione',
    macosTitle: 'macOS',
    macosBody:
      'Poiché Aegis non è ancora firmato con un certificato Apple a pagamento, macOS potrebbe mostrare un avviso. Fai clic destro su Aegis e scegli Apri, oppure esegui: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Se appare Windows SmartScreen, fai clic su «Ulteriori informazioni» e poi su «Esegui comunque».',
    linuxTitle: 'Linux',
    linuxBody:
      'Per AppImage rendi il file eseguibile (chmod +x Aegis_*.AppImage) oppure installa direttamente il pacchetto .deb o .rpm.',
  },
  pt: {
    heading: 'Notas de primeira instalação',
    macosTitle: 'macOS',
    macosBody:
      'Como o Aegis ainda não é assinado com certificado pago da Apple, o macOS pode exibir um aviso. Clique com o botão direito no Aegis e escolha Abrir, ou execute: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Se o Windows SmartScreen aparecer, clique em "Mais informações" e depois em "Executar assim mesmo".',
    linuxTitle: 'Linux',
    linuxBody:
      'No AppImage, torne-o executável (chmod +x Aegis_*.AppImage) ou instale diretamente o pacote .deb ou .rpm.',
  },
  ru: {
    heading: 'Примечания к первой установке',
    macosTitle: 'macOS',
    macosBody:
      'Поскольку Aegis пока не подписан платным сертификатом Apple, macOS может показать предупреждение. Нажмите правой кнопкой на Aegis → Открыть или выполните: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Если появится окно Windows SmartScreen, нажмите «Подробнее», а затем «Выполнить в любом случае».',
    linuxTitle: 'Linux',
    linuxBody:
      'Для AppImage сделайте файл исполняемым (chmod +x Aegis_*.AppImage) или установите пакет .deb / .rpm.',
  },
  zh: {
    heading: '首次安装说明',
    macosTitle: 'macOS',
    macosBody:
      '由于 Aegis 尚未购买 Apple 开发者证书公证，macOS 可能会提示未知开发者。请右键点击 Aegis 选择“打开”，或在终端运行：xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      '如果首次运行出现 Windows SmartScreen 提示，请点击“更多信息”，然后点击“仍要运行”。',
    linuxTitle: 'Linux',
    linuxBody:
      '使用 AppImage 请先赋予执行权限（chmod +x Aegis_*.AppImage），或直接安装 .deb / .rpm 安装包。',
  },
  hi: {
    heading: 'पहली बार इंस्टॉलेशन नोट्स',
    macosTitle: 'macOS',
    macosBody:
      'क्योंकि Aegis अभी पेड Apple सर्टिफिकेट से साइन नहीं है, macOS चेतावनी दिखा सकता है। Aegis पर राइट-क्लिक करके Open चुनें या चलाएँ: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'यदि पहली बार चलाने पर Windows SmartScreen दिखे, तो "More info" और फिर "Run anyway" पर क्लिक करें।',
    linuxTitle: 'Linux',
    linuxBody:
      'AppImage को पहले निष्पादन योग्य बनाएँ (chmod +x Aegis_*.AppImage), या सीधे .deb / .rpm पैकेज इंस्टॉल करें।',
  },
  ko: {
    heading: '최초 설치 안내',
    macosTitle: 'macOS',
    macosBody:
      'Aegis는 아직 유료 Apple 인증서로 서명되지 않아 경고가 표시될 수 있습니다. Aegis를 우클릭해 열기를 선택하거나 터미널에서 실행하세요: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      '처음 실행 시 Windows SmartScreen이 표시되면 "추가 정보"를 누른 뒤 "실행"을 클릭하세요.',
    linuxTitle: 'Linux',
    linuxBody:
      'AppImage는 먼저 실행 권한을 부여하세요(chmod +x Aegis_*.AppImage). 또는 .deb / .rpm 패키지를 직접 설치할 수 있습니다.',
  },
  ja: {
    heading: '初回インストール時のご案内',
    macosTitle: 'macOS',
    macosBody:
      '有料の Apple 証明書で公証していないため、初回起動時に警告が出る場合があります。Aegis を右クリックして「開く」を選ぶか、次を実行してください: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      '初回起動時に Windows SmartScreen が表示された場合は、「詳細情報」をクリックし「実行」を選択してください。',
    linuxTitle: 'Linux',
    linuxBody:
      'AppImage は実行権限を付与してから起動してください（chmod +x Aegis_*.AppImage）。.deb / .rpm パッケージはそのままインストールできます。',
  },
  ar: {
    heading: 'ملاحظات التثبيت لأول مرة',
    macosTitle: 'macOS',
    macosBody:
      'لأن Aegis غير موقّع بشهادة Apple مدفوعة بعد، قد يظهر تحذير عند الفتح الأول. انقر بزر الفأرة الأيمن على Aegis واختر فتح، أو نفّذ: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'إذا ظهرت شاشة Windows SmartScreen عند التشغيل الأول، انقر على "مزيد من المعلومات" ثم "التشغيل على أي حال".',
    linuxTitle: 'Linux',
    linuxBody:
      'لملف AppImage امنحه صلاحية التنفيذ أولاً (chmod +x Aegis_*.AppImage)، أو ثبّت حزمة .deb أو .rpm مباشرة.',
  },
  fa: {
    heading: 'نکات نصب اولیه',
    macosTitle: 'macOS',
    macosBody:
      'از آنجا که Aegis هنوز با گواهی پولی اپل امضا نشده است، ممکن است هشدار نمایش داده شود. روی Aegis راست‌کلیک کرده و Open را بزنید یا اجرا کنید: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'اگر در اولین اجرا هشدار Windows SmartScreen ظاهر شد، روی «More info» و سپس «Run anyway» کلیک کنید.',
    linuxTitle: 'Linux',
    linuxBody:
      'برای AppImage ابتدا مجوز اجرا بدهید (chmod +x Aegis_*.AppImage) یا بسته .deb / .rpm را مستقیماً نصب کنید.',
  },
  el: {
    heading: 'Σημειώσεις πρώτης εγκατάστασης',
    macosTitle: 'macOS',
    macosBody:
      'Επειδή το Aegis δεν έχει υπογραφεί ακόμη με επί πληρωμή πιστοποιητικό Apple, κάντε δεξί κλικ στο Aegis και επιλέξτε Άνοιγμα ή εκτελέστε: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Αν εμφανιστεί το Windows SmartScreen, πατήστε «Περισσότερες πληροφορίες» και μετά «Εκτέλεση ούτως ή άλλως».',
    linuxTitle: 'Linux',
    linuxBody:
      'Για AppImage κάντε το αρχείο εκτελέσιμο (chmod +x Aegis_*.AppImage) ή εγκαταστήστε απευθείας το πακέτο .deb ή .rpm.',
  },
  he: {
    heading: 'הערות להתקנה ראשונה',
    macosTitle: 'macOS',
    macosBody:
      'מכיוון ש-Aegis עדיין אינו חתום בתעודת Apple בתשלום, לחץ לחיצה ימנית על Aegis ובחר פתח, או הרץ: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'אם מופיעה אזהרת Windows SmartScreen בהפעלה הראשונה, לחץ על "מידע נוסף" ואז על "הפעל בכל זאת".',
    linuxTitle: 'Linux',
    linuxBody:
      'עבור AppImage הפוך את הקובץ לבר-הרצה (chmod +x Aegis_*.AppImage), או התקן ישירות את חבילת ה-.deb או ה-.rpm.',
  },
  da: {
    heading: 'Noter til første installation',
    macosTitle: 'macOS',
    macosBody:
      'Da Aegis endnu ikke er signeret med et betalt Apple-certifikat, kan macOS vise en advarsel. Højreklik på Aegis og vælg Åbn, eller kør: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Hvis Windows SmartScreen vises første gang, klik på "Flere oplysninger" og derefter "Kør alligevel".',
    linuxTitle: 'Linux',
    linuxBody:
      'Gør AppImage eksekverbar først (chmod +x Aegis_*.AppImage), eller installer .deb- eller .rpm-pakken direkte.',
  },
  no: {
    heading: 'Merknader for førstegangsinstallasjon',
    macosTitle: 'macOS',
    macosBody:
      'Siden Aegis ikke er signert med et betalt Apple-sertifikat ennå, kan macOS vise en advarsel. Høyreklikk på Aegis og velg Åpne, eller kjør: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Hvis Windows SmartScreen vises ved første oppstart, klikk «Mer informasjon» og deretter «Kjør likevel».',
    linuxTitle: 'Linux',
    linuxBody:
      'Gjør AppImage kjørbar først (chmod +x Aegis_*.AppImage), eller installer .deb- eller .rpm-pakken direkte.',
  },
  sv: {
    heading: 'Anteckningar för första installationen',
    macosTitle: 'macOS',
    macosBody:
      'Eftersom Aegis ännu inte är signerat med ett betalt Apple-certifikat kan macOS visa en varning. Högerklicka på Aegis och välj Öppna, eller kör: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Om Windows SmartScreen visas vid första start, klicka på "Mer information" och sedan "Kör ändå".',
    linuxTitle: 'Linux',
    linuxBody:
      'Gör AppImage körbar först (chmod +x Aegis_*.AppImage), eller installera .deb- eller .rpm-paketet direkt.',
  },
  fi: {
    heading: 'Ensiasennuksen huomautukset',
    macosTitle: 'macOS',
    macosBody:
      'Koska Aegisia ei ole vielä allekirjoitettu maksullisella Apple-varmenteella, macOS voi näyttää varoituksen. Napsauta Aegisia hiiren kakkospainikkeella ja valitse Avaa tai suorita: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Jos Windows SmartScreen ilmestyy ensimmäisellä käynnistyksellä, valitse "Lisätietoja" ja sitten "Suorita joka tapauksessa".',
    linuxTitle: 'Linux',
    linuxBody:
      'Tee AppImage ensin suoritettavaksi (chmod +x Aegis_*.AppImage) tai asenna .deb- tai .rpm-paketti suoraan.',
  },
  nl: {
    heading: 'Opmerkingen bij eerste installatie',
    macosTitle: 'macOS',
    macosBody:
      'Omdat Aegis nog niet is ondertekend met een betaald Apple-certificaat, kan macOS een waarschuwing tonen. Klik met rechts op Aegis en kies Open, of voer uit: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Als Windows SmartScreen verschijnt, klik op "Meer informatie" en daarna op "Toch uitvoeren".',
    linuxTitle: 'Linux',
    linuxBody:
      'Maak de AppImage eerst uitvoerbaar (chmod +x Aegis_*.AppImage) of installeer het .deb- of .rpm-pakket direct.',
  },
  pl: {
    heading: 'Uwagi do pierwszej instalacji',
    macosTitle: 'macOS',
    macosBody:
      'Ponieważ Aegis nie jest jeszcze podpisany płatnym certyfikatem Apple, macOS może wyświetlić ostrzeżenie. Kliknij Aegis prawym przyciskiem i wybierz Otwórz lub uruchom: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Jeśli pojawi się okno Windows SmartScreen, kliknij „Więcej informacji”, a następnie „Uruchom mimo to”.',
    linuxTitle: 'Linux',
    linuxBody:
      'Dla pliku AppImage nadaj uprawnienia wykonywania (chmod +x Aegis_*.AppImage) lub zainstaluj pakiet .deb / .rpm.',
  },
  id: {
    heading: 'Catatan instalasi pertama kali',
    macosTitle: 'macOS',
    macosBody:
      'Karena Aegis belum ditandatangani dengan sertifikat Apple berbayar, macOS mungkin menampilkan peringatan. Klik kanan Aegis lalu pilih Buka, atau jalankan: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Jika Windows SmartScreen muncul saat pertama dibuka, klik "More info" lalu "Run anyway".',
    linuxTitle: 'Linux',
    linuxBody:
      'Untuk AppImage, ubah izinnya agar bisa dijalankan (chmod +x Aegis_*.AppImage), atau pasang paket .deb / .rpm langsung.',
  },
  uk: {
    heading: 'Примітки до першого встановлення',
    macosTitle: 'macOS',
    macosBody:
      'Оскільки Aegis ще не підписаний платним сертифікатом Apple, macOS може показати попередження. Клацніть правою кнопкою по Aegis → Відкрити або виконайте: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Якщо з’явиться вікно Windows SmartScreen, натисніть «Докладніше», а потім «Усе одно запустити».',
    linuxTitle: 'Linux',
    linuxBody:
      'Для AppImage надайте права виконання (chmod +x Aegis_*.AppImage) або встановіть пакет .deb чи .rpm.',
  },
  fil: {
    heading: 'Mga tala sa unang pag-install',
    macosTitle: 'macOS',
    macosBody:
      'Dahil hindi pa naka-sign ang Aegis sa bayad na Apple certificate, maaaring magpakita ng babala ang macOS. I-right-click ang Aegis at piliin ang Open, o patakbuhin: xattr -cr /Applications/Aegis.app',
    windowsTitle: 'Windows',
    windowsBody:
      'Kung lumabas ang Windows SmartScreen sa unang bukas, i-click ang "More info" at pagkatapos ay "Run anyway".',
    linuxTitle: 'Linux',
    linuxBody:
      'Para sa AppImage, gawing executable muna (chmod +x Aegis_*.AppImage), o direktang i-install ang .deb o .rpm package.',
  },
};

export function getInstallNotes(lang: string): InstallNotesCopy {
  return INSTALL_NOTES_BY_LANG[lang] ?? EN_INSTALL_NOTES;
}
