import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { SeoService } from '../services/seo.service';

interface SecurityGuide {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  paragraphs: string[];
}

const GUIDES: SecurityGuide[] = [
  {
    slug: 'zero-knowledge-encryption',
    title: 'How AES-256-GCM & 600,000-Round PBKDF2 Protect Your Vault',
    summary:
      'A clear look at key derivation, random initialization vectors (IVs), and authenticated encryption in Aegis Vault.',
    readTime: '4 min read',
    paragraphs: [
      'A password manager is only as strong as its key derivation function and cipher mode. Aegis Vault derives a 256-bit AES key from your Master Password using PBKDF2-HMAC-SHA256 with 600,000 iterations, slowing down offline brute-force attempts dramatically.',
      'Every entry in your vault—including the site name, username, password, card details, and notes—is encrypted using AES-256-GCM with a freshly generated 96-bit random Initialization Vector (IV).',
      'Because GCM is an authenticated encryption mode, any tampering or corruption of the encrypted vault file is detected immediately during decryption. Combined with a key verification check, Aegis rejects a wrong Master Password right away instead of opening an empty vault.',
    ],
  },
  {
    slug: 'migrate-from-chrome',
    title: 'How to Move Passwords from Chrome, Bitwarden, or LastPass to an Offline Vault',
    summary:
      'Step-by-step instructions to export browser-saved passwords and lock them inside a local encrypted .aegis vault.',
    readTime: '3 min read',
    paragraphs: [
      'Saving passwords in a browser is convenient, but browser profiles are a frequent target for infostealers. Moving credentials into a Master-Password-locked local vault reduces your exposure.',
      'In Google Chrome, open chrome://password-manager/settings and export your passwords as a CSV file. In Bitwarden or LastPass, open Settings and choose Export Vault (CSV or JSON).',
      'Open Aegis Vault, go to Data Management, click Import Data, and select the exported file. Aegis categorizes and encrypts every record locally. Remember to permanently delete the temporary CSV file once imported.',
    ],
  },
  {
    slug: 'local-first-vs-cloud',
    title: 'Local-First vs. Cloud Password Managers',
    summary:
      'Comparing cloud convenience against zero-server-exposure security, atomic backups, and user-controlled sync.',
    readTime: '4 min read',
    paragraphs: [
      'Cloud password managers make multi-device sync effortless, but they also create centralized targets and introduce risks like misconfigured permissions, service outages, or subscription lock-in.',
      'A local-first vault keeps your encrypted .aegis file strictly on your machine. No remote API can be probed or wiped by a third party.',
      'With crash-safe atomic saves (.tmp + .bak) and automatic 14-day encrypted backups in Documents/Aegis-Backups, you get dependable local durability—and if you want sync across devices, you can sync the already-encrypted file through Syncthing, Nextcloud, or your own drive.',
    ],
  },
];

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
            @for (g of guides; track g.slug) {
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
      color: #ffffff;
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
      color: #d4dae6;
      line-height: 1.75;
    }
  `,
})
export class GuidesComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  readonly i18n = inject(I18nService);

  readonly guides = GUIDES;
  private readonly currentSlug = signal<string | null>(null);

  readonly activeGuide = computed(() => {
    const slug = this.currentSlug();
    if (!slug) return null;
    return GUIDES.find((g) => g.slug === slug) || null;
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
