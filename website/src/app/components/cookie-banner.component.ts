import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';
import { I18nService } from '../services/i18n.service';
import { getCookieCopy } from './cookie-banner.data';

@Component({
  selector: 'app-cookie-banner',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (analytics.showBanner()) {
      <aside class="cookie-banner card" role="dialog" aria-live="polite" [attr.aria-label]="copy().title">
        <div class="cookie-content">
          <div class="cookie-title">{{ copy().title }}</div>
          <p class="cookie-text">
            {{ copy().message }}
            <a routerLink="/privacy" class="cookie-link">{{ copy().privacyLink }}</a>
          </p>
        </div>
        <div class="cookie-actions">
          <button type="button" class="btn cookie-btn" (click)="analytics.decline()">
            {{ copy().decline }}
          </button>
          <button type="button" class="btn btn-primary cookie-btn" (click)="analytics.accept()">
            {{ copy().accept }}
          </button>
        </div>
      </aside>
    }
  `,
  styles: `
    .cookie-banner {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 60;
      width: min(420px, calc(100vw - 32px));
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: var(--surface);
      border: 1px solid var(--border-strong);
      box-shadow: var(--preview-shadow);
    }
    .cookie-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 4px;
    }
    .cookie-text {
      margin: 0;
      font-size: 13px;
      line-height: 1.55;
      color: var(--text-muted);
    }
    .cookie-link {
      color: var(--text);
      text-decoration: underline;
      text-underline-offset: 2px;
      margin-inline-start: 4px;
    }
    .cookie-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .cookie-btn {
      padding: 8px 14px;
      font-size: 13px;
    }
    @media (max-width: 640px) {
      .cookie-banner {
        right: 16px;
        left: 16px;
        bottom: 16px;
        width: auto;
      }
    }
  `,
})
export class CookieBannerComponent {
  readonly analytics = inject(AnalyticsService);
  private readonly i18n = inject(I18nService);
  readonly copy = computed(() => getCookieCopy(this.i18n.lang()));
}
