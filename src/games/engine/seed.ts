// seed derivation for practice (random), daily (date-keyed), and challenge (shareable token) modes.
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

/** syntactically valid base62, sane length */
export function isValidSeedToken(token: string): boolean {
  return /^[0-9A-Za-z]{1,16}$/.test(token);
}

/** random 64-bit seed as base62, for challenge & practice */
export function randomSeed(): string {
  const bytes = new Uint8Array(8);
  const cryptoObj = globalThis.crypto;
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(bytes);
  } else {
    // fallback - only for creating new seeds, never for reproducing targets
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let v = 0n;
  for (const b of bytes) v = (v << 8n) | BigInt(b);
  return encodeBase62(v);
}

/** YYYY-MM-DD in UTC */
export function formatDateUTC(date: Date): string {
  const y = date.getUTCFullYear().toString().padStart(4, '0');
  const m = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const d = date.getUTCDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** today as YYYY-MM-DD UTC */
export function todayUTC(): string {
  return formatDateUTC(new Date());
}

/** canonical daily seed string */
export function dailySeed(gameId: GameId, mode: Mode, dateUTC: string): string {
  return `daily:${gameId}:${mode}:${dateUTC}`;
}

/** per-round seed string for rngFromSeed */
export function roundSeedString(
  seed: string,
  gameId: GameId,
  mode: Mode,
  roundIndex: number,
): string {
  return `${seed}:${gameId}:${mode}:${roundIndex}`;
}
