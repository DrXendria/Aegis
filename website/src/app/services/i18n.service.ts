import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { getTranslations, SUPPORTED_LANGUAGES, TranslationKeys } from './i18n.data';

const LANG_STORAGE_KEY = 'aegis_web_lang';
const SUPPORTED_CODES = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly languages = SUPPORTED_LANGUAGES;
  readonly lang = signal<string>('en');
  readonly t = computed<TranslationKeys>(() => getTranslations(this.lang()));

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && SUPPORTED_CODES.has(saved)) {
        this.applyLanguage(saved, false);
      } else {
        const detected = this.detectSystemLanguage();
        this.applyLanguage(detected, false);
      }
    }
  }

  setLanguage(code: string): void {
    const normalized = SUPPORTED_CODES.has(code) ? code : 'en';
    this.applyLanguage(normalized, true);
  }

  private applyLanguage(code: string, persist: boolean): void {
    this.lang.set(code);
    const meta = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    this.document.documentElement.lang = code;
    this.document.documentElement.dir = meta?.rtl ? 'rtl' : 'ltr';
    if (persist && isPlatformBrowser(this.platformId)) {
      localStorage.setItem(LANG_STORAGE_KEY, code);
    }
  }

  private detectSystemLanguage(): string {
    const candidates = navigator.languages?.length
      ? navigator.languages
      : [navigator.language || 'en'];

    for (const raw of candidates) {
      const lower = raw.toLowerCase();
      if (lower.startsWith('tl')) return 'fil';
      const base = lower.split('-')[0];
      if (SUPPORTED_CODES.has(base)) return base;
    }
    return 'en';
  }
}
