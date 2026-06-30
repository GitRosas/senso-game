// Shared scoring curve: score(error) = 10 * 0.5^(error / half).
// 10 at zero error, 5 at `half`, 2.5 at 2*half, asymptotic to 0.

export const MAX_TOTAL = 50;

export function scoreRound(error: number, half: number): number {
  if (!Number.isFinite(error) || !Number.isFinite(half) || half <= 0) return 0;
  const raw = 10 * Math.pow(0.5, Math.max(0, error) / half);
  return Math.round(raw * 100) / 100;
}

export function totalScore(roundScores: number[]): number {
  const sum = roundScores.reduce((acc, s) => acc + s, 0);
  return Math.round(sum * 100) / 100;
}
