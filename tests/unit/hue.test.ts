import { describe, it, expect } from 'vitest';
import { converter } from 'culori';
import { ciede2000 } from '@/games/engine/ciede2000';
import { hue, hueTargetToHex, type HueTarget } from '@/games/hue';
import { rngFromSeed } from '@/games/engine/rng';

const toHsv = converter('hsv');

// Reference pairs from Sharma, Wu & Dalal (2005), the canonical CIEDE2000 test set.
const REFERENCE: Array<[[number, number, number], [number, number, number], number]> = [
  [[50, 2.6772, -79.7751], [50, 0, -82.7485], 2.0425],
  [[50, 3.1571, -77.2803], [50, 0, -82.7485], 2.8615],
  [[50, 2.8361, -74.02], [50, 0, -82.7485], 3.4412],
  [[50, -1.3802, -84.2814], [50, 0, -82.7485], 1.0],
  [[50, -1.1848, -84.8006], [50, 0, -82.7485], 1.0],
  [[50, 0, 0], [50, -1, 2], 2.3669],
  [[60.2574, -34.0099, 36.2677], [60.4626, -34.1751, 39.4387], 1.2644],
];

describe('CIEDE2000 matches the Sharma reference set', () => {
  for (const [a, b, expected] of REFERENCE) {
    it(`ΔE([${a}],[${b}]) ≈ ${expected}`, () => {
      const c1 = { l: a[0], a: a[1], b: a[2] };
      const c2 = { l: b[0], a: b[1], b: b[2] };
      expect(ciede2000(c1, c2)).toBeCloseTo(expected, 3);
    });
  }
});

describe('hue scoring', () => {
  it('a near-exact color reproduction scores essentially perfect', () => {
    for (let i = 0; i < 50; i++) {
      const target = hue.generateTarget(rngFromSeed(`hue-perfect-${i}`), 'easy', 0) as HueTarget;
      const hsv = toHsv(hueTargetToHex(target));
      expect(hsv).toBeTruthy();
      const guess = {
        h: hsv?.h ?? 0,
        s: (hsv?.s ?? 0) * 100,
        v: (hsv?.v ?? 0) * 100,
      };
      const error = hue.computeError(target, guess, 'easy');
      expect(error).toBeLessThan(1.5);
    }
  });

  it('a wildly wrong color scores poorly', () => {
    const target: HueTarget = { l: 0.7, c: 0.18, h: 30 }; // orange-ish
    const guess = { h: 220, s: 90, v: 90 }; // blue
    const error = hue.computeError(target, guess, 'easy');
    expect(error).toBeGreaterThan(30);
  });

  it('parseGuess validates and normalizes', () => {
    expect(hue.parseGuess({ h: 400, s: 50, v: 50 }, 'easy')).toEqual({ h: 40, s: 50, v: 50 });
    expect(hue.parseGuess({ h: 0, s: 200, v: 50 }, 'easy')).toBeNull();
    expect(hue.parseGuess('nope', 'easy')).toBeNull();
    expect(hue.parseGuess(null, 'easy')).toBeNull();
  });
});
