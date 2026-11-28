export interface FaqItem {
  q: string;
  a: string;
}

const EN_EXTRA_FAQS: FaqItem[] = [
  {
    q: 'Does the browser extension work when Aegis Desktop is closed?',
    a: 'Yes. Aegis Desktop never stays running in the background when you close it. The extension uses a local AES-256-GCM encrypted offline cache so Autofill and Auto-Save keep working for logins, cards, and subscriptions, then syncs newly saved items next time you open Aegis.',
  },
  {
    q: 'Can I change my email, Master Password, or delete my local vault?',
    a: 'Yes. In Profile → Account & Vault Security, you can update your local email, change your Layer-1 account password, re-encrypt your entire vault under a new Layer-2 Master Password, or permanently delete your local profile and .aegis file.',
  },
];

export const EXTRA_FAQS_BY_LANG: Record<string, FaqItem[]> = {
  en: EN_EXTRA_FAQS,
  tr: [
    {
      q: 'Tarayıcı eklentisi Aegis Masaüstü kapalıyken de çalışır mı?',
      a: 'Evet. Aegis Masaüstü kapatıldığında arkada hiçbir süreç çalışmaz. Eklenti kendi AES-256-GCM şifreli yerel önbelleği sayesinde şifre, kart ve abonelikler için Autofill ve Auto-Save yapmaya devam eder; masaüstünü tekrar açtığında yeni kayıtları otomatik eşitler.',
    },
    {
      q: 'E-postamı, Ana Şifremi değiştirebilir veya yerel kasamı silebilir miyim?',
      a: 'Evet. Profil → Hesap ve Kasa Güvenliği bölümünden e-postanı, 1. katman hesap şifreni veya 2. katman Ana Kasa Şifreni (tüm kayıtları atomik yeniden şifreleyerek) değiştirebilir ya da yerel profilini ve .aegis dosyanı kalıcı olarak silebilirsin.',
    },
  ],
  de: [
    {
      q: 'Funktioniert die Browser-Erweiterung auch, wenn Aegis Desktop geschlossen ist?',
      a: 'Ja. Aegis läuft nicht im Hintergrund weiter. Die Erweiterung nutzt einen AES-256-GCM-verschlüsselten Offline-Cache für Auto-Fill und Auto-Save und synchronisiert neue Einträge beim nächsten Start.',
    },
    {
      q: 'Kann ich meine E-Mail, mein Master-Passwort ändern oder meinen Tresor löschen?',
      a: 'Ja. Unter Profil kannst du deine lokale E-Mail, das Kontopasswort und das Master-Passwort (inkl. atomarer Neuverschlüsselung) ändern oder deinen lokalen Tresor dauerhaft löschen.',
    },
  ],
  es: [
    {
      q: '¿Funciona la extensión cuando Aegis Desktop está cerrado?',
      a: 'Sí. Aegis no queda ejecutándose en segundo plano. La extensión usa una caché local cifrada con AES-256-GCM para seguir autocompletando y guardando, y sincroniza los nuevos datos al abrir la app.',
    },
    {
      q: '¿Puedo cambiar mi correo, la Contraseña Maestra o eliminar mi bóveda?',
      a: 'Sí. Desde Perfil puedes actualizar tu correo local, cambiar la contraseña de cuenta, re-cifrar toda la bóveda con una nueva Contraseña Maestra o eliminar permanentemente tu perfil local.',
    },
  ],
  fr: [
    {
      q: 'L’extension fonctionne-t-elle lorsque Aegis Desktop est fermé ?',
      a: 'Oui. Aucun processus ne reste en arrière-plan. L’extension utilise un cache hors ligne chiffré AES-256-GCM pour continuer le remplissage et l’enregistrement, puis synchronise à la prochaine ouverture.',
    },
    {
      q: 'Puis-je changer mon e-mail, mon mot de passe maître ou supprimer mon coffre ?',
      a: 'Oui. Dans Profil, vous pouvez modifier votre e-mail local, votre mot de passe de compte, rechiffrer tout le coffre avec un nouveau mot de passe maître ou supprimer définitivement votre profil local.',
    },
  ],
  it: [
    {
      q: 'L’estensione funziona anche quando Aegis Desktop è chiuso?',
      a: 'Sì. Nessun processo resta in background. L’estensione usa una cache offline cifrata AES-256-GCM per continuare compilazione e salvataggio, sincronizzando i nuovi dati alla riapertura.',
    },
    {
      q: 'Posso cambiare email, Master Password o eliminare il mio vault locale?',
      a: 'Sì. Nella scheda Profilo puoi cambiare email, password dell’account, ricifrare il vault con una nuova Master Password o eliminare definitivamente il profilo locale.',
    },
  ],
  pt: [
    {
      q: 'A extensão funciona quando o Aegis Desktop está fechado?',
      a: 'Sim. Nada fica rodando em segundo plano. A extensão usa um cache offline criptografado com AES-256-GCM para continuar preenchendo e salvando, sincronizando tudo na próxima abertura.',
    },
    {
      q: 'Posso alterar meu e-mail, Senha Mestra ou excluir meu cofre local?',
      a: 'Sim. No Perfil você pode atualizar seu e-mail local, trocar a senha da conta, recriptografar todo o cofre com uma nova Senha Mestra ou excluir permanentemente o perfil local.',
    },
  ],
  ru: [
    {
      q: 'Работает ли расширение, когда Aegis Desktop закрыт?',
      a: 'Да. Приложение не остаётся в фоне. Расширение использует локальный кэш, зашифрованный AES-256-GCM, для автозаполнения и сохранения, а затем синхронизирует новые записи при запуске.',
    },
    {
      q: 'Можно ли сменить email, мастер-пароль или удалить локальное хранилище?',
      a: 'Да. В разделе «Профиль» можно изменить email, пароль аккаунта, перешифровать хранилище новым мастер-паролем или безвозвратно удалить локальный профиль и файл .aegis.',
    },
  ],
  zh: [
    {
      q: '关闭 Aegis 桌面端后浏览器扩展还能工作吗？',
      a: '可以。关闭桌面应用后不会驻留后台进程。扩展通过本地 AES-256-GCM 加密离线缓存继续支持自动填充与保存，并在下次打开桌面端时自动同步。',
    },
    {
      q: '我可以更改邮箱、主密码或永久删除本地保险库吗？',
      a: '可以。在“个人资料”中你可以更新本地邮箱、修改账户密码、使用新主密码原子化重新加密所有条目，或永久删除本地账户与 .aegis 文件。',
    },
  ],
  hi: [
    {
      q: 'क्या Aegis डेस्कटॉप बंद होने पर भी ब्राउज़र एक्सटेंशन काम करता है?',
      a: 'हाँ। ऐप बंद होने पर बैकग्राउंड में कुछ नहीं चलता। एक्सटेंशन AES-256-GCM एन्क्रिप्टेड ऑफ़लाइन कैश से ऑटोफ़िल और सेव जारी रखता है और ऐप खुलने पर सिंक कर देता है।',
    },
    {
      q: 'क्या मैं ईमेल, मास्टर पासवर्ड बदल सकता हूँ या अपना वॉल्ट हटा सकता हूँ?',
      a: 'हाँ। प्रोफ़ाइल सेक्शन में आप ईमेल, अकाउंट पासवर्ड या मास्टर पासवर्ड (पूरे वॉल्ट के री-एन्क्रिप्शन के साथ) बदल सकते हैं या लोकल वॉल्ट स्थायी रूप से हटा सकते हैं।',
    },
  ],
  ko: [
    {
      q: 'Aegis 데스크톱이 닫혀 있어도 브라우저 확장이 작동하나요?',
      a: '네. 백그라운드 프로세스 없이 AES-256-GCM 암호화 오프라인 캐시로 자동 완성 및 저장이 계속 작동하며, 앱을 다시 열면 자동으로 동기화됩니다.',
    },
    {
      q: '이메일, 마스터 비밀번호를 변경하거나 로컬 볼트를 삭제할 수 있나요?',
      a: '네. 프로필 탭에서 이메일, 계정 비밀번호, 마스터 비밀번호(전체 재암호화)를 변경하거나 로컬 프로필과 .aegis 파일을 영구 삭제할 수 있습니다.',
    },
  ],
  ja: [
    {
      q: 'Aegis デスクトップを閉じていても拡張機能は使えますか？',
      a: 'はい。バックグラウンド常駐なしで、AES-256-GCM 暗号化オフラインキャッシュにより自動入力・保存を継続し、次回起動時に自動同期します。',
    },
    {
      q: 'メールアドレスやマスターパスワードの変更、金庫の削除はできますか？',
      a: 'はい。プロフィール画面からメールアドレス・アカウントパスワード・マスターパスワードの変更（全件再暗号化）やローカル金庫の完全削除が可能です。',
    },
  ],
  ar: [
    {
      q: 'هل تعمل إضافة المتصفح عند إغلاق Aegis Desktop؟',
      a: 'نعم. لا يبقى التطبيق يعمل في الخلفية؛ تعتمد الإضافة على ذاكرة مؤقتة مشفرة بـ AES-256-GCM لمواصلة التعبئة والحفظ والمزامنة عند الفتح التالي.',
    },
    {
      q: 'هل يمكنني تغيير البريد الإلكتروني أو كلمة المرور الرئيسية أو حذف الخزنة؟',
      a: 'نعم. من الملف الشخصي يمكنك تحديث البريد الإلكتروني وكلمة مرور الحساب وإعادة تشفير الخزنة بكلمة مرور رئيسية جديدة أو حذف ملفك المحلي نهائياً.',
    },
  ],
  fa: [
    {
      q: 'آیا افزونه مرورگر هنگام بسته بودن Aegis Desktop هم کار می‌کند؟',
      a: 'بله. هیچ فرآیندی در پس‌زمینه باقی نمی‌ماند؛ افزونه با حافظه نهان رمزنگاری‌شده AES-256-GCM به کار ادامه می‌دهد و در باز شدن بعدی همگام‌سازی می‌کند.',
    },
    {
      q: 'آیا می‌توانم ایمیل، رمز اصلی را تغییر دهم یا خزانه محلی را حذف کنم؟',
      a: 'بله. در بخش پروفایل می‌توانید ایمیل، رمز حساب و رمز اصلی را تغییر دهید (با رمزنگاری مجدد همه رکوردها) یا حساب محلی را برای همیشه حذف کنید.',
    },
  ],
  el: [
    {
      q: 'Λειτουργεί η επέκταση όταν το Aegis Desktop είναι κλειστό;',
      a: 'Ναι. Δεν μένει καμία διεργασία στο παρασκήνιο· η κρυπτογραφημένη cache AES-256-GCM συνεχίζει τη συμπλήρωση και συγχρονίζει στο επόμενο άνοιγμα.',
    },
    {
      q: 'Μπορώ να αλλάξω email, κύριο κωδικό ή να διαγράψω το τοπικό θησαυροφυλάκιο;',
      a: 'Ναι. Από το Προφίλ μπορείτε να αλλάξετε email, κωδικό λογαριασμού, κύριο κωδικό (με επανακρυπτογράφηση) ή να διαγράψετε οριστικά το τοπικό προφίλ.',
    },
  ],
  he: [
    {
      q: 'האם תוסף הדפדפן עובד גם כש-Aegis Desktop סגור?',
      a: 'כן. אין תהליכי רקע. התוסף משתמש במטמון מקומי מוצפן ב-AES-256-GCM ומסנכרן פריטים חדשים בפתיחה הבאה.',
    },
    {
      q: 'האם אפשר לשנות אימייל, סיסמת מאסטר או למחוק את הכספת המקומית?',
      a: 'כן. במסך הפרופיל ניתן לעדכן אימייל, סיסמת חשבון, להצפין מחדש עם סיסמת מאסטר חדשה או למחוק לצמיתות את הפרופיל המקומי.',
    },
  ],
  da: [
    {
      q: 'Virker browserudvidelsen, når Aegis Desktop er lukket?',
      a: 'Ja. Intet kører i baggrunden. Udvidelsen bruger en AES-256-GCM-krypteret offline-cache og synkroniserer nye gemte poster, næste gang du åbner Aegis.',
    },
    {
      q: 'Kan jeg ændre e-mail, hovedadgangskode eller slette min lokale boks?',
      a: 'Ja. Under Profil kan du ændre e-mail, kontokode, genkryptere hele boksen med en ny hovedadgangskode eller slette din lokale profil permanent.',
    },
  ],
  no: [
    {
      q: 'Fungerer nettleserutvidelsen når Aegis Desktop er lukket?',
      a: 'Ja. Ingenting kjører i bakgrunnen. Utvidelsen bruker en AES-256-GCM-kryptert hurtigbuffer og synkroniserer nye oppføringer neste gang du åpner Aegis.',
    },
    {
      q: 'Kan jeg endre e-post, hovedpassord eller slette det lokale hvelvet?',
      a: 'Ja. Under Profil kan du oppdatere e-post, kontopassord, kryptere hvelvet på nytt med nytt hovedpassord eller slette den lokale profilen permanent.',
    },
  ],
  sv: [
    {
      q: 'Fungerar webbläsartillägget när Aegis Desktop är stängt?',
      a: 'Ja. Inget körs i bakgrunden. Tillägget använder en AES-256-GCM-krypterad offline-cache och synkar nya poster nästa gång du öppnar Aegis.',
    },
    {
      q: 'Kan jag ändra e-post, huvudlösenord eller radera mitt lokala valv?',
      a: 'Ja. Under Profil kan du ändra e-post, kontolösenord, kryptera om hela valvet med ett nytt huvudlösenord eller ta bort din lokala profil permanent.',
    },
  ],
  fi: [
    {
      q: 'Toimiiko selainlaajennus, kun Aegis Desktop on suljettu?',
      a: 'Kyllä. Mikään ei jää taustalle. Laajennus käyttää AES-256-GCM-salattua offline-välimuistia ja synkronoi uudet tiedot seuraavalla avauskerralla.',
    },
    {
      q: 'Voinko vaihtaa sähköpostin, pääsalasanan tai poistaa paikallisen holvin?',
      a: 'Kyllä. Profiili-välilehdellä voit päivittää sähköpostin, tilin salasanan, salata holvin uudelleen uudella pääsalasanalla tai poistaa paikallisen profiilin pysyvästi.',
    },
  ],
  nl: [
    {
      q: 'Werkt de browserextensie ook wanneer Aegis Desktop gesloten is?',
      a: 'Ja. Er draait niets op de achtergrond. De extensie gebruikt een AES-256-GCM versleutelde offline cache en synchroniseert nieuwe items zodra je Aegis weer opent.',
    },
    {
      q: 'Kan ik mijn e-mail, hoofdwachtwoord wijzigen of mijn kluis verwijderen?',
      a: 'Ja. Onder Profiel kun je je lokale e-mail, accountwachtwoord of hoofdwachtwoord (met herversleuteling) wijzigen of je lokale kluis permanent verwijderen.',
    },
  ],
  pl: [
    {
      q: 'Czy rozszerzenie działa, gdy Aegis Desktop jest zamknięty?',
      a: 'Tak. Nic nie działa w tle. Rozszerzenie korzysta z zaszyfrowanej pamięci podręcznej AES-256-GCM i synchronizuje nowe wpisy przy kolejnym otwarciu aplikacji.',
    },
    {
      q: 'Czy mogę zmienić e-mail, hasło główne lub usunąć lokalny sejf?',
      a: 'Tak. W zakładce Profil możesz zmienić e-mail, hasło konta, ponownie zaszyfrować sejf nowym hasłem głównym lub trwale usunąć lokalny profil.',
    },
  ],
  id: [
    {
      q: 'Apakah ekstensi browser tetap bekerja saat Aegis Desktop ditutup?',
      a: 'Ya. Tidak ada proses latar belakang. Ekstensi memakai cache offline terenkripsi AES-256-GCM dan menyinkronkan data baru saat Aegis dibuka kembali.',
    },
    {
      q: 'Bisakah saya mengubah email, Kata Sandi Utama, atau menghapus brankas lokal?',
      a: 'Ya. Di tab Profil Anda dapat mengubah email, kata sandi akun, mengenkripsi ulang brankas dengan Kata Sandi Utama baru, atau menghapus profil lokal secara permanen.',
    },
  ],
  uk: [
    {
      q: 'Чи працює розширення, коли Aegis Desktop закритий?',
      a: 'Так. У фоні нічого не працює. Розширення використовує локальний кеш із шифруванням AES-256-GCM і синхронізує нові записи під час наступного запуску.',
    },
    {
      q: 'Чи можна змінити email, майстер-пароль або видалити локальне сховище?',
      a: 'Так. У Профілі можна змінити email, пароль акаунта, перешифрувати сховище новим майстер-паролем або назавжди видалити локальний профіль і файл .aegis.',
    },
  ],
  fil: [
    {
      q: 'Gumagana ba ang browser extension kahit nakasara ang Aegis Desktop?',
      a: 'Oo. Walang tumatakbo sa background. Gumagamit ang extension ng lokal na AES-256-GCM encrypted offline cache at nag-si-sync sa susunod mong pagbukas ng Aegis.',
    },
    {
      q: 'Maaari ko bang palitan ang email, Master Password, o burahin ang lokal na vault?',
      a: 'Oo. Sa Profile maaari mong palitan ang email, account password, i-re-encrypt ang buong vault gamit ang bagong Master Password, o permanenteng burahin ang lokal na profile.',
    },
  ],
};

export function getExtraFaqs(lang: string): FaqItem[] {
  return EXTRA_FAQS_BY_LANG[lang] ?? EN_EXTRA_FAQS;
}
