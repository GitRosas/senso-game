'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import type { GameId, Mode } from '@/games/engine/types';
import { todayUTC } from '@/games/engine/seed';
import { fetchLeaderboard, type LeaderboardRow } from '@/lib/leaderboard';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

export function Leaderboard({ gameId }: { gameId: GameId }) {
  const t = useTranslations('Leaderboard');
  const locale = useLocale();
  const [scope, setScope] = useState<'daily' | 'all'>('all');
  const mode: Mode = 'easy';
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'global' | 'local'>('local');
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);
    fetchLeaderboard(gameId, mode, scope === 'daily' ? { daily: true, date: todayUTC() } : {})
      .then((res) => {
        if (!active) return;
        setRows(res.rows);
        setSource(res.source);
      })
      .catch(() => active && setError(true))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [gameId, mode, scope]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          ariaLabel="scope"
          items={[
            { value: 'all', label: t('allTime') },
            { value: 'daily', label: t('daily') },
          ]}
          value={scope}
          onValueChange={(v) => setScope(v as 'daily' | 'all')}
        />
      </div>

      {source === 'local' && !loading && !error && (
        <p className="mt-3 text-xs text-muted">{t('localOnly')}</p>
      )}

      <div className="mt-4 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-muted">
            <tr>
              <th className="w-12 px-3 py-2">{t('rank')}</th>
              <th className="px-3 py-2">{t('player')}</th>
              <th className="w-20 px-3 py-2 text-right">{t('score')}</th>
              <th className="hidden w-28 px-3 py-2 text-right sm:table-cell">{t('when')}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">
                  {t('loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">
                  {t('loadError')}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-muted">
                  {t('empty')}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={`${row.rank}-${row.displayName}-${row.createdAt}`}
                  className={cn(
                    'border-t border-border',
                    row.isYou && 'bg-accent/10 font-semibold',
                  )}
                >
                  <td className="px-3 py-2 text-muted">{row.rank}</td>
                  <td className="px-3 py-2">
                    {row.displayName} {row.isYou && <span className="text-accent">· {t('you')}</span>}
                  </td>
                  <td className="tabular px-3 py-2 text-right font-bold">{row.total.toFixed(1)}</td>
                  <td className="hidden px-3 py-2 text-right text-muted sm:table-cell">
                    {new Date(row.createdAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
