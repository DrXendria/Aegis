import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-password-generator',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="section" style="border-top: none;">
      <div class="container tool-wrap">
        <div class="eyebrow">
          <span class="status-dot"></span>
          <span>Generated locally in your browser</span>
        </div>
        <h1 class="section-title" style="margin-top: 12px;">Password Generator</h1>
        <p class="section-subtitle">
          Create strong, random passwords without sending anything over the internet.
        </p>

        <div class="card generator-box">
          <div class="password-display">
            <code class="password-value">{{ password() }}</code>
            <div class="pw-actions">
              <button type="button" class="btn btn-primary" (click)="copyPassword()">
                {{ copied() ? 'Copied' : 'Copy' }}
              </button>
              <button type="button" class="btn" (click)="regenerate()">New</button>
            </div>
          </div>

          <div class="strength-bar">
            <div class="strength-meta">
              <span>Strength: <strong [style.color]="strengthColor()">{{ strengthLabel() }}</strong></span>
              <span>{{ entropyBits() }} bits of entropy</span>
            </div>
            <div class="track">
              <div class="fill" [style.width.%]="strengthPercent()" [style.background]="strengthColor()"></div>
            </div>
          </div>

          <div class="controls">
            <label class="slider-label">
              <span>Length: <strong>{{ length() }} characters</strong></span>
              <input
                type="range"
                min="8"
                max="64"
                [ngModel]="length()"
                (ngModelChange)="onLengthChange($event)"
              />
            </label>

            <div class="toggles">
              <label><input type="checkbox" [ngModel]="useUpper()" (ngModelChange)="toggleOption('upper', $event)" /> Uppercase (A–Z)</label>
              <label><input type="checkbox" [ngModel]="useLower()" (ngModelChange)="toggleOption('lower', $event)" /> Lowercase (a–z)</label>
              <label><input type="checkbox" [ngModel]="useNumbers()" (ngModelChange)="toggleOption('numbers', $event)" /> Numbers (0–9)</label>
              <label><input type="checkbox" [ngModel]="useSymbols()" (ngModelChange)="toggleOption('symbols', $event)" /> Symbols (!&#64;#$%)</label>
            </div>
          </div>
        </div>

        <article class="edu-article">
          <h2>What makes a password strong?</h2>
          <p>
            Length matters more than clever substitutions. A 20-character random password drawn from letters, numbers, and symbols carries roughly 131 bits of entropy—well beyond practical brute-force attacks.
          </p>
          <p>
            Avoid reusing passwords across sites. Keep each login unique and stored inside an encrypted offline vault.
          </p>
        </article>
      </div>
    </section>
  `,
  styles: `
    .tool-wrap {
      max-width: 760px;
    }
    .generator-box {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .password-display {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      padding: 16px;
      border-radius: var(--radius-md);
      background: var(--bg);
      border: 1px solid var(--border);
    }
    .password-value {
      font-size: clamp(16px, 2.2vw, 20px);
      word-break: break-all;
      background: transparent;
      border: none;
      padding: 0;
      color: var(--text);
      flex: 1;
    }
    .pw-actions {
      display: flex;
      gap: 8px;
    }
    .strength-meta {
      display: flex;
      justify-content: space-between;
      font-size: 13.5px;
      margin-bottom: 8px;
      color: var(--text-muted);
    }
    .track {
      height: 6px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }
    .fill {
      height: 100%;
      transition: width 0.2s ease, background 0.2s ease;
    }
    .controls {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .slider-label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 14px;
    }
    .slider-label input[type='range'] {
      accent-color: #f2f4f8;
      width: 100%;
    }
    .toggles {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      font-size: 14px;
      color: var(--text-muted);
    }
    .toggles label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    .edu-article {
      margin-top: 40px;
      padding-top: 28px;
      border-top: 1px solid var(--border);
    }
    .edu-article h2 {
      margin: 0 0 12px 0;
      font-size: 20px;
      font-weight: 600;
    }
    .edu-article p {
      color: var(--text-muted);
      font-size: 15px;
      margin: 0 0 12px 0;
    }
  `,
})
export class PasswordGeneratorComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly seo = inject(SeoService);

  readonly length = signal(20);
  readonly useUpper = signal(true);
  readonly useLower = signal(true);
  readonly useNumbers = signal(true);
  readonly useSymbols = signal(true);
  readonly password = signal('Generating...');
  readonly copied = signal(false);

  readonly poolSize = computed(() => {
    let size = 0;
    if (this.useUpper()) size += 26;
    if (this.useLower()) size += 26;
    if (this.useNumbers()) size += 10;
    if (this.useSymbols()) size += 26;
    return size || 26;
  });

  readonly entropyBits = computed(() =>
    Math.round(this.length() * Math.log2(this.poolSize())),
  );

  readonly strengthPercent = computed(() =>
    Math.min(100, Math.round((this.entropyBits() / 128) * 100)),
  );

  readonly strengthLabel = computed(() => {
    const bits = this.entropyBits();
    if (bits >= 100) return 'Very Strong';
    if (bits >= 70) return 'Strong';
    if (bits >= 50) return 'Moderate';
    return 'Weak';
  });

  readonly strengthColor = computed(() => {
    const bits = this.entropyBits();
    if (bits >= 100) return '#34d399';
    if (bits >= 70) return '#60a5fa';
    if (bits >= 50) return '#eab308';
    return '#f87171';
  });

  ngOnInit(): void {
    this.seo.update({
      title: 'Free Password Generator & Strength Checker',
      description:
        'Generate strong, random passwords locally in your browser with real-time entropy strength estimation.',
      path: '/tools/password-generator',
    });
    this.regenerate();
  }

  onLengthChange(val: number): void {
    this.length.set(Number(val));
    this.regenerate();
  }

  toggleOption(kind: 'upper' | 'lower' | 'numbers' | 'symbols', checked: boolean): void {
    if (kind === 'upper') this.useUpper.set(checked);
    if (kind === 'lower') this.useLower.set(checked);
    if (kind === 'numbers') this.useNumbers.set(checked);
    if (kind === 'symbols') this.useSymbols.set(checked);
    this.regenerate();
  }

  regenerate(): void {
    let charset = '';
    if (this.useUpper()) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (this.useLower()) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (this.useNumbers()) charset += '0123456789';
    if (this.useSymbols()) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const len = this.length();
    let result = '';

    if (isPlatformBrowser(this.platformId) && window.crypto?.getRandomValues) {
      const randomBytes = new Uint32Array(len);
      window.crypto.getRandomValues(randomBytes);
      for (let i = 0; i < len; i++) {
        result += charset[randomBytes[i] % charset.length];
      }
    } else {
      result = 'Aegis!9xK2#mP7@qR4$w';
    }

    this.password.set(result);
    this.copied.set(false);
  }

  async copyPassword(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      await navigator.clipboard.writeText(this.password());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2500);
    } catch {
      // Ignore clipboard permission errors
    }
  }
}
