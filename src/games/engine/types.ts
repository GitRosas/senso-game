// Every game implements this one interface; the player loop, leaderboard,
// sitemap and anti-cheat all iterate a single registry. All methods are pure
// (no DOM, no audio, no Date.now / Math.random).

export type GameId = 'tempo' | 'hue' | 'pitch' | 'count' | 'angle' | 'spot';

// Senso ships a single difficulty. `Mode` stays (always 'easy') so seeds, the
// DB column and leaderboards keep their shape, but nothing is exposed in the UI.
export type Mode = 'easy';

export const MODES: readonly Mode[] = ['easy'] as const;

export interface Game<TTarget, TGuess> {
  id: GameId;

  // Same (rng, mode, roundIndex) => same target.
  generateTarget(rng: () => number, mode: Mode, roundIndex: number): TTarget;

  // Perceptual error in this game's unit (0 = perfect).
  computeError(target: TTarget, guess: TGuess, mode: Mode): number;

  // Error that yields exactly 5/10.
  halfScoreError(mode: Mode): number;

  rounds: number;

  // How long the stimulus is shown/played, in ms.
  studyMs(mode: Mode): number;

  // Validate/normalize a raw guess (e.g. from JSON). null if invalid/out of range.
  parseGuess(raw: unknown, mode: Mode): TGuess | null;
}

// Type-erased view used by code that handles an unknown game generically
// (player loop, anti-cheat). Targets/guesses are opaque values passed straight
// through between generate -> render -> score.
export interface ErasedGame {
  id: GameId;
  generateTarget(rng: () => number, mode: Mode, roundIndex: number): unknown;
  computeError(target: unknown, guess: unknown, mode: Mode): number;
  halfScoreError(mode: Mode): number;
  rounds: number;
  studyMs(mode: Mode): number;
  parseGuess(raw: unknown, mode: Mode): unknown;
}

export function eraseGame<T, G>(game: Game<T, G>): ErasedGame {
  return game as unknown as ErasedGame;
}
