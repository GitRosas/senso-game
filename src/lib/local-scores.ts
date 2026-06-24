'use client';

import type { GameId, Mode } from '@/games/engine/types';

export interface LocalScore {
  gameId: GameId;
  mode: Mode;
  total: number;
  seed: string;
  isDaily: boolean;
  dailyDate?: string;
  rounds?: { error: number; score: number }[];
  createdAt: number;
  displayName: string;
}

const KEY = 'senso-scores';
const MAX_ENTRIES = 500;

function readAll(): LocalScore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalScore[]) : [];
  } catch {
    return [];
  }
}

function writeAll(scores: LocalScore[]): void {
  if (typeof window === 'undefined') return;
  const trimmed = scores.slice(-MAX_ENTRIES);
  window.localStorage.setItem(KEY, JSON.stringify(trimmed));
}

export function saveLocalResult(entry: LocalScore): void {
  const all = readAll();
  all.push(entry);
  writeAll(all);
}

export function getBest(gameId: GameId, mode: Mode): number | null {
  const scores = readAll().filter((s) => s.gameId === gameId && s.mode === mode);
  if (scores.length === 0) return null;
  return Math.max(...scores.map((s) => s.total));
}

export function getDailyBest(gameId: GameId, mode: Mode, date: string): number | null {
  const scores = readAll().filter(
    (s) => s.gameId === gameId && s.mode === mode && s.isDaily && s.dailyDate === date,
  );
  if (scores.length === 0) return null;
  return Math.max(...scores.map((s) => s.total));
}

export function hasDailyAttempt(gameId: GameId, mode: Mode, date: string): boolean {
  return readAll().some(
    (s) => s.gameId === gameId && s.mode === mode && s.isDaily && s.dailyDate === date,
  );
}

/** Offline leaderboard: best score per (game, mode), optionally daily-only. */
export function getLocalLeaderboard(
  gameId: GameId,
  mode: Mode,
  opts: { daily?: boolean; date?: string } = {},
): LocalScore[] {
  let scores = readAll().filter((s) => s.gameId === gameId && s.mode === mode);
  if (opts.daily) {
    scores = scores.filter((s) => s.isDaily && (!opts.date || s.dailyDate === opts.date));
  }
  return scores.sort((a, b) => b.total - a.total).slice(0, 100);
}

/** Per-game training history (chronological), for the account page. */
export function getHistory(gameId?: GameId): LocalScore[] {
  const scores = readAll();
  return (gameId ? scores.filter((s) => s.gameId === gameId) : scores).sort(
    (a, b) => a.createdAt - b.createdAt,
  );
}
