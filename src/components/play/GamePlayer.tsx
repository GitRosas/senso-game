'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { GameId, Mode } from '@/games/engine/types';
import { GAMES } from '@/games/engine/registry';
import { rngFromSeed } from '@/games/engine/rng';
import { roundSeedString } from '@/games/engine/seed';
import { scoreRound } from '@/games/engine/scoring';
import { GAME_ACCENTS, GAME_GLYPHS } from '@/config';
import { hexToRgbChannels, cn } from '@/lib/utils';
import { getAudioContext } from '@/lib/audio';
import { GAME_UI } from './ui-registry';
import type { RoundOutcome } from './types';
import { ResultScreen } from '@/components/ResultScreen';

type Phase = 'ready' | 'study' | 'recall' | 'review' | 'done';

export function GamePlayer({
  gameId,
  mode,
  seed,
  isDaily = false,
  dailyDate,
  onPlayAgain,
}: {
  gameId: GameId;
  mode: Mode;
  seed: string;
  isDaily?: boolean;
  dailyDate?: string;
  onPlayAgain?: () => void;
}) {
  const t = useTranslations('Play');
  const tg = useTranslations('Games');
  const game = GAMES[gameId];
  const ui = GAME_UI[gameId];

  const [phase, setPhase] = useState<Phase>('ready');
  const [round, setRound] = useState(0);
  const [target, setTarget] = useState<unknown>(null);
  const [guess, setGuess] = useState<unknown>(null);
  const [outcomes, setOutcomes] = useState<RoundOutcome[]>([]);

  const genTarget = useCallback(
    (r: number) =>
      game.generateTarget(rngFromSeed(roundSeedString(seed, gameId, mode, r)), mode, r),
    [game, gameId, mode, seed],
  );

  const start = useCallback(() => {
    // The tap is a user gesture — unlock audio for Pitch here.
    if (gameId === 'pitch') getAudioContext();
    setTarget(genTarget(round));
    setPhase('study');
  }, [gameId, genTarget, round]);

  const handleGuess = useCallback(
    (g: unknown) => {
      const error = game.computeError(target, g, mode);
      const score = scoreRound(error, game.halfScoreError(mode));
      setGuess(g);
      setOutcomes((prev) => [...prev, { roundIndex: round, target, guess: g, error, score }]);
      setPhase('review');
    },
    [game, mode, round, target],
  );

  const next = useCallback(() => {
    if (round >= game.rounds - 1) {
      setPhase('done');
      return;
    }
    setRound((r) => r + 1);
    setGuess(null);
    setTarget(null);
    setPhase('ready');
  }, [game.rounds, round]);

  // After the final round's review, glide straight to the results — no button needed.
  const isLastRound = round >= game.rounds - 1;
  useEffect(() => {
    if (phase !== 'review' || !isLastRound) return;
    const id = setTimeout(() => setPhase('done'), 1900);
    return () => clearTimeout(id);
  }, [phase, isLastRound]);

  const accentStyle = { ['--accent' as string]: hexToRgbChannels(GAME_ACCENTS[gameId]) };
  const Review = ui.Review;

  if (phase === 'done') {
    return (
      <ResultScreen
        gameId={gameId}
        mode={mode}
        seed={seed}
        isDaily={isDaily}
        dailyDate={dailyDate}
        outcomes={outcomes}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  return (
    <div
      style={accentStyle}
      className="safe-bottom fixed inset-0 z-50 flex flex-col overflow-hidden overscroll-none bg-bg"
    >
      {/* Top bar */}
      <div className="safe-top flex items-center justify-between px-4 pb-3">
        <Link
          href={`/play/${gameId}`}
          className="rounded-md px-3 py-2 text-sm text-muted hover:text-fg"
        >
          ← {t('exit')}
        </Link>
        <div className="flex items-center gap-1.5" aria-label={t('round', { round: round + 1, total: game.rounds })}>
          {Array.from({ length: game.rounds }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-2 w-2 rounded-full transition',
                i < outcomes.length ? 'bg-accent' : i === round ? 'bg-fg' : 'bg-surface-2',
              )}
            />
          ))}
        </div>
        <span className="w-16" aria-hidden />
      </div>

      {/* Stage */}
      <div className="relative flex-1 overflow-hidden">
        {phase === 'ready' && (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 text-center animate-fade-in">
            <span className="text-5xl" aria-hidden>
              {GAME_GLYPHS[gameId]}
            </span>
            <div>
              <h1 className="text-2xl font-bold">{tg(`${gameId}.name`)}</h1>
              <p className="mt-1 text-muted">{t('round', { round: round + 1, total: game.rounds })}</p>
            </div>
            <button
              type="button"
              onClick={start}
              data-testid="start-round"
              className="min-h-[56px] rounded-lg bg-accent px-10 text-lg font-semibold text-accent-fg shadow-[0_8px_30px_-8px_rgb(var(--accent)/0.6)] transition hover:brightness-110 active:scale-95"
            >
              {round === 0 ? t('tapAnywhere') : t('go')}
            </button>
            <p className="max-w-xs text-sm text-muted">{t(`${gameId}StudyHint`)}</p>
          </div>
        )}

        {target != null && (phase === 'study' || phase === 'recall' || phase === 'review') && (
          <span data-testid="current-target" className="sr-only">
            {JSON.stringify(target)}
          </span>
        )}

        {phase === 'study' && target != null && (
          <ui.Stimulus target={target} mode={mode} onDone={() => setPhase('recall')} />
        )}

        {phase === 'recall' && target != null && (
          <ui.Input target={target} mode={mode} onSubmit={handleGuess} />
        )}

        {phase === 'review' && (
          <div className="flex h-full flex-col items-center justify-center gap-6 px-6 animate-pop-in">
            <div className="text-center">
              <div className="tabular text-6xl font-extrabold text-accent drop-shadow-[0_0_24px_rgb(var(--accent)/0.45)]">
                {(outcomes[outcomes.length - 1]?.score ?? 0).toFixed(1)}
              </div>
              <div className="text-sm text-muted">/ 10</div>
            </div>
            <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-4">
              <Review target={target} guess={guess} mode={mode} />
            </div>
            <button
              type="button"
              onClick={next}
              data-testid="next-round"
              className="min-h-[52px] rounded-lg bg-accent px-8 font-semibold text-accent-fg transition hover:brightness-110"
            >
              {round >= game.rounds - 1 ? t('seeResults') : t('nextRound')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
