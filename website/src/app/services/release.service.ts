import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type OsPlatform = 'windows' | 'macos' | 'linux';

export interface ReleaseAsset {
  platform: OsPlatform;
  label: string;
  format: string;
  filename: string;
  url: string;
}

export interface ReleaseInfo {
  version: string;
  tag: string;
  publishedAt: string;
  releaseUrl: string;
  source: 'github' | 'fallback';
  assets: ReleaseAsset[];
}

const DEFAULT_RELEASE: ReleaseInfo = {
  version: '0.2.0',
  tag: 'v0.2.0',
  publishedAt: '2026-11-24T00:00:00Z',
  releaseUrl: 'https://github.com/DrXendria/Aegis/releases/tag/v0.2.0',
  source: 'fallback',
  assets: [
    {
      platform: 'windows',
      label: 'Windows Installer',
      format: '.exe',
      filename: 'Aegis_0.2.0_x64-setup.exe',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis_0.2.0_x64-setup.exe',
    },
    {
      platform: 'windows',
      label: 'Windows MSI',
      format: '.msi',
      filename: 'Aegis_0.2.0_x64_en-US.msi',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis_0.2.0_x64_en-US.msi',
    },
    {
      platform: 'macos',
      label: 'macOS (Apple Silicon)',
      format: '.dmg',
      filename: 'Aegis_0.2.0_aarch64.dmg',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis_0.2.0_aarch64.dmg',
    },
    {
      platform: 'linux',
      label: 'Linux Portable',
      format: '.AppImage',
      filename: 'Aegis_0.2.0_amd64.AppImage',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis_0.2.0_amd64.AppImage',
    },
    {
      platform: 'linux',
      label: 'Debian / Ubuntu',
      format: '.deb',
      filename: 'Aegis_0.2.0_amd64.deb',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis_0.2.0_amd64.deb',
    },
    {
      platform: 'linux',
      label: 'Fedora / RHEL',
      format: '.rpm',
      filename: 'Aegis-0.2.0-1.x86_64.rpm',
      url: 'https://github.com/DrXendria/Aegis/releases/download/v0.2.0/Aegis-0.2.0-1.x86_64.rpm',
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  readonly release = signal<ReleaseInfo>(DEFAULT_RELEASE);
  readonly detectedOs = signal<OsPlatform>('windows');
  private loaded = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.detectedOs.set(this.detectBrowserOs());
    }
  }

  loadLatest(): void {
    if (this.loaded || !isPlatformBrowser(this.platformId)) return;
    this.loaded = true;
    this.http.get<ReleaseInfo>('/api/latest-release').subscribe({
      next: (data) => {
        if (data && data.assets?.length) {
          this.release.set(data);
        }
      },
      error: () => {
        // Keep DEFAULT_RELEASE gracefully
      },
    });
  }

  primaryAssetFor(os: OsPlatform): ReleaseAsset {
    const assets = this.release().assets;
    return assets.find((a) => a.platform === os) || assets[0];
  }

  private detectBrowserOs(): OsPlatform {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('mac os') || ua.includes('macintosh')) return 'macos';
    if (ua.includes('linux') && !ua.includes('android')) return 'linux';
    return 'windows';
  }
}
