// Deno copy of src/games/engine - kept in sync manually (Next and Deno resolvers
// are not interoperable). Single difficulty ('easy').

import { clampChroma, converter } from 'npm:culori@4';

export type GameId = 'tempo' | 'hue' | 'pitch' | 'count' | 'angle' | 'spot';
export type Mode = 'easy';

// RNG
function cyrb128(str: string): [number, number, number, number] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= h2 ^ h3 ^ h4;
  h2 ^= h1;
  h3 ^= h1;
  h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
function mulberry32(a: number): () => number {
  let state = a >>> 0;
  return function () {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function rngFromSeed(seedStr: string): () => number {
  const [a] = cyrb128(seedStr);
  return mulberry32(a);
}
function roundSeedString(seed: string, gameId: GameId, mode: Mode, r: number): string {
  return `${seed}:${gameId}:${mode}:${r}`;
}

// math helpers
const uniform = (rng: () => number, min: number, max: number) => min + rng() * (max - min);
const logUniform = (rng: () => number, min: number, max: number) =>
  Math.exp(Math.log(min) + rng() * (Math.log(max) - Math.log(min)));
const randInt = (rng: () => number, min: number, max: number) =>
  Math.floor(min + rng() * (max - min + 1));
const round2 = (v: number) => Math.round(v * 100) / 100;
const mod = (n: number, m: number) => ((n % m) + m) % m;

// scoring
function scoreRound(error: number, half: number): number {
  if (!Number.isFinite(error) || !Number.isFinite(half) || half <= 0) return 0;
  return Math.round(10 * Math.pow(0.5, Math.max(0, error) / half) * 100) / 100;
}
function totalScore(scores: number[]): number {
  return Math.round(scores.reduce((a, s) => a + s, 0) * 100) / 100;
}

// CIEDE2000 color difference
const RAD = Math.PI / 180;
function atan2Deg(y: number, x: number): number {
  let d = Math.atan2(y, x) / RAD;
  if (d < 0) d += 360;
  return d;
}
function ciede2000(l1: number, a1: number, b1: number, l2: number, a2: number, b2: number): number {
  const C1 = Math.hypot(a1, b1);
  const C2 = Math.hypot(a2, b2);
  const Cbar = (C1 + C2) / 2;
  const Cbar7 = Math.pow(Cbar, 7);
  const G = 0.5 * (1 - Math.sqrt(Cbar7 / (Cbar7 + 6103515625)));
  const a1p = (1 + G) * a1;
  const a2p = (1 + G) * a2;
  const C1p = Math.hypot(a1p, b1);
  const C2p = Math.hypot(a2p, b2);
  const h1p = C1p === 0 ? 0 : atan2Deg(b1, a1p);
  const h2p = C2p === 0 ? 0 : atan2Deg(b2, a2p);
  const dLp = l2 - l1;
  const dCp = C2p - C1p;
  let dhp: number;
  if (C1p * C2p === 0) dhp = 0;
  else {
    const diff = h2p - h1p;
    if (Math.abs(diff) <= 180) dhp = diff;
    else if (diff > 180) dhp = diff - 360;
    else dhp = diff + 360;
  }
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * RAD);
  const Lbarp = (l1 + l2) / 2;
  const Cbarp = (C1p + C2p) / 2;
  let hbarp: number;
  if (C1p * C2p === 0) hbarp = h1p + h2p;
  else if (Math.abs(h1p - h2p) <= 180) hbarp = (h1p + h2p) / 2;
  else if (h1p + h2p < 360) hbarp = (h1p + h2p + 360) / 2;
  else hbarp = (h1p + h2p - 360) / 2;
  const T =
    1 -
    0.17 * Math.cos((hbarp - 30) * RAD) +
    0.24 * Math.cos(2 * hbarp * RAD) +
    0.32 * Math.cos((3 * hbarp + 6) * RAD) -
    0.2 * Math.cos((4 * hbarp - 63) * RAD);
  const dTheta = 30 * Math.exp(-Math.pow((hbarp - 275) / 25, 2));
  const Cbarp7 = Math.pow(Cbarp, 7);
  const Rc = 2 * Math.sqrt(Cbarp7 / (Cbarp7 + 6103515625));
  const Sl = 1 + (0.015 * Math.pow(Lbarp - 50, 2)) / Math.sqrt(20 + Math.pow(Lbarp - 50, 2));
  const Sc = 1 + 0.045 * Cbarp;
  const Sh = 1 + 0.015 * Cbarp * T;
  const Rt = -Math.sin(2 * dTheta * RAD) * Rc;
  const termL = dLp / Sl;
  const termC = dCp / Sc;
  const termH = dHp / Sh;
  return Math.sqrt(termL * termL + termC * termC + termH * termH + Rt * termC * termH);
}

const toLab = converter('lab');
function erbRate(f: number): number {
  return 21.4 * Math.log10(0.00437 * f + 1);
}
function circularDistanceDeg(a: number, b: number): number {
  const d = Math.abs(mod(a, 360) - mod(b, 360));
  return Math.min(d, 360 - d);
}

// per-game logic
interface GameLogic {
  rounds: number;
  generateTarget(rng: () => number): unknown;
  computeError(target: unknown, guess: unknown): number;
  halfScoreError(): number;
  parseGuess(raw: unknown): unknown;
}

const GAMES: Record<GameId, GameLogic> = {
  tempo: {
    rounds: 5,
    generateTarget: (rng) => round2(logUniform(rng, 0.6, 3.0)),
    computeError: (t, g) => {
      const tt = t as number;
      const gg = g as number;
      return tt <= 0 || gg <= 0 ? Infinity : Math.abs(Math.log2(gg / tt));
    },
    halfScoreError: () => 0.16,
    parseGuess: (raw) => {
      const n = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(n) && n > 0 && n <= 20 ? round2(n) : null;
    },
  },
  pitch: {
    rounds: 5,
    generateTarget: (rng) => Math.round(logUniform(rng, 120, 1000)),
    computeError: (t, g) => {
      const tt = t as number;
      const gg = g as number;
      return tt <= 0 || gg <= 0 ? Infinity : Math.abs(erbRate(gg) - erbRate(tt));
    },
    halfScoreError: () => 2.2,
    parseGuess: (raw) => {
      const n = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(n) && n >= 20 && n <= 20000 ? round2(n) : null;
    },
  },
  angle: {
    rounds: 5,
    generateTarget: (rng) => (Math.round(rng() * 3600) / 10) % 360,
    computeError: (t, g) => circularDistanceDeg(t as number, g as number),
    halfScoreError: () => 14,
    parseGuess: (raw) => {
      const n = typeof raw === 'number' ? raw : Number(raw);
      return Number.isFinite(n) ? mod(n, 360) : null;
    },
  },
  count: {
    rounds: 5,
    generateTarget: (rng) => ({ n: randInt(rng, 8, 40) }),
    computeError: (t, g) => {
      const n = (t as { n: number }).n;
      const gg = g as number;
      return n <= 0 || gg <= 0 ? Infinity : Math.abs(Math.log2(gg / n));
    },
    halfScoreError: () => 0.17,
    parseGuess: (raw) => {
      const n = typeof raw === 'number' ? raw : Number(raw);
      if (!Number.isFinite(n)) return null;
      const r = Math.round(n);
      return r >= 1 && r <= 999 ? r : null;
    },
  },
  hue: {
    rounds: 5,
    generateTarget: (rng) => {
      const h = uniform(rng, 0, 360);
      return { l: uniform(rng, 0.6, 0.78), c: uniform(rng, 0.13, 0.2), h };
    },
    computeError: (t, g) => {
      const tt = t as { l: number; c: number; h: number };
      const gg = g as { h: number; s: number; v: number };
      const fitted = clampChroma({ mode: 'oklch', l: tt.l, c: tt.c, h: tt.h }, 'oklch');
      const tl = toLab(fitted);
      const gl = toLab({ mode: 'hsv', h: gg.h, s: gg.s / 100, v: gg.v / 100 });
      if (!tl || !gl) return Infinity;
      return ciede2000(tl.l, tl.a, tl.b, gl.l, gl.a, gl.b);
    },
    halfScoreError: () => 12,
    parseGuess: (raw) => {
      if (typeof raw !== 'object' || raw === null) return null;
      const o = raw as Record<string, unknown>;
      const h = Number(o.h);
      const s = Number(o.s);
      const v = Number(o.v);
      if (![h, s, v].every(Number.isFinite)) return null;
      if (s < 0 || s > 100 || v < 0 || v > 100) return null;
      return { h: ((h % 360) + 360) % 360, s, v };
    },
  },
  spot: {
    rounds: 5,
    generateTarget: (rng) => ({ x: uniform(rng, 0.08, 0.92), y: uniform(rng, 0.08, 0.92) }),
    computeError: (t, g) => {
      const tt = t as { x: number; y: number };
      const gg = g as { x: number; y: number };
      return Math.hypot(tt.x - gg.x, tt.y - gg.y);
    },
    halfScoreError: () => 0.12,
    parseGuess: (raw) => {
      if (typeof raw !== 'object' || raw === null) return null;
      const o = raw as Record<string, unknown>;
      const x = Number(o.x);
      const y = Number(o.y);
      if (![x, y].every(Number.isFinite)) return null;
      if (x < 0 || x > 1 || y < 0 || y > 1) return null;
      return { x, y };
    },
  },
};

function isGameId(v: string): v is GameId {
  return (
    v === 'tempo' ||
    v === 'hue' ||
    v === 'pitch' ||
    v === 'count' ||
    v === 'angle' ||
    v === 'spot'
  );
}

export type RecomputeResult =
  | { ok: true; total: number; rounds: { error: number; score: number }[] }
  | { ok: false; reason: string };

export function recomputeScore(input: {
  gameId: string;
  mode: string;
  seed: string;
  guesses: unknown[];
}): RecomputeResult {
  const { gameId, mode, seed, guesses } = input;
  if (typeof gameId !== 'string' || !isGameId(gameId)) return { ok: false, reason: 'invalid_game' };
  if (mode !== 'easy') return { ok: false, reason: 'invalid_mode' };
  if (typeof seed !== 'string' || seed.length === 0 || seed.length > 80)
    return { ok: false, reason: 'invalid_seed' };
  const game = GAMES[gameId];
  if (!Array.isArray(guesses) || guesses.length !== game.rounds)
    return { ok: false, reason: 'invalid_rounds' };

  const rounds: { error: number; score: number }[] = [];
  for (let r = 0; r < game.rounds; r++) {
    const parsed = game.parseGuess(guesses[r]);
    if (parsed === null || parsed === undefined) return { ok: false, reason: `invalid_guess_${r}` };
    const rng = rngFromSeed(roundSeedString(seed, gameId, 'easy', r));
    const target = game.generateTarget(rng);
    const error = game.computeError(target, parsed);
    rounds.push({ error, score: scoreRound(error, game.halfScoreError()) });
  }
  return { ok: true, total: totalScore(rounds.map((x) => x.score)), rounds };
}
