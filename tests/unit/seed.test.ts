import { describe, it, expect } from 'vitest';
import {
  encodeBase62,
  decodeBase62,
  isValidSeedToken,
  formatDateUTC,
  dailySeed,
  roundSeedString,
} from '@/games/engine/seed';

describe('base62', () => {
  it('round-trips a range of values', () => {
    for (const v of [0n, 1n, 61n, 62n, 12345n, 9007199254740993n, 18446744073709551615n]) {
      expect(decodeBase62(encodeBase62(v))).toBe(v);
    }
  });

  it('encodes zero as "0"', () => {
    expect(encodeBase62(0n)).toBe('0');
  });

  it('rejects invalid characters when decoding', () => {
    expect(() => decodeBase62('abc-def')).toThrow();
  });

  it('validates seed tokens', () => {
    expect(isValidSeedToken('aZ09')).toBe(true);
    expect(isValidSeedToken('')).toBe(false);
    expect(isValidSeedToken('with space')).toBe(false);
    expect(isValidSeedToken('x'.repeat(17))).toBe(false);
  });
});

describe('date + seed strings', () => {
  it('formats UTC dates', () => {
    expect(formatDateUTC(new Date(Date.UTC(2026, 5, 23)))).toBe('2026-06-23');
    expect(formatDateUTC(new Date(Date.UTC(2026, 0, 1)))).toBe('2026-01-01');
  });

  it('builds canonical daily and round seed strings', () => {
    expect(dailySeed('tempo', 'easy', '2026-06-23')).toBe('daily:tempo:easy:2026-06-23');
    expect(roundSeedString('abc', 'hue', 'easy', 3)).toBe('abc:hue:easy:3');
  });
});
