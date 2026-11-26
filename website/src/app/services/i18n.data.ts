import { LANGS_A } from './i18n.langs-a';
import { LANGS_B } from './i18n.langs-b';

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
  preview_search: string;
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
  faq1_q: string;
  faq1_a: string;
  faq2_q: string;
  faq2_a: string;
  faq3_q: string;
  faq3_a: string;
  faq4_q: string;
  faq4_a: string;
  gen_badge: string;
  gen_title: string;
  gen_subtitle: string;
  copy: string;
  copied: string;
  new_btn: string;
  strength: string;
  strength_very_strong: string;
  strength_strong: string;
  strength_moderate: string;
  strength_weak: string;
  entropy_unit: string;
  length_label: string;
  chars_unit: string;
  opt_upper: string;
  opt_lower: string;
  opt_numbers: string;
  opt_symbols: string;
  gen_edu_title: string;
  gen_edu_p1: string;
  gen_edu_p2: string;
  guides_title: string;
  guides_subtitle: string;
  back_guides: string;
  privacy_title: string;
  footer_desc: string;
  privacy_policy: string;
};

const ALL_TRANSLATIONS: Record<string, TranslationKeys> = {
  ...LANGS_A,
  ...LANGS_B,
};

export function getTranslations(lang: string): TranslationKeys {
  return ALL_TRANSLATIONS[lang] ?? ALL_TRANSLATIONS['en'];
}
