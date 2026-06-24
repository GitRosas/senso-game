/**
 * Core game-engine abstraction. Every game implements one interface; the rest of
 * the app (player loop, leaderboard, sitemap, anti-cheat) iterates a single
 * registry. All methods here are PURE — no DOM, no audio, no Date.now / Math.random.
 */

export type GameId = 'tempo' | 'hue' | 'pitch' | 'count' | 'angle' | 'spot';

/**
 * Difficulty mode. Senso ships a single, finely-tuned difficulty — the `Mode`
 * type is retained (always `'easy'`) so seeds, the DB column and leaderboards
 * stay stable, but no difficulty is exposed in the UI.
 */
export type Mode = 'easy';

export const MODES: readonly Mode[] = ['easy'] as const;

export interface Game<TTarget, TGuess> {
  id: GameId;

  /** Pure: same (rng, mode, roundIndex) => same target. NO Date.now / Math.random. */
  generateTarget(rng: () => number, mode: Mode, roundIndex: number): TTarget;

  /** Pure perceptual error in this game's unit (0 = perfect). */
  computeError(target: TTarget, guess: TGuess, mode: Mode): number;

  /** Error (in the same unit) that yields exactly 5/10. Tunable per mode. */
  halfScoreError(mode: Mode): number;

  /** Number of rounds in a session (always 5 in v1). */
  rounds: number;

  /** How long the stimulus is shown/played, in milliseconds. */
  studyMs(mode: Mode): number;

  /**
   * Validate & normalize a raw guess (e.g. from JSON over the wire).
   * Returns null when malformed or out of the game's valid range.
   * Used by the anti-cheat Edge Function and client submission guard.
   */
  parseGuess(raw: unknown, mode: Mode): TGuess | null;
}

/** Per-round outcome held in memory during play and surfaced on the result screen. */
export interface RoundResult<TTarget = unknown, TGuess = unknown> {
  roundIndex: number;
  target: TTarget;
  guess: TGuess;
  /** Error in the game's native unit. */
  error: number;
  /** 0.00–10.00 */
  score: number;
}

/**
 * Type-erased view of a game, used by registry consumers that handle an unknown
 * game generically (player loop, submission recompute). Targets/guesses are opaque
 * values passed straight through between generate → render → score.
 */
export interface ErasedGame {
  id: GameId;
  generateTarget(rng: () => number, mode: Mode, roundIndex: number): unknown;
  computeError(target: unknown, guess: unknown, mode: Mode): number;
  halfScoreError(mode: Mode): number;
  rounds: number;
  studyMs(mode: Mode): number;
  parseGuess(raw: unknown, mode: Mode): unknown;
}

/** Register a concrete game as an erased one with a single, contained cast. */
export function eraseGame<T, G>(game: Game<T, G>): ErasedGame {
  return game as unknown as ErasedGame;
}
