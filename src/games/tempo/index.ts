// Tempo - error is |log2(guess/target)| (Weber-style ratio)
import type { Game } from '../engine/types';
import { logUniform, round2 } from '../engine/math';

export type TempoTarget = number; // seconds
export type TempoGuess = number; // seconds

const RANGE: readonly [number, number] = [0.6, 3.0];

/** Largest plausible hold; guards the parser against absurd/injected values. */
export const MAX_TEMPO_SECONDS = 20;

export const tempo: Game<TempoTarget, TempoGuess> = {
  id: 'tempo',
  rounds: 5,

  generateTarget(rng) {
    return round2(logUniform(rng, RANGE[0], RANGE[1]));
  },

  computeError(target, guess) {
    if (target <= 0 || guess <= 0) return Number.POSITIVE_INFINITY;
    return Math.abs(Math.log2(guess / target));
  },

  halfScoreError() {
    return 0.16;
  },

  // The stimulus IS the target duration, so the UI owns timing; this is just the
  // range midpoint, used in copy.
  studyMs() {
    return Math.round(((RANGE[0] + RANGE[1]) / 2) * 1000);
  },

  parseGuess(raw) {
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n <= 0 || n > MAX_TEMPO_SECONDS) return null;
    return round2(n);
  },
};
