import { ImageResponse } from 'next/og';
import { GAME_ACCENTS, GAME_GLYPHS, SITE_NAME } from '@/config';
import { isGameId } from '@/games/engine/registry';
import type { GameId } from '@/games/engine/types';

export const runtime = 'edge';

const NAMES: Record<GameId, string> = {
  tempo: 'Tempo',
  hue: 'Hue',
  pitch: 'Pitch',
  count: 'Count',
  angle: 'Angle',
  spot: 'Spot',
};

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const gameParam = searchParams.get('game') ?? 'tempo';
  const game: GameId = isGameId(gameParam) ? gameParam : 'tempo';
  const mode = searchParams.get('mode') === 'hard' ? 'Hard' : 'Easy';
  const scoreRaw = Number(searchParams.get('score'));
  const score = Number.isFinite(scoreRaw) ? Math.max(0, Math.min(50, scoreRaw)) : null;
  const accent = GAME_ACCENTS[game];

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0b0e14',
          backgroundImage: `radial-gradient(circle at 85% 15%, ${accent}40, #0b0e1400 55%)`,
          color: '#edf0f8',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '999px', background: accent }} />
          <div style={{ fontSize: '40px', fontWeight: 800 }}>{SITE_NAME}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '32px' }}>
          <div style={{ fontSize: '160px', lineHeight: 1 }}>{GAME_GLYPHS[game]}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: '44px', color: '#969fb8' }}>{`${NAMES[game]} · ${mode}`}</div>
            {score !== null ? (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                <div style={{ fontSize: '180px', fontWeight: 800, color: accent, lineHeight: 1 }}>
                  {score.toFixed(1)}
                </div>
                <div style={{ fontSize: '56px', color: '#969fb8', paddingBottom: '24px' }}>/ 50</div>
              </div>
            ) : (
              <div style={{ fontSize: '84px', fontWeight: 800 }}>Can you beat it?</div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '32px', color: '#969fb8' }}>
          Your senses remember less than you think.
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
