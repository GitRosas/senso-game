import { describe, it, expect } from 'vitest';
import { cyrb128, mulberry32, rngFromSeed } from '@/games/engine/rng';

describe('rng', () => {
  it('cyrb128 is deterministic and returns four uint32 values', () => {
    const a = cyrb128('senso');
    const b = cyrb128('senso');
    expect(a).toEqual(b);
    expect(a).toHaveLength(4);
    for (const h of a) {
      expect(Number.isInteger(h)).toBe(true);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThanOrEqual(0xffffffff);
    }
  });

  it('cyrb128 differs for different inputs', () => {
    expect(cyrb128('a')).not.toEqual(cyrb128('b'));
  });

  it('mulberry32 produces a stable stream in [0,1)', () => {
    const r1 = mulberry32(12345);
    const r2 = mulberry32(12345);
    for (let i = 0; i < 100; i++) {
      const v = r1();
      expect(v).toBe(r2());
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('rngFromSeed is reproducible across instances', () => {
    const a = rngFromSeed('seed:tempo:easy:0');
    const b = rngFromSeed('seed:tempo:easy:0');
    const seqA = Array.from({ length: 20 }, () => a());
    const seqB = Array.from({ length: 20 }, () => b());
    expect(seqA).toEqual(seqB);
  });

  it('rngFromSeed has reasonable mean over many samples', () => {
    const r = rngFromSeed('distribution-check');
    let sum = 0;
    const N = 20000;
    for (let i = 0; i < N; i++) sum += r();
    const mean = sum / N;
    expect(mean).toBeGreaterThan(0.47);
    expect(mean).toBeLessThan(0.53);
  });
});
