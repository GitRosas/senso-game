import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { GAME_ORDER, isGameId } from '@/games/engine/registry';
import { GAME_ACCENTS, GAME_GLYPHS } from '@/config';
import { Leaderboard } from '@/components/Leaderboard';
import { AdSlot } from '@/components/AdSlot';
import { cn, hexToRgbChannels } from '@/lib/utils';

export function generateStaticParams() {
  return (['en', 'pt'] as const).flatMap((locale) =>
    GAME_ORDER.map((game) => ({ locale, game })),
  );
}

export async function generateMetadata({
  params: { locale, game },
}: {
  params: { locale: string; game: string };
}): Promise<Metadata> {
  if (!isGameId(game)) return {};
  const t = await getTranslations({ locale, namespace: 'Games' });
  const tl = await getTranslations({ locale, namespace: 'Leaderboard' });
  const title = tl('title', { game: t(`${game}.name`) });
  const path = `/${locale}/leaderboard/${game}`;
  return {
    title,
    description: title,
    alternates: {
      canonical: path,
      languages: { en: `/en/leaderboard/${game}`, pt: `/pt/leaderboard/${game}` },
    },
  };
}

export default async function LeaderboardPage({
  params: { locale, game },
}: {
  params: { locale: string; game: string };
}) {
  setRequestLocale(locale);
  if (!isGameId(game)) notFound();

  const tg = await getTranslations('Games');
  const tl = await getTranslations('Leaderboard');
  const accent = GAME_ACCENTS[game];
  const gameName = tg(`${game}.name`);

  return (
    <div
      style={{ ['--accent' as string]: hexToRgbChannels(accent) }}
      className="mx-auto max-w-3xl px-4 py-10"
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="text-3xl" aria-hidden>
          {GAME_GLYPHS[game]}
        </span>
        <h1 className="text-2xl font-bold">{tl('title', { game: gameName })}</h1>
      </header>

      {/* Switch between each game's leaderboard without leaving the page. */}
      <nav className="mb-6 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1" aria-label={tl('hubTitle')}>
        {GAME_ORDER.map((id) => (
          <Link
            key={id}
            href={`/leaderboard/${id}`}
            aria-current={id === game}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
              id === game
                ? 'border-accent bg-accent/10 text-fg'
                : 'border-border text-muted hover:bg-surface-2 hover:text-fg',
            )}
          >
            <span aria-hidden>{GAME_GLYPHS[id]}</span>
            {tg(`${id}.name`)}
          </Link>
        ))}
      </nav>

      <Leaderboard gameId={game} />

      <div className="mt-6">
        <Link
          href={`/play/${game}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-accent px-6 font-semibold text-accent-fg transition hover:brightness-110"
        >
          {tl('playCta', { game: gameName })}
        </Link>
      </div>

      <div className="mt-10">
        <AdSlot />
      </div>
    </div>
  );
}
