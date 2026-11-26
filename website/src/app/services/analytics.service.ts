import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type CookieConsentState = 'pending' | 'accepted' | 'declined';

const CONSENT_COOKIE = 'aegis_cookie_consent';
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);
  private gaLoaded = false;
  private measurementId: string | null = null;

  readonly consent = signal<CookieConsentState>('declined');
  readonly showBanner = computed(() => this.consent() === 'pending');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = this.readCookie(CONSENT_COOKIE);
      if (saved === 'accepted' || saved === 'declined') {
        this.consent.set(saved);
        if (saved === 'accepted') {
          void this.initAnalytics();
        }
      } else {
        this.consent.set('pending');
      }
    }
  }

  accept(): void {
    this.consent.set('accepted');
    if (isPlatformBrowser(this.platformId)) {
      this.writeCookie(CONSENT_COOKIE, 'accepted', ONE_YEAR_SECONDS);
      void this.initAnalytics();
    }
  }

  decline(): void {
    this.consent.set('declined');
    if (isPlatformBrowser(this.platformId)) {
      this.writeCookie(CONSENT_COOKIE, 'declined', ONE_YEAR_SECONDS);
      this.clearAnalyticsCookies();
    }
  }

  reopenPreferences(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.consent.set('pending');
    }
  }

  trackDownload(platform: string, format: string, filename: string): void {
    if (!isPlatformBrowser(this.platformId) || this.consent() !== 'accepted') {
      return;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'download_click', {
        platform,
        format,
        file_name: filename,
      });
    }
  }

  private async initAnalytics(): Promise<void> {
    if (this.gaLoaded || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.measurementId === null) {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = (await res.json()) as { gaMeasurementId?: string };
          this.measurementId = (data.gaMeasurementId || '').trim();
        } else {
          this.measurementId = '';
        }
      } catch {
        this.measurementId = '';
      }
    }

    const id = this.measurementId;
    if (!id || !/^G-[A-Z0-9]+$/i.test(id)) {
      return;
    }

    this.gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    document.head.appendChild(script);
  }

  private readCookie(name: string): string | null {
    const prefix = `${name}=`;
    const parts = document.cookie.split(';');
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.startsWith(prefix)) {
        return decodeURIComponent(trimmed.slice(prefix.length));
      }
    }
    return null;
  }

  private writeCookie(name: string, value: string, maxAgeSeconds: number): void {
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`;
  }

  private clearAnalyticsCookies(): void {
    const names = document.cookie
      .split(';')
      .map((c) => c.trim().split('=')[0])
      .filter((n) => n === '_ga' || n.startsWith('_ga_') || n === '_gid' || n === '_gat');

    for (const name of names) {
      document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
    }
  }
}
