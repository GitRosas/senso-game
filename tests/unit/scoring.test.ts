import { describe, it, expect } from 'vitest';
import { scoreRound, totalScore, MAX_TOTAL, scorePercent } from '@/games/engine/scoring';

describe('scoreRound', () => {
  it('is 10 at zero error', () => {
    expect(scoreRound(0, 0.16)).toBe(10);
  });

  it('is 5 at the half-score error', () => {
    expect(scoreRound(0.16, 0.16)).toBe(5);
    expect(scoreRound(12, 12)).toBe(5);
  });

  it('is 2.5 at twice the half-score error', () => {
    expect(scoreRound(0.32, 0.16)).toBe(2.5);
  });

  it('treats negative error as perfect', () => {
    expect(scoreRound(-1, 0.16)).toBe(10);
  });

  it('is monotonically decreasing in error', () => {
    let prev = Infinity;
    for (let e = 0; e <= 2; e += 0.05) {
      const s = scoreRound(e, 0.16);
      expect(s).toBeLessThanOrEqual(prev + 1e-9);
      prev = s;
    }
  });

  it('clamps to >= 0 and never exceeds 10', () => {
    expect(scoreRound(1000, 0.16)).toBeGreaterThanOrEqual(0);
    expect(scoreRound(1000, 0.16)).toBeLessThan(0.01);
    expect(scoreRound(0, 1)).toBeLessThanOrEqual(10);
  });

  it('returns 0 for invalid inputs', () => {
    expect(scoreRound(NaN, 0.16)).toBe(0);
    expect(scoreRound(1, 0)).toBe(0);
    expect(scoreRound(1, -2)).toBe(0);
  });
});

describe('totalScore', () => {
  it('sums to the maximum for five perfect rounds', () => {
    expect(totalScore([10, 10, 10, 10, 10])).toBe(MAX_TOTAL);
  });

  it('rounds to two decimals', () => {
    expect(totalScore([1.111, 2.222])).toBe(3.33);
  });
});

describe('scorePercent', () => {
  it('maps total to 0–100', () => {
    expect(scorePercent(0)).toBe(0);
    expect(scorePercent(25)).toBe(50);
    expect(scorePercent(50)).toBe(100);
  });
});
