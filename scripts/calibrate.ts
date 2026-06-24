/**
 * Monte-Carlo calibration harness.
 *
 * Simulates many 5-round games for each game using a per-game error model
 * (errors drawn in each game's native perceptual unit), then reports the score
 * distribution that the current `halfScoreError` constants produce. Use it to
 * re-tune those constants so novices land ~29/50 and experts ~38–40/50.
 *
 * Run:  pnpm calibrate
 */
import { mulberry32 } from '../src/games/engine/rng';
import { scoreRound } from '../src/games/engine/scoring';
import { GAMES, GAME_ORDER } from '../src/games/engine/registry';
import type { GameId } from '../src/games/engine/types';

const TRIALS = 20000;

// Plausible per-round error standard deviation (in each game's error unit) for a
// "novice" and an "expert". Illustrative starting points — replace with empirical
// data as it arrives, then adjust each module's halfScoreError.
const SIGMA: Record<GameId, { novice: number; expert: number }> = {
  tempo: { novice: 0.17, expert: 0.09 },
  hue: { novice: 13, expert: 6 },
  pitch: { novice: 2.4, expert: 1.1 },
  count: { novice: 0.18, expert: 0.09 },
  angle: { novice: 15, expert: 7 },
  spot: { novice: 0.16, expert: 0.06 },
};

function gaussian(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function percentile(sorted: number[], p: number): number {
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx] ?? 0;
}

function simulate(gameId: GameId, sigma: number): number[] {
  const game = GAMES[gameId];
  const half = game.halfScoreError('easy');
  const rng = mulberry32(0x9e3779b9 ^ gameId.length ^ Math.round(sigma * 1000));
  const totals: number[] = [];
  for (let i = 0; i < TRIALS; i++) {
    let total = 0;
    for (let r = 0; r < game.rounds; r++) {
      const error = Math.abs(gaussian(rng) * sigma);
      total += scoreRound(error, half);
    }
    totals.push(Math.round(total * 100) / 100);
  }
  return totals.sort((a, b) => a - b);
}

function row(gameId: GameId, skill: 'novice' | 'expert'): string {
  const sigma = SIGMA[gameId][skill];
  const totals = simulate(gameId, sigma);
  const mean = totals.reduce((a, b) => a + b, 0) / totals.length;
  const half = GAMES[gameId].halfScoreError('easy');
  return [
    gameId.padEnd(6),
    skill.padEnd(7),
    `half=${half.toString().padStart(5)}`,
    `σ=${sigma.toString().padStart(5)}`,
    `mean=${mean.toFixed(1).padStart(5)}`,
    `p10=${percentile(totals, 10).toFixed(1).padStart(5)}`,
    `p90=${percentile(totals, 90).toFixed(1).padStart(5)}`,
  ].join('  ');
}

function main() {
  // eslint-disable-next-line no-console
  console.log(`Senso calibration — ${TRIALS} simulated games per cell (max total 50)\n`);
  for (const gameId of GAME_ORDER) {
    for (const skill of ['novice', 'expert'] as const) {
      // eslint-disable-next-line no-console
      console.log(row(gameId, skill));
    }
    // eslint-disable-next-line no-console
    console.log('');
  }
}

main();
