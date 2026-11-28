import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

interface AdminStats {
  totalDownloads: number;
  byPlatform: { windows: number; macos: number; linux: number; other: number };
  latestVersion: string;
  releasesCount: number;
  releases: Array<{ tag: string; publishedAt: string; downloads: number }>;
  updatedAt: string;
  warning?: string;
}

const SESSION_SECRET_KEY = 'aegis_admin_secret';

@Component({
  selector: 'app-admin',
  standalone: true,
  template: `
    <section class="section">
      <div class="container admin-wrap">
        @if (!stats()) {
          <div class="card admin-login">
            <h1 class="section-title" style="font-size: 22px; margin-bottom: 6px;">Admin Dashboard</h1>
            <p class="section-subtitle" style="margin-bottom: 18px;">
              Enter your <code>ADMIN_SECRET</code> configured in Render environment variables.
            </p>
            <form (submit)="onLogin($event)" class="admin-form">
              <input
                type="password"
                class="admin-input"
                placeholder="ADMIN_SECRET"
                [value]="secretInput()"
                (input)="secretInput.set($any($event.target).value)"
                autocomplete="off"
                required
              />
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                {{ loading() ? 'Verifying...' : 'Unlock Dashboard' }}
              </button>
            </form>
            @if (error()) {
              <p class="admin-error">{{ error() }}</p>
            }
          </div>
        } @else {
          <div class="admin-head">
            <div>
              <h1 class="section-title" style="margin-bottom: 4px;">Aegis Vault — Admin</h1>
              <p class="section-subtitle" style="margin-bottom: 0;">
                Latest v{{ stats()!.latestVersion }} &bull; Updated {{ formatDate(stats()!.updatedAt) }}
              </p>
            </div>
            <div class="admin-actions">
              <button type="button" class="btn" (click)="loadStats(true)" [disabled]="loading()">
                {{ loading() ? 'Refreshing...' : 'Refresh' }}
              </button>
              <button type="button" class="btn" (click)="logout()">Lock</button>
            </div>
          </div>

          @if (stats()!.warning) {
            <p class="admin-error" style="margin: 0 0 16px 0;">{{ stats()!.warning }}</p>
          }

          <div class="stat-grid">
            <div class="card stat-card">
              <span class="stat-label">Total Downloads</span>
              <strong class="stat-val">{{ stats()!.totalDownloads }}</strong>
            </div>
            <div class="card stat-card">
              <span class="stat-label">Windows</span>
              <strong class="stat-val">{{ stats()!.byPlatform.windows }}</strong>
            </div>
            <div class="card stat-card">
              <span class="stat-label">macOS</span>
              <strong class="stat-val">{{ stats()!.byPlatform.macos }}</strong>
            </div>
            <div class="card stat-card">
              <span class="stat-label">Linux</span>
              <strong class="stat-val">{{ stats()!.byPlatform.linux }}</strong>
            </div>
          </div>

          <div class="card admin-panel">
            <h3>Releases Breakdown ({{ stats()!.releasesCount }})</h3>
            <div class="rel-table">
              @for (rel of stats()!.releases; track rel.tag) {
                <div class="rel-row">
                  <strong>{{ rel.tag }}</strong>
                  <span class="rel-date">{{ formatDate(rel.publishedAt) }}</span>
                  <code>{{ rel.downloads }} downloads</code>
                </div>
              }
            </div>
          </div>

          <div class="card admin-panel">
            <h3>Operations</h3>
            <div class="quick-links">
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" class="btn">Google Analytics 4 &rarr;</a>
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" class="btn">Search Console &rarr;</a>
              <a href="https://github.com/DrXendria/Aegis/actions" target="_blank" rel="noopener noreferrer" class="btn">GitHub Actions &rarr;</a>
              <a href="https://github.com/microsoft/winget-pkgs/pull/489590" target="_blank" rel="noopener noreferrer" class="btn">Winget PR #489590 &rarr;</a>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: `
    .admin-wrap { max-width: 820px; }
    .admin-login { max-width: 440px; margin: 48px auto; padding: 28px; }
    .admin-form { display: flex; flex-direction: column; gap: 12px; }
    .admin-input {
      padding: 11px 13px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-strong);
      background: var(--bg);
      color: var(--text);
      font-size: 14px;
      outline: none;
    }
    .admin-error { margin: 12px 0 0 0; color: #f87171; font-size: 13px; }
    .admin-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }
    .admin-actions { display: flex; gap: 8px; }
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 20px;
    }
    .stat-card { padding: 18px 20px; display: flex; flex-direction: column; gap: 6px; }
    .stat-label { font-size: 12px; color: var(--text-muted); }
    .stat-val { font-size: 28px; font-weight: 600; color: var(--text); }
    .admin-panel { padding: 20px 22px; margin-bottom: 18px; }
    .admin-panel h3 { margin: 0 0 14px 0; font-size: 15px; font-weight: 600; }
    .rel-table { display: flex; flex-direction: column; gap: 8px; }
    .rel-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      border-radius: var(--radius-sm);
      background: var(--bg);
      border: 1px solid var(--border);
      font-size: 13.5px;
    }
    .rel-date { color: var(--text-muted); font-size: 12.5px; }
    .quick-links { display: flex; gap: 10px; flex-wrap: wrap; }
    @media (max-width: 720px) {
      .stat-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `,
})
export class AdminComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly secretInput = signal('');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly stats = signal<AdminStats | null>(null);

  ngOnInit(): void {
    this.title.setTitle('Admin | Aegis Vault');
    this.meta.updateTag({ name: 'robots', content: 'noindex, nofollow' });

    if (isPlatformBrowser(this.platformId)) {
      const saved = sessionStorage.getItem(SESSION_SECRET_KEY);
      if (saved) {
        this.secretInput.set(saved);
        void this.loadStats(false);
      }
    }
  }

  onLogin(event: Event): void {
    event.preventDefault();
    void this.loadStats(false);
  }

  async loadStats(forceRefresh: boolean): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    const secret = this.secretInput().trim();
    if (!secret) return;

    this.loading.set(true);
    this.error.set('');
    try {
      const url = forceRefresh ? '/api/stats?refresh=1' : '/api/stats';
      const res = await fetch(url, {
        headers: { 'X-Admin-Secret': secret },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        sessionStorage.removeItem(SESSION_SECRET_KEY);
        this.stats.set(null);
        this.error.set(data.error || `Error ${res.status}`);
        return;
      }
      sessionStorage.setItem(SESSION_SECRET_KEY, secret);
      this.stats.set(data as AdminStats);
    } catch {
      this.error.set('Network error contacting /api/stats.');
    } finally {
      this.loading.set(false);
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(SESSION_SECRET_KEY);
    }
    this.stats.set(null);
    this.secretInput.set('');
    this.error.set('');
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  }
}
