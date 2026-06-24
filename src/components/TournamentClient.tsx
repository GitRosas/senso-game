'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { fetchTournamentLeaderboard, type LeaderboardRow } from '@/lib/leaderboard';
import type { GameId, Mode } from '@/games/engine/types';
import { cn } from '@/lib/utils';

interface Room {
  name: string;
  game_id: GameId;
  mode: Mode;
  seed: string;
}

export function TournamentClient({ id }: { id: string }) {
  const t = useTranslations('Leaderboard');
  const locale = useLocale();
  const sb = getSupabaseBrowser();
  const [room, setRoom] = useState<Room | null>(null);
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'noconfig'>('loading');

  useEffect(() => {
    if (!sb) {
      setState('noconfig');
      return;
    }
    let active = true;
    (async () => {
      const { data } = await sb
        .from('tournaments')
        .select('name,game_id,mode,seed')
        .eq('id', id)
        .maybeSingle();
      if (!active) return;
      if (!data) {
        setState('missing');
        return;
      }
      const r = data as Room;
      setRoom(r);
      const lb = await fetchTournamentLeaderboard(r.game_id, r.mode, r.seed);
      if (active) {
        setRows(lb);
        setState('ready');
      }
    })();
    return () => {
      active = false;
    };
  }, [sb, id]);

  if (state === 'noconfig') return <p className="text-muted">{t('localOnly')}</p>;
  if (state === 'loading') return <p className="text-muted">{t('loading')}</p>;
  if (state === 'missing' || !room) return <p className="text-muted">{t('loadError')}</p>;

  return (
    <div>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="text-sm capitalize text-muted">
          {room.game_id} · {room.mode}
        </p>
      </header>

      <Link
        href={`/play/${room.game_id}/play?c=${encodeURIComponent(room.seed)}&mode=${room.mode}`}
        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-accent px-6 font-semibold text-accent-fg transition hover:brightness-110"
      >
        {t('playCta', { game: room.name })}
      </Link>

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="w-12 px-3 py-2">{t('rank')}</th>
              <th className="px-3 py-2">{t('player')}</th>
              <th className="w-20 px-3 py-2 text-right">{t('score')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-muted">
                  {t('empty')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={`${row.rank}-${row.createdAt}`}
                  className={cn('border-t border-border', row.isYou && 'bg-accent/10 font-semibold')}
                >
                  <td className="px-3 py-2 text-muted">{row.rank}</td>
                  <td className="px-3 py-2">
                    {row.displayName} {row.isYou && <span className="text-accent">· {t('you')}</span>}
                  </td>
                  <td className="tabular px-3 py-2 text-right font-bold">{row.total.toFixed(1)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted">{locale === 'pt' ? 'Sala privada' : 'Private room'}</p>
    </div>
  );
}
