/**
 * Spot — reproduce a position from memory (visuospatial localization).
 * A dot flashes somewhere in a square field, then vanishes; the player marks
 * where they think it was. Error is the Euclidean distance between target and
 * guess, in units of the field's width (0 = perfect, ~1.3 = opposite corner).
 *
 * This is an original sixth dimension for Senso: not "what" (colour, pitch) or
 * "how much" (count, duration), but "where" — handled by the brain's dorsal
 * ("where") stream and spatial working memory.
 */
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
