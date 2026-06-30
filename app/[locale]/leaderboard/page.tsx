import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { GAME_ORDER } from '@/games/engine/registry';
import { GAME_ACCENTS, GAME_GLYPHS } from '@/config';
import { hexToRgbChannels } from '@/lib/utils';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Leaderboard' });
  return {
    title: t('hubTitle'),
    description: t('hubSubtitle'),
    alternates: {
      canonical: `/${locale}/leaderboard`,
      languages: { en: '/en/leaderboard', pt: '/pt/leaderboard' },
    },
  };
}

export default async function LeaderboardHub({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations('Leaderboard');
  const tg = await getTranslations('Games');

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">{t('hubTitle')}</h1>
        <p className="mt-2 text-muted">{t('hubSubtitle')}</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAME_ORDER.map((id) => {
          const accent = GAME_ACCENTS[id];
          return (
            <Link
              key={id}
              href={`/leaderboard/${id}`}
              style={{ ['--accent' as string]: hexToRgbChannels(accent) }}
              className="card-rise group relative overflow-hidden rounded-lg border border-border bg-surface p-5 hover:border-accent/60 hover:shadow-[0_10px_40px_-14px_rgb(var(--accent)/0.55)]"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1 opacity-80"
                style={{ background: accent }}
              />
              <div className="flex items-center justify-between">
                <span
                  aria-hidden
                  className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ring-1 ring-inset ring-accent/25"
                  style={{ background: `${accent}1f` }}
                >
                  {GAME_GLYPHS[id]}
                </span>
                <span className="text-accent transition group-hover:translate-x-0.5" aria-hidden>
                  →
                </span>
              </div>
              <h2 className="mt-4 text-lg font-bold">{tg(`${id}.name`)}</h2>
              <p className="text-sm text-accent">{tg(`${id}.tagline`)}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
