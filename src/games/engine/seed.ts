/**
 * Seed derivation for the three play modes.
 *
 *  - practice : a fresh random base62 token each game
 *  - daily    : `daily:${gameId}:${mode}:${YYYY-MM-DD-UTC}` — identical worldwide
 *  - challenge: a random 64-bit seed, base62-encoded into a shareable link token
 *
 * Per-round target generation is a pure function of the seed string built by
 * `roundSeedString`, so the same link always replays the same target set.
 */
import type { GameId, Mode } from './types';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function encodeBase62(value: bigint): string {
  if (value < 0n) throw new Error('encodeBase62: value must be non-negative');
  if (value === 0n) return '0';
  let n = value;
  let out = '';
  while (n > 0n) {
    const rem = Number(n % 62n);
    out = BASE62[rem] + out;
    n /= 62n;
  }
  return out;
}

export function decodeBase62(str: string): bigint {
  if (str.length === 0) throw new Error('decodeBase62: empty string');
  let n = 0n;
  for (const ch of str) {
    const idx = BASE62.indexOf(ch);
    if (idx < 0) throw new Error(`decodeBase62: invalid character "${ch}"`);
    n = n * 62n + BigInt(idx);
  }
  return n;
}

/** True when a token is a syntactically valid base62 string of sane length. */
export function isValidSeedToken(token: string): boolean {
  return /^[0-9A-Za-z]{1,16}$/.test(token);
}

/** A fresh random 64-bit seed encoded as base62 (for challenge & practice). */
export function randomSeed(): string {
  const bytes = new Uint8Array(8);
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(bytes);
  } else {
    // Non-deterministic fallback; only used for *creating* new seeds, never for
    // reproducing targets, so weak randomness here is acceptable.
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let v = 0n;
  for (const b of bytes) v = (v << 8n) | BigInt(b);
  return encodeBase62(v);
}

/** Format a date as YYYY-MM-DD in UTC. Pure given the input. */
export function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear().toString().padStart(4, '0');
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Today's UTC date string. */
export function todayUTC(): string {
  return formatDateUTC(new Date());
}

/** The canonical seed for a given day's daily challenge. */
export function dailySeed(gameId: GameId, mode: Mode, dateUTC: string): string {
  return `daily:${gameId}:${mode}:${dateUTC}`;
}

/** The per-round RNG seed string consumed by `rngFromSeed`. */
export function roundSeedString(
  seed: string,
  gameId: GameId,
  mode: Mode,
  roundIndex: number,
): string {
  return `${seed}:${gameId}:${mode}:${roundIndex}`;
}
