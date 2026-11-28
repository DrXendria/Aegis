import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { SeoService } from '../services/seo.service';
import { GUIDES_A, type SecurityGuide } from './guides.data-a';
import { GUIDES_B } from './guides.data-b';
import { getExtensionGuide } from './guides.ext-data';

const ALL_GUIDES: Record<string, SecurityGuide[]> = {
  ...GUIDES_A,
  ...GUIDES_B,
};

@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="section" style="border-top: none;">
      <div class="container guides-wrap">
        @if (activeGuide(); as guide) {
          <a routerLink="/guides" class="back-link">&larr; {{ i18n.t().back_guides }}</a>
          <p class="read-meta">{{ guide.readTime }}</p>
          <h1 class="section-title">{{ guide.title }}</h1>
          <p class="section-subtitle">{{ guide.summary }}</p>

          <article class="article-body">
            @for (p of guide.paragraphs; track p) {
              <p>{{ p }}</p>
            }
          </article>
        } @else {
          <h1 class="section-title">{{ i18n.t().guides_title }}</h1>
          <p class="section-subtitle">
            {{ i18n.t().guides_subtitle }}
          </p>

          <div class="guide-list">
            @for (g of guides(); track g.slug) {
              <a [routerLink]="['/guides', g.slug]" class="guide-row">
                <div>
                  <span class="read-time">{{ g.readTime }}</span>
                  <h2>{{ g.title }}</h2>
                  <p>{{ g.summary }}</p>
                </div>
                <span class="arrow">&rarr;</span>
              </a>
            }
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .guides-wrap {
      max-width: 780px;
    }
    .back-link {
      display: inline-block;
      color: var(--text-muted);
      font-size: 14px;
      margin-bottom: 18px;
    }
    .back-link:hover {
      color: var(--text);
    }
    .read-meta {
      margin: 0 0 8px 0;
      font-size: 13px;
      color: var(--accent);
    }
    .guide-list {
      border-top: 1px solid var(--border);
    }
    .guide-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      padding: 24px 0;
      border-bottom: 1px solid var(--border);
      transition: opacity 0.14s ease;
    }
    .guide-row:hover h2 {
      color: var(--text);
    }
    .guide-row:hover .arrow {
      transform: translateX(4px);
      color: var(--text);
    }
    .read-time {
      font-size: 12px;
      color: var(--text-faint);
    }
    .guide-row h2 {
      margin: 4px 0 6px 0;
      font-size: 19px;
      font-weight: 600;
      color: var(--text);
    }
    .guide-row p {
      margin: 0;
      font-size: 14.5px;
      color: var(--text-muted);
    }
    .arrow {
      color: var(--text-faint);
      font-size: 18px;
      transition: transform 0.14s ease, color 0.14s ease;
    }
    .article-body {
      padding-top: 24px;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .article-body p {
      margin: 0;
      font-size: 16px;
      color: var(--text);
      line-height: 1.75;
    }
  `,
})
export class GuidesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  private readonly currentSlug = signal<string | null>(null);

  readonly guides = computed<SecurityGuide[]>(() => {
    const lang = this.i18n.lang();
    const base = ALL_GUIDES[lang] ?? ALL_GUIDES['en'];
    return [...base, getExtensionGuide(lang)];
  });

  readonly activeGuide = computed(() => {
    const slug = this.currentSlug();
    if (!slug) return null;
    return this.guides().find((g) => g.slug === slug) || null;
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.currentSlug.set(slug);
      const guide = this.activeGuide();
      if (guide) {
        this.seo.update({
          title: guide.title,
          description: guide.summary,
          path: `/guides/${guide.slug}`,
          type: 'article',
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.summary,
            author: { '@type': 'Person', name: 'DrXendria' },
          },
        });
      } else {
        this.seo.update({
          title: 'Security Guides — Offline Encryption & Password Hygiene',
          description:
            'Practical guides on AES-256-GCM encryption, PBKDF2 key derivation, migrating from Chrome, and local-first password management.',
          path: '/guides',
        });
      }
    });
  }
}
