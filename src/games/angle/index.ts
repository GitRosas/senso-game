/**
 * Angle — reproduce an orientation from memory.
 * Targets span the full circle; error is the shortest circular distance in degrees.
 */
import type { Game } from '../engine/types';
import { mod } from '../engine/math';

export type AngleTarget = number; // degrees in [0, 360)
export type AngleGuess = number; // degrees

/** Shortest angular distance between two bearings, in [0, 180]. */
export function circularDistanceDeg(a: number, b: number): number {
  const d = Math.abs(mod(a, 360) - mod(b, 360));
  return Math.min(d, 360 - d);
}

export const angle: Game<AngleTarget, AngleGuess> = {
  id: 'angle',
  rounds: 5,

  generateTarget(rng) {
    // Quantize to 0.1° so the displayed and scored value match exactly.
    return (Math.round(rng() * 3600) / 10) % 360;
  },

  computeError(target, guess) {
    return circularDistanceDeg(target, guess);
  },

  halfScoreError() {
    return 14;
  },

  studyMs() {
    return 1200;
  },

  parseGuess(raw) {
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n)) return null;
    return mod(n, 360);
  },
};
