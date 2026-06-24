/**
 * Tempo — reproduce a duration from memory.
 * A pad lights for `target` seconds; the player press-and-holds for the same time.
 * Error is the absolute log2 ratio of guessed to target duration (Weber-style).
 */
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

  // The stimulus length equals the target duration itself, so the player UI owns
  // timing; this advisory value is the average of the range (used only in copy).
  studyMs() {
    return Math.round(((RANGE[0] + RANGE[1]) / 2) * 1000);
  },

  parseGuess(raw) {
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n) || n <= 0 || n > MAX_TEMPO_SECONDS) return null;
    return round2(n);
  },
};
