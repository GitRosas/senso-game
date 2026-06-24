'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { Button } from '@/components/ui/Button';
import { count, type CountTarget } from '@/games/count';
import { vibrate } from '@/lib/haptics';
import { clamp } from '@/lib/utils';

function CountStimulus({ target, mode, onDone }: StimulusProps) {
  const t = useTranslations('Play');
  const tgt = target as CountTarget;
  const [phase, setPhase] = useState<'dots' | 'mask'>('dots');

  useEffect(() => {
    const toMask = setTimeout(() => setPhase('mask'), count.studyMs(mode));
    const done = setTimeout(() => onDone(), count.studyMs(mode) + 220);
    return () => {
      clearTimeout(toMask);
      clearTimeout(done);
    };
  }, [mode, onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <div className="relative aspect-square w-[min(80vw,420px)] overflow-hidden rounded-2xl border border-border bg-surface-2">
        {phase === 'dots' ? (
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
            {tgt.dots.map((d, i) => (
              <circle key={i} cx={d.x * 100} cy={d.y * 100} r={d.r * 100} fill="rgb(var(--fg))" />
            ))}
          </svg>
        ) : (
          <div
            className="h-full w-full opacity-80"
            aria-hidden
            style={{
              backgroundImage:
                'repeating-conic-gradient(rgb(var(--fg)) 0% 25%, rgb(var(--surface-2)) 0% 50%)',
              backgroundSize: '14px 14px',
            }}
          />
        )}
      </div>
      <p className="text-sm uppercase tracking-widest text-muted">{t('countStudyHint')}</p>
    </div>
  );
}

function CountInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const [value, setValue] = useState(20);
  const set = (n: number) => setValue(clamp(Math.round(n), 1, 999));
  const SLIDER_MAX = 80;

  return (
    <div className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center gap-7 px-4">
      <label className="text-center text-sm text-muted" htmlFor="count-input">
        {t('countGuessLabel')}
      </label>

      <input
        id="count-input"
        type="number"
        inputMode="numeric"
        min={1}
        max={999}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={t('countGuessLabel')}
        className="tabular w-44 bg-transparent text-center text-7xl font-extrabold text-accent outline-none [appearance:textfield] focus-visible:opacity-80 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <div className="flex w-full items-center gap-4">
        <Button
          variant="outline"
          aria-label="-1"
          onClick={() => set(value - 1)}
          className="h-14 w-14 shrink-0 rounded-full text-2xl"
        >
          −
        </Button>
        <input
          type="range"
          min={1}
          max={SLIDER_MAX}
          value={Math.min(value, SLIDER_MAX)}
          onChange={(e) => set(Number(e.target.value))}
          aria-label={t('countGuessLabel')}
          className="h-3 flex-1 cursor-pointer appearance-none rounded-full bg-surface-2 accent-accent
            [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow
            [&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-accent"
        />
        <Button
          variant="outline"
          aria-label="+1"
          onClick={() => set(value + 1)}
          className="h-14 w-14 shrink-0 rounded-full text-2xl"
        >
          +
        </Button>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={() => {
          vibrate(15);
          onSubmit(value);
        }}
      >
        {t('lockIn')}
      </Button>
    </div>
  );
}

function CountReview({ target, guess, compact }: ReviewProps) {
  const tt = target as CountTarget;
  const gg = guess as number;
  return (
    <ReviewLayout
      compact={compact}
      targetNode={<span className="tabular text-3xl font-bold">{tt.n}</span>}
      guessNode={<span className="tabular text-3xl font-bold">{gg}</span>}
    />
  );
}

export const countUI: GameUI = {
  Stimulus: CountStimulus,
  Input: CountInput,
  Review: CountReview,
};
