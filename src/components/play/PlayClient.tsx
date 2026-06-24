'use client';

import { useCallback, useEffect, useState } from 'react';
import type { GameId, Mode } from '@/games/engine/types';
import { randomSeed } from '@/games/engine/seed';
import { GamePlayer } from './GamePlayer';

export function PlayClient({
  gameId,
  mode,
  initialSeed,
  isDaily,
  dailyDate,
}: {
  gameId: GameId;
  mode: Mode;
  initialSeed: string;
  isDaily: boolean;
  dailyDate?: string;
}) {
  const [seed, setSeed] = useState(initialSeed);
  const [daily, setDaily] = useState(isDaily);
  const [instance, setInstance] = useState(0);

  // Practice mode: generate a fresh seed on the client to avoid SSR mismatch.
  useEffect(() => {
    if (!seed) setSeed(randomSeed());
  }, [seed]);

  const restart = useCallback(() => {
    setSeed(randomSeed());
    setDaily(false);
    setInstance((i) => i + 1);
  }, []);

  if (!seed) return null;

  return (
    <GamePlayer
      key={`${seed}:${instance}`}
      gameId={gameId}
      mode={mode}
      seed={seed}
      isDaily={daily}
      dailyDate={daily ? dailyDate : undefined}
      onPlayAgain={restart}
    />
  );
}
