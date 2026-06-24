'use client';

import type { GameId, Mode } from '@/games/engine/types';
import { recomputeScore } from '@/games/engine/submission';
import { getSupabaseBrowser } from './supabase/client';
import { getPlayerId, getDisplayName } from './identity';
import {
  saveLocalResult,
  getLocalLeaderboard,
  hasDailyAttempt,
  type LocalScore,
} from './local-scores';

export interface SubmitArgs {
  gameId: GameId;
  mode: Mode;
  seed: string;
  isDaily: boolean;
  dailyDate?: string;
  guesses: unknown[];
  displayName: string;
}

export interface SubmitResult {
  total: number;
  rounds: { error: number; score: number }[];
  rank: number | null;
  source: 'global' | 'local';
}

export interface LeaderboardRow {
  rank: number;
  displayName: string;
  total: number;
  createdAt: number;
  isYou: boolean;
}

/** Submit a result: recompute locally, persist locally, and publish globally if possible. */
export async function submitResult(args: SubmitArgs): Promise<SubmitResult> {
  const local = recomputeScore({
    gameId: args.gameId,
    mode: args.mode,
    seed: args.seed,
    guesses: args.guesses,
  });
  if (!local.ok) throw new Error(`recompute_failed:${local.reason}`);

  const playerId = getPlayerId();
  const displayName = args.displayName || getDisplayName() || 'Anonymous';

  const entry: LocalScore = {
    gameId: args.gameId,
    mode: args.mode,
    total: local.total,
    seed: args.seed,
    isDaily: args.isDaily,
    dailyDate: args.dailyDate,
    rounds: local.rounds,
    createdAt: Date.now(),
    displayName,
  };
  saveLocalResult(entry);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && anon) {
    try {
      const res = await fetch(`${url}/functions/v1/submit-score`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          apikey: anon,
          authorization: `Bearer ${anon}`,
        },
        body: JSON.stringify({
          gameId: args.gameId,
          mode: args.mode,
          seed: args.seed,
          isDaily: args.isDaily,
          dailyDate: args.dailyDate,
          guesses: args.guesses,
          playerId,
          displayName,
        }),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          total: number;
          rounds: { error: number; score: number }[];
          rank: number | null;
        };
        return { total: data.total, rounds: data.rounds, rank: data.rank, source: 'global' };
      }
    } catch {
      // fall through to local
    }
  }

  const board = getLocalLeaderboard(
    args.gameId,
    args.mode,
    args.isDaily ? { daily: true, date: args.dailyDate } : {},
  );
  const rank = board.filter((s) => s.total > local.total).length + 1;
  return { total: local.total, rounds: local.rounds, rank, source: 'local' };
}

/** Fetch a leaderboard (global if configured, else this device's local board). */
export async function fetchLeaderboard(
  gameId: GameId,
  mode: Mode,
  opts: { daily?: boolean; date?: string } = {},
): Promise<{ rows: LeaderboardRow[]; source: 'global' | 'local' }> {
  const sb = getSupabaseBrowser();
  const me = getPlayerId();

  if (sb) {
    let q = sb
      .from('scores')
      .select('display_name,total,created_at,player_id')
      .eq('game_id', gameId)
      .eq('mode', mode);
    if (opts.daily) {
      q = q.eq('is_daily', true);
      if (opts.date) q = q.eq('daily_date', opts.date);
    }
    const { data, error } = await q.order('total', { ascending: false }).limit(300);
    if (error) throw new Error(error.message);

    // Keep each player's best score only.
    const bestByPlayer = new Map<string, { display: string; total: number; at: number; you: boolean }>();
    for (const row of data ?? []) {
      const pid = String(row.player_id ?? '');
      const prev = bestByPlayer.get(pid);
      if (!prev || row.total > prev.total) {
        bestByPlayer.set(pid, {
          display: row.display_name ?? 'Anonymous',
          total: Number(row.total),
          at: new Date(row.created_at as string).getTime(),
          you: pid === me,
        });
      }
    }
    const rows = [...bestByPlayer.values()]
      .sort((a, b) => b.total - a.total)
      .slice(0, 100)
      .map((r, i) => ({
        rank: i + 1,
        displayName: r.display,
        total: r.total,
        createdAt: r.at,
        isYou: r.you,
      }));
    return { rows, source: 'global' };
  }

  const board = getLocalLeaderboard(gameId, mode, opts);
  const rows = board.map((s, i) => ({
    rank: i + 1,
    displayName: s.displayName || 'You',
    total: s.total,
    createdAt: s.createdAt,
    isYou: true,
  }));
  return { rows, source: 'local' };
}

/**
 * Tournament leaderboard: everyone who plays a room shares one seed, so the
 * private board is simply all scores for that game/mode/seed.
 */
export async function fetchTournamentLeaderboard(
  gameId: GameId,
  mode: Mode,
  seed: string,
): Promise<LeaderboardRow[]> {
  const sb = getSupabaseBrowser();
  const me = getPlayerId();
  if (!sb) return [];
  const { data, error } = await sb
    .from('scores')
    .select('display_name,total,created_at,player_id')
    .eq('game_id', gameId)
    .eq('mode', mode)
    .eq('seed', seed)
    .order('total', { ascending: false })
    .limit(200);
  if (error) return [];
  const bestByPlayer = new Map<string, { display: string; total: number; at: number; you: boolean }>();
  for (const row of data ?? []) {
    const pid = String(row.player_id ?? '');
    const prev = bestByPlayer.get(pid);
    if (!prev || Number(row.total) > prev.total) {
      bestByPlayer.set(pid, {
        display: row.display_name ?? 'Anonymous',
        total: Number(row.total),
        at: new Date(row.created_at as string).getTime(),
        you: pid === me,
      });
    }
  }
  return [...bestByPlayer.values()]
    .sort((a, b) => b.total - a.total)
    .map((r, i) => ({ rank: i + 1, displayName: r.display, total: r.total, createdAt: r.at, isYou: r.you }));
}

export { hasDailyAttempt };
