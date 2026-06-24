import type { MetadataRoute } from 'next';
import { GAME_ORDER } from '@/games/engine/registry';
import { SITE_URL } from '@/config';

const LOCALES = ['en', 'pt'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ['', '/pricing', '/about', '/scoring', '/privacy', '/terms'];
  const gamePaths = GAME_ORDER.flatMap((g) => [`/play/${g}`, `/leaderboard/${g}`]);
  const allPaths = [...staticPaths, ...gamePaths];

  const entries: MetadataRoute.Sitemap = [];
  for (const path of allPaths) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path.includes('/leaderboard/') ? 'daily' : 'weekly',
        priority: path === '' ? 1 : path.startsWith('/play/') ? 0.8 : 0.5,
        alternates: {
          languages: {
            en: `${SITE_URL}/en${path}`,
            pt: `${SITE_URL}/pt${path}`,
          },
        },
      });
    }
  }
  return entries;
}
