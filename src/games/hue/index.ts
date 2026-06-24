/**
 * Hue — reproduce a color from memory.
 * Targets are generated in OKLCh for perceptual uniformity, gamut-mapped into
 * sRGB for display, and scored with CIEDE2000 ΔE between the displayed target
 * and the player's HSV guess (both converted to CIE Lab).
 */
import { clampChroma, converter, formatHex } from 'culori';
import type { Game } from '../engine/types';
import { uniform } from '../engine/math';
import { ciede2000 } from '../engine/ciede2000';

/** Target color in OKLCh (l 0–1, c chroma, h degrees). */
export interface HueTarget {
  l: number;
  c: number;
  h: number;
}

/** Player guess from Hue/Saturation/Value sliders (h 0–360, s/v 0–100). */
export interface HueGuess {
  h: number;
  s: number;
  v: number;
}

const toLab = converter('lab');
const toHsv = converter('hsv');

/** The displayed target color expressed as HSV (h 0–360, s/v 0–100). */
export function hueTargetToHsv(t: HueTarget): HueGuess {
  const c = toHsv(fittedTargetOklch(t));
  return { h: c?.h ?? 0, s: (c?.s ?? 0) * 100, v: (c?.v ?? 0) * 100 };
}

/** Bring an OKLCh target into the sRGB gamut (reducing chroma as needed). */
function fittedTargetOklch(t: HueTarget): { mode: 'oklch'; l: number; c: number; h: number } {
  const oklch = { mode: 'oklch', l: t.l, c: t.c, h: t.h } as const;
  return clampChroma(oklch, 'oklch') as { mode: 'oklch'; l: number; c: number; h: number };
}

/** Hex string of the (gamut-mapped) target color — used for display & sharing. */
export function hueTargetToHex(t: HueTarget): string {
  return formatHex(fittedTargetOklch(t)) ?? '#000000';
}

/** Hex string of an HSV guess. */
export function hueGuessToHex(g: HueGuess): string {
  return formatHex({ mode: 'hsv', h: g.h, s: g.s / 100, v: g.v / 100 }) ?? '#000000';
}

export const hue: Game<HueTarget, HueGuess> = {
  id: 'hue',
  rounds: 5,

  generateTarget(rng) {
    // Bright, saturated, well within gamut and easy to name.
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
