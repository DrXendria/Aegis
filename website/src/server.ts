import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const GITHUB_REPO = 'DrXendria/Aegis';
const FALLBACK_VERSION = '0.2.0';
const CACHE_TTL_MS = 15 * 60 * 1000;

interface ReleaseAsset {
  platform: 'windows' | 'macos' | 'linux';
  label: string;
  format: string;
  filename: string;
  url: string;
}

interface ReleasePayload {
  version: string;
  tag: string;
  publishedAt: string;
  releaseUrl: string;
  source: 'github' | 'fallback';
  assets: ReleaseAsset[];
}

function buildFallbackRelease(version = FALLBACK_VERSION): ReleasePayload {
  const tag = `v${version}`;
  const base = `https://github.com/${GITHUB_REPO}/releases/download/${tag}`;
  return {
    version,
    tag,
    publishedAt: new Date().toISOString(),
    releaseUrl: `https://github.com/${GITHUB_REPO}/releases/tag/${tag}`,
    source: 'fallback',
    assets: [
      {
        platform: 'windows',
        label: 'Windows Installer',
        format: '.exe',
        filename: `Aegis_${version}_x64-setup.exe`,
        url: `${base}/Aegis_${version}_x64-setup.exe`,
      },
      {
        platform: 'windows',
        label: 'Windows MSI',
        format: '.msi',
        filename: `Aegis_${version}_x64_en-US.msi`,
        url: `${base}/Aegis_${version}_x64_en-US.msi`,
      },
      {
        platform: 'macos',
        label: 'macOS (Apple Silicon)',
        format: '.dmg',
        filename: `Aegis_${version}_aarch64.dmg`,
        url: `${base}/Aegis_${version}_aarch64.dmg`,
      },
      {
        platform: 'linux',
        label: 'Linux Portable',
        format: '.AppImage',
        filename: `Aegis_${version}_amd64.AppImage`,
        url: `${base}/Aegis_${version}_amd64.AppImage`,
      },
      {
        platform: 'linux',
        label: 'Debian / Ubuntu',
        format: '.deb',
        filename: `Aegis_${version}_amd64.deb`,
        url: `${base}/Aegis_${version}_amd64.deb`,
      },
      {
        platform: 'linux',
        label: 'Fedora / RHEL',
        format: '.rpm',
        filename: `Aegis-${version}-1.x86_64.rpm`,
        url: `${base}/Aegis-${version}-1.x86_64.rpm`,
      },
    ],
  };
}

let cachedRelease: { data: ReleasePayload; expiresAt: number } | null = null;

function classifyAsset(name: string): Pick<ReleaseAsset, 'platform' | 'label' | 'format'> | null {
  const lower = name.toLowerCase();
  if (lower.endsWith('.exe')) return { platform: 'windows', label: 'Windows Installer', format: '.exe' };
  if (lower.endsWith('.msi')) return { platform: 'windows', label: 'Windows MSI', format: '.msi' };
  if (lower.endsWith('.dmg')) return { platform: 'macos', label: 'macOS Disk Image', format: '.dmg' };
  if (lower.endsWith('.appimage')) return { platform: 'linux', label: 'Linux Portable', format: '.AppImage' };
  if (lower.endsWith('.deb')) return { platform: 'linux', label: 'Debian / Ubuntu', format: '.deb' };
  if (lower.endsWith('.rpm')) return { platform: 'linux', label: 'Fedora / RHEL', format: '.rpm' };
  return null;
}

// Security headers
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Node.js API: Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'aegis-web',
    timestamp: new Date().toISOString(),
  });
});

// Node.js API: Cached GitHub Releases proxy
app.get('/api/latest-release', async (_req, res) => {
  if (cachedRelease && cachedRelease.expiresAt > Date.now()) {
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(cachedRelease.data);
    return;
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
      {
        headers: {
          Accept: 'application/vnd.github+json',
          'User-Agent': 'aegis-web-ssr',
        },
        signal: AbortSignal.timeout(4000),
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const json = (await response.json()) as {
      tag_name?: string;
      published_at?: string;
      html_url?: string;
      assets?: Array<{ name: string; browser_download_url: string }>;
    };

    const tag = json.tag_name || `v${FALLBACK_VERSION}`;
    const version = tag.replace(/^v/i, '');
    const parsedAssets: ReleaseAsset[] = (json.assets || [])
      .map((a) => {
        const meta = classifyAsset(a.name);
        if (!meta) return null;
        return {
          ...meta,
          filename: a.name,
          url: a.browser_download_url,
        };
      })
      .filter((x): x is ReleaseAsset => x !== null);

    const payload: ReleasePayload =
      parsedAssets.length > 0
        ? {
            version,
            tag,
            publishedAt: json.published_at || new Date().toISOString(),
            releaseUrl: json.html_url || `https://github.com/${GITHUB_REPO}/releases/tag/${tag}`,
            source: 'github',
            assets: parsedAssets,
          }
        : buildFallbackRelease(version);

    cachedRelease = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS };
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(payload);
  } catch {
    const fallback = buildFallbackRelease();
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json(fallback);
  }
});

// SEO: robots.txt
app.get('/robots.txt', (req, res) => {
  const origin = process.env['SITE_URL'] || `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`,
  );
});

// SEO: Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const origin = process.env['SITE_URL'] || `${req.protocol}://${req.get('host')}`;
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/tools/password-generator', priority: '0.9', changefreq: 'monthly' },
    { loc: '/guides', priority: '0.8', changefreq: 'weekly' },
    { loc: '/guides/zero-knowledge-encryption', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guides/migrate-from-chrome', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guides/local-first-vs-cloud', priority: '0.8', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.4', changefreq: 'yearly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${origin}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
});

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Handle all other requests by rendering the Angular application (SSR)
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Aegis Node.js + Angular SSR server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
