import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { isGameId } from '@/games/engine/registry';
import { dailySeed, todayUTC } from '@/games/engine/seed';
import type { Mode } from '@/games/engine/types';
import { PlayClient } from '@/components/play/PlayClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function PlayRoute({
  params: { locale, game },
  searchParams,
}: {
  params: { locale: string; game: string };
  searchParams: { c?: string; daily?: string };
}) {
  setRequestLocale(locale);
  if (!isGameId(game)) notFound();

  const mode: Mode = 'easy';
  const isDaily = searchParams.daily === '1';
  const rawC = typeof searchParams.c === 'string' ? searchParams.c : undefined;
  const c = rawC && /^[A-Za-z0-9:_-]{1,80}$/.test(rawC) ? rawC : undefined;
  const date = todayUTC();
  const initialSeed = isDaily ? dailySeed(game, mode, date) : (c ?? '');

  return (
    <PlayClient
      gameId={game}
      mode={mode}
      initialSeed={initialSeed}
      isDaily={isDaily}
      dailyDate={isDaily ? date : undefined}
    />
  );
}
