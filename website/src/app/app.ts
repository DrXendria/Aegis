import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { I18nService } from './services/i18n.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly themeService = inject(ThemeService);
  readonly i18n = inject(I18nService);
  readonly currentYear = new Date().getFullYear();

  onLangChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.i18n.setLanguage(value);
  }
}
