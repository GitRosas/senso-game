'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { GameId } from '@/games/engine/types';

export function PlayPanel({ gameId }: { gameId: GameId }) {
  const ts = useTranslations('Sections');
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/play/${gameId}/play`}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg bg-accent px-7 font-semibold text-accent-fg shadow transition hover:brightness-110"
        >
          {ts('startPractice')}
        </Link>
        <Link
          href={`/play/${gameId}/play?daily=1`}
          className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-lg border border-border px-7 font-semibold transition hover:bg-surface-2"
        >
          {ts('startDaily')}
        </Link>
      </div>
    </div>
  );
}
