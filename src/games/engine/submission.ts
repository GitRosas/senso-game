// server-side score recomputation - regenerates targets from (gameId, mode, seed, guesses),
// never trusts the client total. runs in both the edge function and unit tests.
import type { Mode } from './types';
import { GAMES, isGameId } from './registry';
import { rngFromSeed } from './rng';
import { roundSeedString } from './seed';
import { scoreRound, totalScore } from './scoring';

export interface RecomputedRound {
  error: number;
  score: number;
}

export type RecomputeResult =
  | { ok: true; gameId: string; mode: Mode; total: number; rounds: RecomputedRound[] }
  | { ok: false; reason: string };

export interface SubmissionInput {
  gameId: string;
  mode: string;
  seed: string;
  guesses: unknown[];
}

export function recomputeScore(input: SubmissionInput): RecomputeResult {
  const { gameId, mode, seed } = input;

  if (typeof gameId !== 'string' || !isGameId(gameId)) {
    return { ok: false, reason: 'invalid_game' };
  }
  if (mode !== 'easy') {
    return { ok: false, reason: 'invalid_mode' };
  }
  if (typeof seed !== 'string' || seed.length === 0 || seed.length > 80) {
    return { ok: false, reason: 'invalid_seed' };
  }

  const game = GAMES[gameId];
  const guesses = input.guesses;
  if (!Array.isArray(guesses) || guesses.length !== game.rounds) {
    return { ok: false, reason: 'invalid_rounds' };
  }

  const rounds: RecomputedRound[] = [];
  for (let r = 0; r < game.rounds; r++) {
    const parsed = game.parseGuess(guesses[r], mode);
    if (parsed === null || parsed === undefined) {
      return { ok: false, reason: `invalid_guess_${r}` };
    }
    const rng = rngFromSeed(roundSeedString(seed, gameId, mode, r));
    const target = game.generateTarget(rng, mode, r);
    const error = game.computeError(target, parsed, mode);
    rounds.push({ error, score: scoreRound(error, game.halfScoreError(mode)) });
  }

  return {
    ok: true,
    gameId,
    mode: mode as Mode,
    total: totalScore(rounds.map((x) => x.score)),
    rounds,
  };
}
