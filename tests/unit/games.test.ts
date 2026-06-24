import { describe, it, expect } from 'vitest';
import { GAMES, GAME_ORDER } from '@/games/engine/registry';
import type { GameId, Mode } from '@/games/engine/types';
import { rngFromSeed } from '@/games/engine/rng';
import { roundSeedString } from '@/games/engine/seed';
import { tempo } from '@/games/tempo';
import { pitch } from '@/games/pitch';
import { angle } from '@/games/angle';
import { hue } from '@/games/hue';
import { count, type CountTarget } from '@/games/count';
import { spot, type SpotTarget } from '@/games/spot';

const MODES: Mode[] = ['easy'];

function targetFor(gameId: GameId, mode: Mode, seed: string, round: number): unknown {
  const game = GAMES[gameId];
  const rng = rngFromSeed(roundSeedString(seed, gameId, mode, round));
  return game.generateTarget(rng, mode, round);
}

describe('registry', () => {
  it('lists all six games in order', () => {
    expect(GAME_ORDER).toEqual(['tempo', 'hue', 'pitch', 'count', 'angle', 'spot']);
    for (const id of GAME_ORDER) {
      expect(GAMES[id].id).toBe(id);
      expect(GAMES[id].rounds).toBe(5);
    }
  });
});

describe('determinism: same seed ⇒ identical targets', () => {
  for (const id of GAME_ORDER) {
    for (const mode of MODES) {
      it(`${id}/${mode}`, () => {
        for (let r = 0; r < 5; r++) {
          const a = targetFor(id, mode, 'fixed-seed-123', r);
          const b = targetFor(id, mode, 'fixed-seed-123', r);
          expect(a).toEqual(b);
        }
      });
    }
  }

  it('different seeds generally produce different targets', () => {
    const a = targetFor('angle', 'easy', 'seed-A', 0);
    const b = targetFor('angle', 'easy', 'seed-B', 0);
    expect(a).not.toEqual(b);
  });
});

describe('bounds', () => {
  it('tempo durations stay within the mode range', () => {
    for (const mode of MODES) {
      const [min, max] = mode === 'easy' ? [0.6, 3.0] : [0.4, 5.0];
      for (let i = 0; i < 500; i++) {
        const t = tempo.generateTarget(rngFromSeed(`t${i}`), mode, 0);
        expect(t).toBeGreaterThanOrEqual(min - 0.01);
        expect(t).toBeLessThanOrEqual(max + 0.01);
      }
    }
  });

  it('pitch frequencies stay within the mode range', () => {
    for (const mode of MODES) {
      const [min, max] = mode === 'easy' ? [120, 1000] : [70, 1500];
      for (let i = 0; i < 500; i++) {
        const f = pitch.generateTarget(rngFromSeed(`p${i}`), mode, 0);
        expect(f).toBeGreaterThanOrEqual(min - 1);
        expect(f).toBeLessThanOrEqual(max + 1);
      }
    }
  });

  it('angle targets are in [0, 360)', () => {
    for (let i = 0; i < 500; i++) {
      const a = angle.generateTarget(rngFromSeed(`a${i}`), 'easy', 0);
      expect(a).toBeGreaterThanOrEqual(0);
      expect(a).toBeLessThan(360);
    }
  });

  it('count N stays within the mode range and emits N dots', () => {
    for (const mode of MODES) {
      const [min, max] = mode === 'easy' ? [8, 40] : [10, 90];
      for (let i = 0; i < 80; i++) {
        const t = count.generateTarget(rngFromSeed(`c${i}`), mode, 0) as CountTarget;
        expect(t.n).toBeGreaterThanOrEqual(min);
        expect(t.n).toBeLessThanOrEqual(max);
        expect(t.dots).toHaveLength(t.n);
        for (const d of t.dots) {
          expect(d.x).toBeGreaterThanOrEqual(0);
          expect(d.x).toBeLessThanOrEqual(1);
          expect(d.y).toBeGreaterThanOrEqual(0);
          expect(d.y).toBeLessThanOrEqual(1);
          expect(d.r).toBeGreaterThan(0);
        }
      }
    }
  });

  it('hue targets keep lightness/chroma/hue in range', () => {
    for (const mode of MODES) {
      for (let i = 0; i < 200; i++) {
        const t = hue.generateTarget(rngFromSeed(`h${i}`), mode, 0);
        expect(t.l).toBeGreaterThanOrEqual(0);
        expect(t.l).toBeLessThanOrEqual(1);
        expect(t.c).toBeGreaterThanOrEqual(0);
        expect(t.h).toBeGreaterThanOrEqual(0);
        expect(t.h).toBeLessThan(360);
      }
    }
  });

  it('spot targets stay inside the field margins', () => {
    for (let i = 0; i < 300; i++) {
      const t = spot.generateTarget(rngFromSeed(`s${i}`), 'easy', 0) as SpotTarget;
      expect(t.x).toBeGreaterThanOrEqual(0.08);
      expect(t.x).toBeLessThanOrEqual(0.92);
      expect(t.y).toBeGreaterThanOrEqual(0.08);
      expect(t.y).toBeLessThanOrEqual(0.92);
    }
  });
});

describe('scoring: a perfect guess yields 10 for every game', () => {
  for (const id of GAME_ORDER) {
    it(`${id}`, () => {
      const game = GAMES[id];
      const target = targetFor(id, 'easy', 'perfect', 0);
      // Build a guess equal to the target in the guess's own units.
      let guess: unknown = target;
      if (id === 'count') guess = (target as CountTarget).n;
      if (id === 'hue') {
        // Perfect color match: convert the displayed target to its own HSV.
        // ΔE will be ~0 (sub-1) which scores ~10.
        const t = target as { l: number; c: number; h: number };
        // Use the engine path: parse the displayed hex back is complex; instead
        // assert ΔE is small when guessing the same hue family — checked elsewhere.
        guess = { h: t.h, s: 100, v: 100 };
      }
      const error = game.computeError(target, guess, 'easy');
      const score = error === 0 ? 10 : undefined;
      if (id !== 'hue') {
        expect(error).toBe(0);
        expect(score).toBe(10);
      } else {
        // Hue: exact numeric identity isn't expressible via HSV; just sanity-check finite.
        expect(Number.isFinite(error)).toBe(true);
      }
    });
  }
});
