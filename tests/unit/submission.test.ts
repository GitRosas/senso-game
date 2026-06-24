import { describe, it, expect } from 'vitest';
import { recomputeScore } from '@/games/engine/submission';
import { GAMES } from '@/games/engine/registry';
import { rngFromSeed } from '@/games/engine/rng';
import { roundSeedString } from '@/games/engine/seed';
import { scoreRound } from '@/games/engine/scoring';
import type { GameId, Mode } from '@/games/engine/types';
import type { CountTarget } from '@/games/count';

/** Mirror of what the client computes, used to prove server == client. */
function clientCompute(gameId: GameId, mode: Mode, seed: string, guesses: unknown[]) {
  const game = GAMES[gameId];
  const rounds = guesses.map((g, r) => {
    const rng = rngFromSeed(roundSeedString(seed, gameId, mode, r));
    const target = game.generateTarget(rng, mode, r);
    const parsed = game.parseGuess(g, mode);
    const error = game.computeError(target, parsed, mode);
    return { error, score: scoreRound(error, game.halfScoreError(mode)) };
  });
  return rounds;
}

function perfectGuesses(gameId: GameId, mode: Mode, seed: string): unknown[] {
  const game = GAMES[gameId];
  return Array.from({ length: game.rounds }, (_, r) => {
    const rng = rngFromSeed(roundSeedString(seed, gameId, mode, r));
    const target = game.generateTarget(rng, mode, r);
    if (gameId === 'count') return (target as CountTarget).n;
    return target;
  });
}

describe('recomputeScore', () => {
  it('awards a perfect 50 for exact guesses (numeric games)', () => {
    for (const gameId of ['tempo', 'pitch', 'angle', 'count'] as GameId[]) {
      const seed = `perfect-${gameId}`;
      const guesses = perfectGuesses(gameId, 'easy', seed);
      const result = recomputeScore({ gameId, mode: 'easy', seed, guesses });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.total).toBe(50);
        expect(result.rounds.every((r) => r.score === 10)).toBe(true);
      }
    }
  });

  it('matches the client computation for arbitrary guesses', () => {
    const seed = 'XyZ123';
    const guesses = [0.8, 1.5, 2.2, 0.6, 3.1];
    const server = recomputeScore({ gameId: 'tempo', mode: 'easy', seed, guesses });
    const client = clientCompute('tempo', 'easy', seed, guesses);
    expect(server.ok).toBe(true);
    if (server.ok) {
      expect(server.rounds).toEqual(client);
    }
  });

  it('rejects the wrong number of rounds', () => {
    const result = recomputeScore({ gameId: 'tempo', mode: 'easy', seed: 's', guesses: [1, 2, 3] });
    expect(result).toEqual({ ok: false, reason: 'invalid_rounds' });
  });

  it('rejects unknown games and modes', () => {
    expect(recomputeScore({ gameId: 'nope', mode: 'easy', seed: 's', guesses: [] }).ok).toBe(false);
    expect(
      recomputeScore({ gameId: 'tempo', mode: 'medium', seed: 's', guesses: [1, 1, 1, 1, 1] }).ok,
    ).toBe(false);
  });

  it('rejects out-of-range guesses', () => {
    const result = recomputeScore({
      gameId: 'pitch',
      mode: 'easy',
      seed: 's',
      guesses: [440, 440, 440, 440, 999999],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('invalid_guess_4');
  });

  it('is itself deterministic', () => {
    const args = { gameId: 'angle', mode: 'easy' as const, seed: 'detseed', guesses: [10, 20, 30, 40, 50] };
    expect(recomputeScore(args)).toEqual(recomputeScore(args));
  });
});
