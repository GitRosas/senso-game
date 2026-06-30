// Hue - targets in OKLCh, gamut-mapped to sRGB, scored with CIEDE2000 deltaE
import { clampChroma, converter, formatHex } from 'culori';
import type { Game } from '../engine/types';
import { uniform } from '../engine/math';
import { ciede2000 } from '../engine/ciede2000';

export interface HueTarget {
  l: number;
  c: number;
  h: number;
}

export interface HueGuess {
  h: number;
  s: number;
  v: number;
}

const toLab = converter('lab');
const toHsv = converter('hsv');

export function hueTargetToHsv(t: HueTarget): HueGuess {
  const c = toHsv(fittedTargetOklch(t));
  return { h: c?.h ?? 0, s: (c?.s ?? 0) * 100, v: (c?.v ?? 0) * 100 };
}

function fittedTargetOklch(t: HueTarget): { mode: 'oklch'; l: number; c: number; h: number } {
  const oklch = { mode: 'oklch', l: t.l, c: t.c, h: t.h } as const;
  return clampChroma(oklch, 'oklch') as { mode: 'oklch'; l: number; c: number; h: number };
}

export function hueTargetToHex(t: HueTarget): string {
  return formatHex(fittedTargetOklch(t)) ?? '#000000';
}

export function hueGuessToHex(g: HueGuess): string {
  return formatHex({ mode: 'hsv', h: g.h, s: g.s / 100, v: g.v / 100 }) ?? '#000000';
}

export const hue: Game<HueTarget, HueGuess> = {
  id: 'hue',
  rounds: 5,

  generateTarget(rng) {
    // Bright, saturated, well within gamut.
    const h = uniform(rng, 0, 360);
    return { l: uniform(rng, 0.6, 0.78), c: uniform(rng, 0.13, 0.2), h };
  },

  computeError(target, guess) {
    const targetLab = toLab(fittedTargetOklch(target));
    const guessLab = toLab({ mode: 'hsv', h: guess.h, s: guess.s / 100, v: guess.v / 100 });
    if (!targetLab || !guessLab) return Number.POSITIVE_INFINITY;
    return ciede2000(
      { l: targetLab.l, a: targetLab.a, b: targetLab.b },
      { l: guessLab.l, a: guessLab.a, b: guessLab.b },
    );
  },

  halfScoreError() {
    return 12;
  },

  studyMs() {
    return 1400;
  },

  parseGuess(raw) {
    if (typeof raw !== 'object' || raw === null) return null;
    const o = raw as Record<string, unknown>;
    const h = Number(o.h);
    const s = Number(o.s);
    const v = Number(o.v);
    if (![h, s, v].every(Number.isFinite)) return null;
    if (s < 0 || s > 100 || v < 0 || v > 100) return null;
    return { h: ((h % 360) + 360) % 360, s, v };
  },
};
