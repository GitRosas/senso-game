'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { GAME_ORDER } from '@/games/engine/registry';
import { GAME_ACCENTS, GAME_GLYPHS } from '@/config';
import type { GameId } from '@/games/engine/types';
import { getBest } from '@/lib/local-scores';
import { cn } from '@/lib/utils';

export function GameGrid() {
  const tg = useTranslations('Games');
  const th = useTranslations('Home');
  const tc = useTranslations('Common');
  const [bests, setBests] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const next: Record<string, number | null> = {};
    for (const id of GAME_ORDER) {
      next[id] = getBest(id, 'easy');
    }
    setBests(next);
  }, []);

  return (
    <div id="games" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GAME_ORDER.map((id: GameId) => {
        const accent = GAME_ACCENTS[id];
        const best = bests[id] ?? -1;
        return (
          <Link
            key={id}
            href={`/play/${id}`}
            style={{ ['--accent' as string]: hexToRgb(accent) }}
            className={cn(
              'card-rise group relative overflow-hidden rounded-lg border border-border bg-surface p-5',
              'hover:border-accent/60 hover:shadow-[0_10px_40px_-14px_rgb(var(--accent)/0.55)]',
            )}
          >
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-1 opacity-80"
              style={{ background: accent }}
            />
            <div
              aria-hidden
              className="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition group-hover:opacity-50"
              style={{ background: accent }}
            />
            <div className="flex items-start justify-between">
              <span
                aria-hidden
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl text-2xl ring-1 ring-inset ring-accent/25"
                style={{ background: `${accent}1f` }}
              >
                {GAME_GLYPHS[id]}
              </span>
              {best >= 0 && (
                <span className="rounded-full bg-surface-2 px-2.5 py-1 text-xs text-muted">
                  {th('yourBest')}{' '}
                  <span className="tabular font-semibold text-fg">{best.toFixed(1)}</span>
                </span>
              )}
            </div>
            <h3 className="mt-4 text-xl font-bold text-fg">{tg(`${id}.name`)}</h3>
            <p className="text-sm font-medium text-accent">{tg(`${id}.tagline`)}</p>
            <p className="mt-2 text-sm text-muted">{tg(`${id}.oneLiner`)}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-fg">
              {tc('play')} <span aria-hidden>→</span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

/** Convert #rrggbb to "r g b" for CSS variable assignment. */
function hexToRgb(hex: string): string {
  const m = hex.replace('#', '');
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}
