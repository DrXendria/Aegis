import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OsPlatform, ReleaseService } from '../services/release.service';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <div class="eyebrow">
            <span class="status-dot"></span>
            <span>Version {{ release().version }} &bull; Free &amp; Open Source</span>
          </div>

          <h1 class="hero-title">
            A password manager that stays on your computer.
          </h1>

          <p class="hero-desc">
            No cloud account to get breached, no subscription, and no hidden tracking.
            Aegis keeps your logins, cards, and notes locked in an encrypted local file with automatic two-week backups.
          </p>

          <div class="hero-actions">
            <a [href]="primaryAsset().url" class="btn btn-primary hero-primary-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>Download for {{ osLabel() }}</span>
              <span class="format-pill">{{ primaryAsset().format }}</span>
            </a>
            <a href="#downloads" class="btn">Other platforms</a>
          </div>

          <p class="hero-footnote">
            Windows, macOS, and Linux &bull; MIT License &bull; Works completely offline
          </p>
        </div>

        <div class="vault-preview card" aria-label="Aegis Vault interface preview">
          <div class="window-bar">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="window-title">Aegis Vault — Local</span>
          </div>
          <div class="window-body">
            <div class="preview-search">Search 42 encrypted entries...</div>
            <div class="preview-list">
              <div class="preview-row">
                <div>
                  <strong>GitHub</strong>
                  <span>xyz&#64;example.com</span>
                </div>
                <code>••••••••••••</code>
              </div>
              <div class="preview-row">
                <div>
                  <strong>Proton Mail</strong>
                  <span>personal&#64;pm.me</span>
                </div>
                <code>••••••••••••</code>
              </div>
              <div class="preview-row">
                <div>
                  <strong>DigitalOcean</strong>
                  <span>ops&#64;studio.dev</span>
                </div>
                <code>••••••••••••</code>
              </div>
            </div>
            <div class="preview-footer">
              <span><span class="status-dot" style="display:inline-block;margin-right:6px;"></span>vault_local.aegis</span>
              <span>AES-256-GCM</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="downloads" class="section">
      <div class="container">
        <div class="section-head-row">
          <div>
            <h2 class="section-title">Download Aegis {{ release().tag }}</h2>
            <p class="section-subtitle">
              Pick the installer for your system. Everything runs locally right out of the box.
            </p>
          </div>
          <a [href]="release().releaseUrl" target="_blank" rel="noopener noreferrer" class="btn release-link">
            View on GitHub &rarr;
          </a>
        </div>

        <div class="platform-grid">
          <article class="card platform-card" [class.highlighted]="detectedOs() === 'windows'">
            <div class="platform-head">
              <h3>Windows</h3>
              @if (detectedOs() === 'windows') {
                <span class="rec-tag">Your OS</span>
              }
            </div>
            <p>Windows 10 &amp; 11 (64-bit)</p>
            <div class="asset-list">
              @for (asset of assetsByOs('windows'); track asset.filename) {
                <a [href]="asset.url" class="asset-btn">
                  <span>{{ asset.label }}</span>
                  <code>{{ asset.format }}</code>
                </a>
              }
            </div>
          </article>

          <article class="card platform-card" [class.highlighted]="detectedOs() === 'macos'">
            <div class="platform-head">
              <h3>macOS</h3>
              @if (detectedOs() === 'macos') {
                <span class="rec-tag">Your OS</span>
              }
            </div>
            <p>Apple Silicon (M1–M4)</p>
            <div class="asset-list">
              @for (asset of assetsByOs('macos'); track asset.filename) {
                <a [href]="asset.url" class="asset-btn">
                  <span>{{ asset.label }}</span>
                  <code>{{ asset.format }}</code>
                </a>
              }
            </div>
          </article>

          <article class="card platform-card" [class.highlighted]="detectedOs() === 'linux'">
            <div class="platform-head">
              <h3>Linux</h3>
              @if (detectedOs() === 'linux') {
                <span class="rec-tag">Your OS</span>
              }
            </div>
            <p>Fedora, Ubuntu, Debian, Arch</p>
            <div class="asset-list">
              @for (asset of assetsByOs('linux'); track asset.filename) {
                <a [href]="asset.url" class="asset-btn">
                  <span>{{ asset.label }}</span>
                  <code>{{ asset.format }}</code>
                </a>
              }
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">Built for peace of mind</h2>
        <p class="section-subtitle">
          Simple day-to-day workflow backed by strict local cryptography and crash-safe saves.
        </p>

        <div class="feature-grid">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <h3>Two-layer local lock</h3>
            <p>Sign in with your local account password, then unlock your encrypted vault with a separate Master Password. Supports multiple isolated profiles on one computer.</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <h3>Full entry encryption</h3>
            <p>Site names, usernames, passwords, cards, and notes are encrypted together with AES-256-GCM and 600,000-round PBKDF2 key derivation.</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <h3>Crash-safe &amp; auto-backed up</h3>
            <p>Every change writes safely to a temporary file first, keeps the previous working copy as <code>.bak</code>, and saves an encrypted backup every 14 days.</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">04</span>
            <h3>Switch in one minute</h3>
            <p>Import existing passwords from Chrome, Bitwarden, LastPass, or previous Aegis backups without manual re-entry.</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <h3>Subscriptions &amp; cards</h3>
            <p>Keep track of renewal dates and monthly costs across 18 currencies alongside your logins and secure notes.</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">06</span>
            <h3>Quiet security habits</h3>
            <p>Copied passwords clear from your clipboard after 30 seconds, and logins untouched for 90+ days get a gentle reminder.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq-layout">
        <div>
          <h2 class="section-title">Common questions</h2>
          <p class="section-subtitle">
            Straight answers about how your data is stored and protected.
          </p>
          <a routerLink="/guides" class="btn">Read security guides &rarr;</a>
        </div>

        <div class="faq-list">
          @for (item of faqs; track item.q) {
            <details class="faq-item">
              <summary>{{ item.q }}</summary>
              <p>{{ item.a }}</p>
            </details>
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .hero {
      padding: 76px 0 80px 0;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 48px;
      align-items: center;
    }
    .hero-title {
      font-size: clamp(32px, 4.6vw, 48px);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.03em;
      margin: 16px 0 18px 0;
      color: var(--text);
    }
    .hero-desc {
      color: var(--text-muted);
      font-size: 17px;
      line-height: 1.65;
      max-width: 520px;
      margin: 0 0 28px 0;
    }
    .hero-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }
    .hero-primary-btn {
      padding: 13px 20px;
      font-size: 15px;
    }
    .format-pill {
      background: rgba(11, 13, 16, 0.12);
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 12px;
      font-family: ui-monospace, monospace;
    }
    .hero-footnote {
      margin: 18px 0 0 0;
      font-size: 13px;
      color: var(--text-faint);
    }

    /* Desktop window preview */
    .vault-preview {
      overflow: hidden;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    }
    .window-bar {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 12px 16px;
      background: rgba(255, 255, 255, 0.025);
      border-bottom: 1px solid var(--border);
    }
    .window-bar .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.16);
    }
    .window-title {
      margin-left: 8px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .window-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .preview-search {
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: var(--bg);
      border: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-faint);
    }
    .preview-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .preview-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 11px 12px;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border);
    }
    .preview-row strong {
      display: block;
      font-size: 13.5px;
      font-weight: 500;
    }
    .preview-row span {
      font-size: 12px;
      color: var(--text-muted);
    }
    .preview-footer {
      display: flex;
      justify-content: space-between;
      font-size: 11.5px;
      color: var(--text-faint);
      padding-top: 6px;
      border-top: 1px solid var(--border);
      font-family: ui-monospace, monospace;
    }

    /* Downloads */
    .section-head-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 28px;
    }
    .section-head-row .section-subtitle {
      margin-bottom: 0;
    }
    .platform-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }
    .platform-card {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .platform-card.highlighted {
      border-color: var(--accent-border);
    }
    .platform-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .platform-head h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }
    .rec-tag {
      font-size: 11px;
      font-weight: 500;
      padding: 3px 8px;
      border-radius: 999px;
      background: var(--accent-soft);
      color: var(--accent);
      border: 1px solid var(--accent-border);
    }
    .platform-card p {
      margin: 0 0 8px 0;
      color: var(--text-muted);
      font-size: 13.5px;
    }
    .asset-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .asset-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: var(--bg);
      border: 1px solid var(--border);
      font-size: 13.5px;
      font-weight: 500;
      transition: background 0.14s ease, border-color 0.14s ease;
    }
    .asset-btn:hover {
      background: var(--surface-hover);
      border-color: var(--border-strong);
    }

    /* Features */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 28px 32px;
    }
    .feature-item {
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }
    .feature-num {
      display: block;
      font-size: 12px;
      font-family: ui-monospace, monospace;
      color: var(--text-faint);
      margin-bottom: 10px;
    }
    .feature-item h3 {
      margin: 0 0 8px 0;
      font-size: 16px;
      font-weight: 600;
    }
    .feature-item p {
      margin: 0;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.65;
    }

    /* FAQ */
    .faq-layout {
      display: grid;
      grid-template-columns: 0.8fr 1.2fr;
      gap: 48px;
      align-items: start;
    }
    .faq-list {
      border-top: 1px solid var(--border);
    }
    .faq-item {
      border-bottom: 1px solid var(--border);
      padding: 18px 0;
    }
    .faq-item summary {
      font-weight: 500;
      font-size: 15px;
      cursor: pointer;
      list-style: none;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
    }
    .faq-item summary::after {
      content: '+';
      color: var(--text-muted);
      font-size: 18px;
      font-weight: 400;
    }
    .faq-item[open] summary::after {
      content: '−';
    }
    .faq-item p {
      margin: 12px 0 0 0;
      color: var(--text-muted);
      font-size: 14px;
      line-height: 1.65;
    }

    @media (max-width: 900px) {
      .hero-grid,
      .platform-grid,
      .feature-grid,
      .faq-layout {
        grid-template-columns: 1fr;
      }
      .hero {
        padding: 48px 0 56px 0;
      }
    }
  `,
})
export class HomeComponent implements OnInit {
  private readonly releaseService = inject(ReleaseService);
  private readonly seo = inject(SeoService);

  readonly release = this.releaseService.release;
  readonly detectedOs = this.releaseService.detectedOs;

  readonly primaryAsset = computed(() =>
    this.releaseService.primaryAssetFor(this.detectedOs()),
  );

  readonly osLabel = computed(() => {
    const os = this.detectedOs();
    if (os === 'macos') return 'macOS';
    if (os === 'linux') return 'Linux';
    return 'Windows';
  });

  readonly faqs = [
    {
      q: 'Does Aegis Vault upload my passwords to any cloud server?',
      a: 'No. Aegis Vault is 100% local. Your vault is encrypted with AES-256-GCM on your device and never leaves your computer unless you choose to copy or sync the encrypted .aegis file yourself.',
    },
    {
      q: 'What happens if my computer loses power while saving?',
      a: 'Every save copies the previous working vault to a .bak file, writes the updated file to .tmp, and atomically replaces it. Aegis also saves an encrypted backup every 14 days to Documents/Aegis-Backups.',
    },
    {
      q: 'Can I import passwords from Chrome, Bitwarden, or LastPass?',
      a: 'Yes. Export a CSV or JSON file from your browser or previous password manager, then open Data Management in Aegis Vault and import it in one click.',
    },
    {
      q: 'Is Aegis Vault free and open source?',
      a: 'Yes. It is released under the MIT License with no paid tiers, no subscriptions, and full source code available on GitHub.',
    },
  ];

  assetsByOs(os: OsPlatform) {
    return this.release().assets.filter((a) => a.platform === os);
  }

  ngOnInit(): void {
    this.releaseService.loadLatest();
    this.seo.update({
      title: 'Aegis Vault — Free Offline Password Manager',
      description:
        'Download Aegis Vault for Windows, macOS, and Linux. Free, open-source offline password manager with two-layer local encryption and automatic 2-week encrypted backups.',
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'SoftwareApplication',
            name: 'Aegis Vault',
            operatingSystem: 'Windows, macOS, Linux',
            applicationCategory: 'SecurityApplication',
            softwareVersion: this.release().version,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            downloadUrl: this.release().releaseUrl,
          },
          {
            '@type': 'FAQPage',
            mainEntity: this.faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          },
        ],
      },
    });
  }
}
