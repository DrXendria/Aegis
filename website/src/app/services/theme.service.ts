import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const THEME_STORAGE_KEY = 'aegis_web_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly theme = signal<ThemeMode>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark') {
        this.applyTheme(saved, false);
      } else {
        const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
        this.applyTheme(prefersLight ? 'light' : 'dark', false);
      }
    }
  }

  toggle(): void {
    const next: ThemeMode = this.theme() === 'dark' ? 'light' : 'dark';
    this.applyTheme(next, true);
  }

  private applyTheme(mode: ThemeMode, persist: boolean): void {
    this.theme.set(mode);
    this.document.documentElement.setAttribute('data-theme', mode);
    if (persist && isPlatformBrowser(this.platformId)) {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    }
  }
}
