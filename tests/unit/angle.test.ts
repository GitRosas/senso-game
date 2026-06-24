import { describe, it, expect } from 'vitest';
import { circularDistanceDeg, angle } from '@/games/angle';

describe('circularDistanceDeg', () => {
  it('wraps around 0/360', () => {
    expect(circularDistanceDeg(350, 10)).toBeCloseTo(20);
    expect(circularDistanceDeg(10, 350)).toBeCloseTo(20);
    expect(circularDistanceDeg(0, 360)).toBeCloseTo(0);
  });

  it('is symmetric and bounded by 180', () => {
    expect(circularDistanceDeg(0, 180)).toBeCloseTo(180);
    expect(circularDistanceDeg(90, 270)).toBeCloseTo(180);
    expect(circularDistanceDeg(45, 45)).toBe(0);
  });

  it('handles values outside [0,360)', () => {
    expect(circularDistanceDeg(-10, 10)).toBeCloseTo(20);
    expect(circularDistanceDeg(730, 10)).toBeCloseTo(0);
  });
});

describe('angle game', () => {
  it('parseGuess normalizes into [0,360)', () => {
    expect(angle.parseGuess(370, 'easy')).toBeCloseTo(10);
    expect(angle.parseGuess(-90, 'easy')).toBeCloseTo(270);
    expect(angle.parseGuess('x', 'easy')).toBeNull();
  });

  it('computeError is zero for an exact match', () => {
    expect(angle.computeError(123.4, 123.4, 'easy')).toBe(0);
  });
});
