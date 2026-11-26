import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CookieBannerComponent } from './components/cookie-banner.component';
import { getCookieCopy } from './components/cookie-banner.data';
import { AnalyticsService } from './services/analytics.service';
import { I18nService } from './services/i18n.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CookieBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly themeService = inject(ThemeService);
  readonly i18n = inject(I18nService);
  readonly analytics = inject(AnalyticsService);
  readonly cookieCopy = computed(() => getCookieCopy(this.i18n.lang()));
  readonly currentYear = new Date().getFullYear();

  onLangChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.i18n.setLanguage(value);
  }
}
