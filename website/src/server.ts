import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { timingSafeEqual } from 'node:crypto';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  allowedHosts: [
    'aegis-vault-web.onrender.com',
    '*.onrender.com',
    'localhost',
    '127.0.0.1',
  ],
});

const GITHUB_REPO = 'DrXendria/Aegis';
const FALLBACK_VERSION = '0.3.0';
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

// Node.js API: Public runtime config (GA4 Measurement ID)
app.get('/api/config', (_req, res) => {
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({
    gaMeasurementId: (process.env['GA_MEASUREMENT_ID'] || 'G-1G6WBEGWGR').trim(),
  });
});

interface StatsPayload {
  totalDownloads: number;
  byPlatform: { windows: number; macos: number; linux: number; other: number };
  latestVersion: string;
  releasesCount: number;
  releases: Array<{ tag: string; publishedAt: string; downloads: number }>;
  updatedAt: string;
}

let cachedStats: { data: StatsPayload; expiresAt: number } | null = null;
const adminFailTracker = new Map<string, { count: number; resetAt: number }>();

function safeSecretEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Node.js API: Private ADMIN_SECRET-protected GitHub Releases statistics
app.get('/api/stats', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');

  const expectedSecret = (process.env['ADMIN_SECRET'] || '').trim();
  if (!expectedSecret) {
    res.status(503).json({ error: 'Admin stats endpoint is disabled (ADMIN_SECRET not set).' });
    return;
  }

  const clientIp =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    'unknown';
  const now = Date.now();
  const failRecord = adminFailTracker.get(clientIp);
  if (failRecord && failRecord.resetAt > now && failRecord.count >= 10) {
    res.status(429).json({ error: 'Too many failed attempts. Try again later.' });
    return;
  }

  const providedSecret = String(req.headers['x-admin-secret'] || '').trim();
  if (!providedSecret || !safeSecretEqual(providedSecret, expectedSecret)) {
    const nextCount = failRecord && failRecord.resetAt > now ? failRecord.count + 1 : 1;
    adminFailTracker.set(clientIp, { count: nextCount, resetAt: now + 15 * 60 * 1000 });
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  adminFailTracker.delete(clientIp);

  const forceRefresh = req.query['refresh'] === '1';
  if (!forceRefresh && cachedStats && cachedStats.expiresAt > now) {
    res.json(cachedStats.data);
    return;
  }

  try {
    const ghToken = (process.env['GITHUB_TOKEN'] || '').trim();
    const ghHeaders: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'aegis-web-ssr',
    };
    if (ghToken) {
      ghHeaders['Authorization'] = `Bearer ${ghToken}`;
    }

    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/releases?per_page=30`,
      {
        headers: ghHeaders,
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!response.ok) {
      throw new Error(`GitHub API HTTP ${response.status}`);
    }

    const releasesRaw = (await response.json()) as Array<{
      tag_name?: string;
      published_at?: string;
      assets?: Array<{ name: string; download_count?: number }>;
    }>;

    const byPlatform = { windows: 0, macos: 0, linux: 0, other: 0 };
    let totalDownloads = 0;
    const releases: Array<{ tag: string; publishedAt: string; downloads: number }> = [];

    for (const rel of releasesRaw) {
      let relDownloads = 0;
      for (const asset of rel.assets || []) {
        const count = asset.download_count || 0;
        totalDownloads += count;
        relDownloads += count;
        const meta = classifyAsset(asset.name);
        if (meta) {
          byPlatform[meta.platform] += count;
        } else {
          byPlatform.other += count;
        }
      }
      releases.push({
        tag: rel.tag_name || 'unknown',
        publishedAt: rel.published_at || '',
        downloads: relDownloads,
      });
    }

    const payload: StatsPayload = {
      totalDownloads,
      byPlatform,
      latestVersion: (releasesRaw[0]?.tag_name || `v${FALLBACK_VERSION}`).replace(/^v/i, ''),
      releasesCount: releasesRaw.length,
      releases,
      updatedAt: new Date().toISOString(),
    };

    cachedStats = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS };
    res.json(payload);
  } catch (err) {
    if (cachedStats) {
      res.json(cachedStats.data);
      return;
    }
    const reason = err instanceof Error ? err.message : 'GitHub request failed';
    res.json({
      totalDownloads: 0,
      byPlatform: { windows: 0, macos: 0, linux: 0, other: 0 },
      latestVersion: FALLBACK_VERSION,
      releasesCount: 0,
      releases: [],
      updatedAt: new Date().toISOString(),
      warning: `${reason} (Add GITHUB_TOKEN in Render Environment to avoid shared-IP rate limits.)`,
    });
  }
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
  const origin =
    process.env['SITE_URL'] ||
    process.env['RENDER_EXTERNAL_URL'] ||
    `${req.protocol}://${req.get('host')}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${origin}/sitemap.xml\n`,
  );
});

// SEO: Dynamic sitemap.xml
app.get('/sitemap.xml', (req, res) => {
  const origin =
    process.env['SITE_URL'] ||
    process.env['RENDER_EXTERNAL_URL'] ||
    `${req.protocol}://${req.get('host')}`;
  const today = new Date().toISOString().split('T')[0];
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/tools/password-generator', priority: '0.9', changefreq: 'monthly' },
    { loc: '/guides', priority: '0.8', changefreq: 'weekly' },
    { loc: '/guides/zero-knowledge-encryption', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guides/migrate-from-chrome', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guides/local-first-vs-cloud', priority: '0.8', changefreq: 'monthly' },
    { loc: '/guides/browser-extension-autofill', priority: '0.8', changefreq: 'monthly' },
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
  const port = Number(process.env['PORT'] || 4000);
  app.listen(port, '0.0.0.0', (error) => {
    if (error) {
      throw error;
    }
    console.log(`Aegis Node.js + Angular SSR server listening on http://0.0.0.0:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
