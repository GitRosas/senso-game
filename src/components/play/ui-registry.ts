import type { GameId } from '@/games/engine/types';
import type { GameUI } from './types';
import { tempoUI } from './games/TempoUI';
import { hueUI } from './games/HueUI';
import { pitchUI } from './games/PitchUI';
import { countUI } from './games/CountUI';
import { angleUI } from './games/AngleUI';
import { spotUI } from './games/SpotUI';

export const GAME_UI: Record<GameId, GameUI> = {
  tempo: tempoUI,
  hue: hueUI,
  pitch: pitchUI,
  count: countUI,
  angle: angleUI,
  spot: spotUI,
};
