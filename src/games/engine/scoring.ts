/**
 * Unified scoring curve shared by every game so difficulty feels comparable.
 *
 *   score(error) = 10 * 0.5^(error / half)
 *
 * → 10.00 at error 0, 5.00 at `half`, 2.50 at 2·half, monotonically decreasing,
 * asymptotically approaching (but never below) 0.
 */

export const ROUNDS = 5;
export const MAX_ROUND_SCORE = 10;
export const MAX_TOTAL = 50;

export function scoreRound(error: number, half: number): number {
  if (!Number.isFinite(error) || !Number.isFinite(half) || half <= 0) return 0;
  const raw = 10 * Math.pow(0.5, Math.max(0, error) / half);
  return Math.round(raw * 100) / 100; // 0.00–10.00
}

/** Sum per-round scores into a total, rounded to two decimals. */
export function totalScore(roundScores: number[]): number {
  const sum = roundScores.reduce((acc, s) => acc + s, 0);
  return Math.round(sum * 100) / 100;
}

/** Convenience: 0–100 percentage of the maximum, for progress UI. */
export function scorePercent(total: number): number {
  return Math.max(0, Math.min(100, (total / MAX_TOTAL) * 100));
}
