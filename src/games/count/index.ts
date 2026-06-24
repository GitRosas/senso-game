/**
 * Count — estimate how many dots flashed (the Approximate Number Sense).
 * Error follows Weber's law (|log2(guess/n)|). Dot size is deliberately varied
 * so that total inked area is NOT a reliable proxy for number: trials alternate
 * between constant-total-area and constant-dot-size layouts.
 */
import type { Game } from '../engine/types';
import { randInt } from '../engine/math';

export type CountControl = 'area' | 'size';

/** A dot in normalized coordinates: x,y,r are fractions of the square play area. */
export interface Dot {
  x: number;
  y: number;
  r: number;
}

export interface CountTarget {
  n: number;
  control: CountControl;
  dots: Dot[];
}

export type CountGuess = number;

const RANGE: readonly [number, number] = [8, 40];

const MARGIN = 0.04;
const TOTAL_AREA_FRAC = 0.13; // ink coverage for area-controlled trials
const REF_N = 35; // reference count for size-controlled dot radius

function dotRadius(n: number, control: CountControl): number {
  if (control === 'area') {
    return Math.sqrt(TOTAL_AREA_FRAC / (n * Math.PI));
  }
  return Math.sqrt(TOTAL_AREA_FRAC / (REF_N * Math.PI));
}

/** Deterministically scatter `n` dots with a soft min-distance constraint. */
function placeDots(rng: () => number, n: number, baseR: number): Dot[] {
  const dots: Dot[] = [];
  for (let i = 0; i < n; i++) {
    // Per-dot size jitter keeps individual area from leaking the count.
    let r = baseR * (0.85 + rng() * 0.3);
    let placed = false;
    for (let attempt = 0; attempt < 40 && !placed; attempt++) {
      const x = MARGIN + r + rng() * (1 - 2 * (MARGIN + r));
      const y = MARGIN + r + rng() * (1 - 2 * (MARGIN + r));
      const ok = dots.every((d) => {
        const dx = d.x - x;
        const dy = d.y - y;
        return Math.hypot(dx, dy) >= (d.r + r) * 0.92;
      });
      if (ok) {
        dots.push({ x, y, r });
        placed = true;
      } else if (attempt === 39) {
        // Give up gracefully: shrink and place anyway so we always emit n dots.
        r *= 0.8;
        dots.push({
          x: MARGIN + r + rng() * (1 - 2 * (MARGIN + r)),
          y: MARGIN + r + rng() * (1 - 2 * (MARGIN + r)),
          r,
        });
        placed = true;
      }
    }
  }
  return dots;
}

export const count: Game<CountTarget, CountGuess> = {
  id: 'count',
  rounds: 5,

  generateTarget(rng) {
    const n = randInt(rng, RANGE[0], RANGE[1]);
    const control: CountControl = rng() < 0.5 ? 'area' : 'size';
    const dots = placeDots(rng, n, dotRadius(n, control));
    return { n, control, dots };
  },

  computeError(target, guess) {
    if (target.n <= 0 || guess <= 0) return Number.POSITIVE_INFINITY;
    return Math.abs(Math.log2(guess / target.n));
  },

  halfScoreError() {
    return 0.17;
  },

  studyMs() {
    return 1700;
  },

  parseGuess(raw) {
    const n = typeof raw === 'number' ? raw : Number(raw);
    if (!Number.isFinite(n)) return null;
    const rounded = Math.round(n);
    if (rounded < 1 || rounded > 999) return null;
    return rounded;
  },
};
