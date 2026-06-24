import { describe, it, expect } from 'vitest';
import { erbRate, pitch } from '@/games/pitch';

describe('ERB-rate formula', () => {
  it('matches spot values of 21.4·log10(0.00437f + 1)', () => {
    expect(erbRate(100)).toBeCloseTo(3.369, 2);
    expect(erbRate(1000)).toBeCloseTo(15.621, 2);
    expect(erbRate(0)).toBeCloseTo(0, 6);
  });

  it('is monotonically increasing', () => {
    let prev = -Infinity;
    for (let f = 50; f <= 2000; f += 50) {
      const e = erbRate(f);
      expect(e).toBeGreaterThan(prev);
      prev = e;
    }
  });
});

describe('pitch scoring', () => {
  it('is zero error for an exact match', () => {
    expect(pitch.computeError(440, 440, 'easy')).toBe(0);
  });

  it('grows with frequency distance on the ERB scale', () => {
    const near = pitch.computeError(440, 466, 'easy');
    const far = pitch.computeError(440, 880, 'easy');
    expect(far).toBeGreaterThan(near);
  });

  it('parseGuess rejects out-of-range frequencies', () => {
    expect(pitch.parseGuess(440, 'easy')).toBe(440);
    expect(pitch.parseGuess(5, 'easy')).toBeNull();
    expect(pitch.parseGuess(50000, 'easy')).toBeNull();
    expect(pitch.parseGuess('abc', 'easy')).toBeNull();
  });
});
