import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AnalyticsService } from '../services/analytics.service';
import { I18nService } from '../services/i18n.service';
import { OsPlatform, ReleaseAsset, ReleaseService } from '../services/release.service';
import { SeoService } from '../services/seo.service';
import { getExtensionCardCopy } from './extension-card.data';
import { getInstallNotes } from './install-notes.data';
import { getPkgInstallCopy } from './pkg-install.data';

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
            <span>v{{ release().version }} &bull; {{ i18n.t().hero_badge }}</span>
          </div>

          <h1 class="hero-title">
            {{ i18n.t().hero_title }}
          </h1>

          <p class="hero-desc">
            {{ i18n.t().hero_desc }}
          </p>

          <div class="hero-actions">
            <a [href]="primaryAsset().url" (click)="onDownload(primaryAsset())" class="btn btn-primary hero-primary-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span>{{ i18n.t().download_for }} {{ osLabel() }}</span>
              <span class="format-pill">{{ primaryAsset().format }}</span>
            </a>
            <a href="#downloads" class="btn">{{ i18n.t().other_platforms }}</a>
          </div>

          <p class="hero-footnote">
            {{ i18n.t().hero_footnote }}
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
            <div class="preview-search">{{ i18n.t().preview_search }}</div>
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
            <h2 class="section-title">{{ i18n.t().downloads_title }} {{ release().tag }}</h2>
            <p class="section-subtitle">
              {{ i18n.t().downloads_subtitle }}
            </p>
          </div>
          <a [href]="release().releaseUrl" target="_blank" rel="noopener noreferrer" class="btn release-link">
            {{ i18n.t().view_github }} &rarr;
          </a>
        </div>

        <div class="platform-grid">
          <article class="card platform-card" [class.highlighted]="detectedOs() === 'windows'">
            <div class="platform-head">
              <h3>Windows</h3>
              @if (detectedOs() === 'windows') {
                <span class="rec-tag">{{ i18n.t().your_os }}</span>
              }
            </div>
            <p>Windows 10 &amp; 11 (64-bit)</p>
            <div class="asset-list">
              @for (asset of assetsByOs('windows'); track asset.filename) {
                <a [href]="asset.url" (click)="onDownload(asset)" class="asset-btn">
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
                <span class="rec-tag">{{ i18n.t().your_os }}</span>
              }
            </div>
            <p>Apple Silicon (M1–M4)</p>
            <div class="asset-list">
              @for (asset of assetsByOs('macos'); track asset.filename) {
                <a [href]="asset.url" (click)="onDownload(asset)" class="asset-btn">
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
                <span class="rec-tag">{{ i18n.t().your_os }}</span>
              }
            </div>
            <p>Fedora, Ubuntu, Debian, Arch</p>
            <div class="asset-list">
              @for (asset of assetsByOs('linux'); track asset.filename) {
                <a [href]="asset.url" (click)="onDownload(asset)" class="asset-btn">
                  <span>{{ asset.label }}</span>
                  <code>{{ asset.format }}</code>
                </a>
              }
            </div>
          </article>
        </div>

        <div class="pkg-box card">
          <div class="pkg-head">
            <div>
              <h3 class="pkg-title">{{ pkgCopy().heading }}</h3>
              <p class="pkg-sub">{{ pkgCopy().subtitle }}</p>
            </div>
            <div class="pkg-tabs" role="tablist">
              @for (tab of pkgTabs; track tab.id) {
                <button
                  type="button"
                  role="tab"
                  class="pkg-tab"
                  [class.active]="activePkgTab() === tab.id"
                  [attr.aria-selected]="activePkgTab() === tab.id"
                  (click)="activePkgTab.set(tab.id)"
                >
                  {{ tab.label }}
                </button>
              }
            </div>
          </div>

          <div class="pkg-cmd-wrap">
            <pre class="pkg-cmd"><code>{{ currentPkgTab().cmd }}</code></pre>
            <button type="button" class="btn pkg-copy-btn" (click)="copyPkgCmd()">
              {{ pkgCopied() ? pkgCopy().copied : pkgCopy().copy }}
            </button>
          </div>
        </div>

        <div class="ext-card card">
          <div class="ext-copy">
            <span class="rec-tag">{{ extCopy().badge }}</span>
            <h3>{{ extCopy().title }}</h3>
            <p>{{ extCopy().desc }}</p>
            <span class="ext-browsers">{{ extCopy().browsers }}</span>
          </div>
          <a
            [href]="extensionZipUrl()"
            (click)="onExtensionDownload()"
            class="btn btn-primary ext-btn"
          >
            {{ extCopy().downloadBtn }}
          </a>
        </div>

        <details class="install-notes card">
          <summary>{{ installNotes().heading }}</summary>
          <div class="install-notes-grid">
            <div>
              <strong>{{ installNotes().macosTitle }}</strong>
              <p>{{ installNotes().macosBody }}</p>
            </div>
            <div>
              <strong>{{ installNotes().windowsTitle }}</strong>
              <p>{{ installNotes().windowsBody }}</p>
            </div>
            <div>
              <strong>{{ installNotes().linuxTitle }}</strong>
              <p>{{ installNotes().linuxBody }}</p>
            </div>
          </div>
        </details>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">{{ i18n.t().features_title }}</h2>
        <p class="section-subtitle">
          {{ i18n.t().features_subtitle }}
        </p>

        <div class="feature-grid">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <h3>{{ i18n.t().f1_title }}</h3>
            <p>{{ i18n.t().f1_desc }}</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <h3>{{ i18n.t().f2_title }}</h3>
            <p>{{ i18n.t().f2_desc }}</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <h3>{{ i18n.t().f3_title }}</h3>
            <p>{{ i18n.t().f3_desc }}</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">04</span>
            <h3>{{ i18n.t().f4_title }}</h3>
            <p>{{ i18n.t().f4_desc }}</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <h3>{{ i18n.t().f5_title }}</h3>
            <p>{{ i18n.t().f5_desc }}</p>
          </div>
          <div class="feature-item">
            <span class="feature-num">06</span>
            <h3>{{ i18n.t().f6_title }}</h3>
            <p>{{ i18n.t().f6_desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container faq-layout">
        <div>
          <h2 class="section-title">{{ i18n.t().faq_title }}</h2>
          <p class="section-subtitle">
            {{ i18n.t().faq_subtitle }}
          </p>
          <a routerLink="/guides" class="btn">{{ i18n.t().read_guides }} &rarr;</a>
        </div>

        <div class="faq-list">
          @for (item of faqs(); track item.q) {
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
      box-shadow: var(--preview-shadow);
    }
    .window-bar {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 12px 16px;
      background: var(--bg-subtle);
      border-bottom: 1px solid var(--border);
    }
    .window-bar .dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--border-strong);
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
  private readonly analytics = inject(AnalyticsService);
  readonly i18n = inject(I18nService);

  readonly release = this.releaseService.release;
  readonly detectedOs = this.releaseService.detectedOs;
  readonly installNotes = computed(() => getInstallNotes(this.i18n.lang()));
  readonly pkgCopy = computed(() => getPkgInstallCopy(this.i18n.lang()));
  readonly extCopy = computed(() => getExtensionCardCopy(this.i18n.lang()));
  readonly extensionZipUrl = computed(
    () =>
      `https://github.com/DrXendria/Aegis/releases/download/${this.release().tag}/Aegis_${this.release().tag}_browser-extension.zip`,
  );

  onExtensionDownload(): void {
    this.analytics.trackDownload(
      'browser-extension',
      '.zip',
      `Aegis_${this.release().tag}_browser-extension.zip`,
    );
  }

  readonly pkgTabs = [
    {
      id: 'homebrew',
      label: 'macOS (Homebrew)',
      cmd: 'brew install --cask drxendria/tap/aegis-vault',
    },
    {
      id: 'apt',
      label: 'Ubuntu / Debian / Mint',
      cmd: 'echo "deb [trusted=yes] https://drxendria.github.io/Aegis/apt ./" | sudo tee /etc/apt/sources.list.d/aegis.list\nsudo apt update && sudo apt install aegis',
    },
    {
      id: 'dnf',
      label: 'Fedora / RHEL (DNF)',
      cmd: 'sudo curl -fsSL https://drxendria.github.io/Aegis/rpm/aegis.repo -o /etc/yum.repos.d/aegis.repo\nsudo dnf install aegis',
    },
    {
      id: 'zypper',
      label: 'openSUSE (Zypper)',
      cmd: 'sudo zypper addrepo -f https://drxendria.github.io/Aegis/rpm/ aegis-vault\nsudo zypper install aegis',
    },
    {
      id: 'scoop',
      label: 'Windows (Scoop)',
      cmd: 'scoop bucket add drxendria https://github.com/DrXendria/scoop-bucket\nscoop install aegis-vault',
    },
    {
      id: 'winget',
      label: 'Windows (Winget · Pending)',
      cmd: 'winget install DrXendria.Aegis',
    },
  ] as const;

  readonly activePkgTab = signal<string>('homebrew');
  readonly pkgCopied = signal<boolean>(false);
  readonly currentPkgTab = computed(
    () => this.pkgTabs.find((t) => t.id === this.activePkgTab()) ?? this.pkgTabs[0],
  );

  copyPkgCmd(): void {
    const cmd = this.currentPkgTab().cmd;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(() => {
        this.pkgCopied.set(true);
        setTimeout(() => this.pkgCopied.set(false), 1800);
      });
    }
  }

  onDownload(asset: ReleaseAsset): void {
    this.analytics.trackDownload(asset.platform, asset.format, asset.filename);
  }

  readonly primaryAsset = computed(() =>
    this.releaseService.primaryAssetFor(this.detectedOs()),
  );

  readonly osLabel = computed(() => {
    const os = this.detectedOs();
    if (os === 'macos') return 'macOS';
    if (os === 'linux') return 'Linux';
    return 'Windows';
  });

  readonly faqs = computed(() => {
    const t = this.i18n.t();
    return [
      { q: t.faq1_q, a: t.faq1_a },
      { q: t.faq2_q, a: t.faq2_a },
      { q: t.faq3_q, a: t.faq3_a },
      { q: t.faq4_q, a: t.faq4_a },
    ];
  });

  assetsByOs(os: OsPlatform) {
    return this.release().assets.filter((a) => a.platform === os);
  }

  ngOnInit(): void {
    this.releaseService.loadLatest();
    const os = this.detectedOs();
    if (os === 'windows') this.activePkgTab.set('scoop');
    else if (os === 'linux') this.activePkgTab.set('apt');
    else this.activePkgTab.set('homebrew');
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
            mainEntity: this.faqs().map((f) => ({
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
