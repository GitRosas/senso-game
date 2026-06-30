// Spot - error is Euclidean distance in field-width units (0 = perfect, ~1.3 = opposite corner)
import type { Game } from '../engine/types';
import { uniform } from '../engine/math';

export interface SpotTarget {
  x: number;
  y: number;
}

export interface SpotGuess {
  x: number;
  y: number;
}

// Keep targets clear of the very edges so they're always fully visible.
const MARGIN = 0.08;

export const spot: Game<SpotTarget, SpotGuess> = {
  id: 'spot',
  rounds: 5,

  generateTarget(rng) {
    return {
      x: uniform(rng, MARGIN, 1 - MARGIN),
      y: uniform(rng, MARGIN, 1 - MARGIN),
    };
  },

  computeError(target, guess) {
    const dx = target.x - guess.x;
    const dy = target.y - guess.y;
    return Math.hypot(dx, dy);
  },

  halfScoreError() {
    return 0.12;
  },

  studyMs() {
    return 850;
  },

  parseGuess(raw) {
    if (typeof raw !== 'object' || raw === null) return null;
    const o = raw as Record<string, unknown>;
    const x = Number(o.x);
    const y = Number(o.y);
    if (![x, y].every(Number.isFinite)) return null;
    if (x < 0 || x > 1 || y < 0 || y > 1) return null;
    return { x, y };
  },
};
