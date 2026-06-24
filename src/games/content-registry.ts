import type { GameId } from './engine/types';
import type { LocalizedGameContent } from './content-types';
import { tempoContent } from './tempo/content';
import { hueContent } from './hue/content';
import { pitchContent } from './pitch/content';
import { countContent } from './count/content';
import { angleContent } from './angle/content';
import { spotContent } from './spot/content';

export const GAME_CONTENT: Record<GameId, LocalizedGameContent> = {
  tempo: tempoContent,
  hue: hueContent,
  pitch: pitchContent,
  count: countContent,
  angle: angleContent,
  spot: spotContent,
};
