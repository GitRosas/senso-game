/**
 * The single source of truth for which games exist and in what order. Home hub,
 * leaderboards, sitemap and anti-cheat all iterate this — adding a 6th game means
 * implementing the Game interface and adding one line here (plus a content file).
 */
import type { ErasedGame, GameId } from './types';
import { eraseGame } from './types';
import { tempo } from '../tempo';
import { hue } from '../hue';
import { pitch } from '../pitch';
import { count } from '../count';
import { angle } from '../angle';
import { spot } from '../spot';

export const GAME_ORDER = [
  'tempo',
  'hue',
  'pitch',
  'count',
  'angle',
  'spot',
] as const satisfies GameId[];

export const GAMES: Record<GameId, ErasedGame> = {
  tempo: eraseGame(tempo),
  hue: eraseGame(hue),
  pitch: eraseGame(pitch),
  count: eraseGame(count),
  angle: eraseGame(angle),
  spot: eraseGame(spot),
};

export function isGameId(value: string): value is GameId {
  return (GAME_ORDER as readonly string[]).includes(value);
}

export function getGame(id: GameId): ErasedGame {
  return GAMES[id];
}

export function listGames(): ErasedGame[] {
  return GAME_ORDER.map((id) => GAMES[id]);
}
