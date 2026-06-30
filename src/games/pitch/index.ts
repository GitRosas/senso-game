// Pitch - error is |ERB-rate(guess) - ERB-rate(target)|
import type { Game } from '../engine/types';
import { logUniform, round2 } from '../engine/math';

export type PitchTarget = number; // Hz
export type PitchGuess = number; // Hz

const RANGE: readonly [number, number] = [120, 1000];

export const MIN_AUDIBLE_HZ = 20;
export const MAX_AUDIBLE_HZ = 20000;

/** ERB-rate (number of ERBs below f), Glasberg & Moore (1990). */
export function erbRate(freqHz: number): number {
  return 21.4 * Math.log10(0.00437 * freqHz + 1);
}

export const pitch: Game<PitchTarget, PitchGuess> = {
  id: 'pitch',
  rounds: 5,

  generateTarget(rng) {
    return Math.round(logUniform(rng, RANGE[0], RANGE[1]));
  },

  computeError(target, guess) {
    if (target <= 0 || guess <= 0) return Number.POSITIVE_INFINITY;
    return Math.abs(erbRate(guess) - erbRate(target));
  },

  halfScoreError() {
    return 2.2;
  },

  studyMs() {
    return 2000;
  },

  parseGuess(raw) {
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n < MIN_AUDIBLE_HZ || n > MAX_AUDIBLE_HZ) return null;
    return round2(n);
  },
};
