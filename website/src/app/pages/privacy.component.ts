import { Component, computed, inject, OnInit } from '@angular/core';
import { I18nService } from '../services/i18n.service';
import { SeoService } from '../services/seo.service';
import { getPrivacyContent } from './privacy.data';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <section class="section" style="border-top: none;">
      <div class="container" style="max-width: 760px;">
        <h1 class="section-title">{{ i18n.t().privacy_title }}</h1>
        <p class="section-subtitle">{{ content().updated }}</p>

        <article class="card" style="padding: 28px; display: flex; flex-direction: column; gap: 18px;">
          @for (sec of content().sections; track sec.heading) {
            <div>
              <h2 style="margin: 0 0 6px 0; font-size: 18px;">{{ sec.heading }}</h2>
              <p style="margin: 0; color: var(--text-muted); font-size: 14.5px;">{{ sec.body }}</p>
            </div>
          }
        </article>
      </div>
    </section>
  `,
})
export class PrivacyComponent implements OnInit {
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  readonly content = computed(() => getPrivacyContent(this.i18n.lang()));

  ngOnInit(): void {
    this.seo.update({
      title: 'Privacy Policy',
      description: 'Privacy policy for the Aegis Vault desktop application and website.',
      path: '/privacy',
    });
  }
}
