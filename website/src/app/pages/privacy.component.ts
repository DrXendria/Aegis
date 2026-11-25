import { Component, inject, OnInit } from '@angular/core';
import { SeoService } from '../services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <section class="section" style="border-top: none;">
      <div class="container" style="max-width: 760px;">
        <h1 class="section-title">Privacy Policy</h1>
        <p class="section-subtitle">Last updated: November 2026</p>

        <article class="card" style="padding: 28px; display: flex; flex-direction: column; gap: 16px;">
          <h2 style="margin: 0; font-size: 18px;">1. Desktop Application</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 14.5px;">
            Aegis Vault runs 100% locally on your device. We do not operate a cloud database, collect analytics, or have access to your passwords, usernames, or Master Password.
          </p>

          <h2 style="margin: 8px 0 0 0; font-size: 18px;">2. Website &amp; Online Tools</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 14.5px;">
            The Password Generator runs strictly inside your browser. Generated passwords are never logged or transmitted to any server.
          </p>

          <h2 style="margin: 8px 0 0 0; font-size: 18px;">3. Advertising &amp; Cookies</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 14.5px;">
            Guide and tool pages on this site may display third-party advertisements to support ongoing open-source development. Third-party ad providers may use cookies according to their own privacy policies.
          </p>

          <h2 style="margin: 8px 0 0 0; font-size: 18px;">4. Contact</h2>
          <p style="margin: 0; color: var(--text-muted); font-size: 14.5px;">
            For privacy questions or security reports, open an issue at github.com/DrXendria/Aegis.
          </p>
        </article>
      </div>
    </section>
  `,
})
export class PrivacyComponent implements OnInit {
  private readonly seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.update({
      title: 'Privacy Policy',
      description: 'Privacy policy for the Aegis Vault desktop application and website.',
      path: '/privacy',
    });
  }
}
