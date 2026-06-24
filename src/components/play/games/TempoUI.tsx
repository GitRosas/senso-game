'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { round2 } from '@/games/engine/math';
import { vibrate } from '@/lib/haptics';
import { cn } from '@/lib/utils';

const HOLD_RING_MAX_S = 6;

function TempoStimulus({ target, onDone }: StimulusProps) {
  const seconds = target as number;
  const t = useTranslations('Play');
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const start = setTimeout(() => setLit(true), 250);
    const off = setTimeout(() => setLit(false), 250 + seconds * 1000);
    const done = setTimeout(() => onDone(), 250 + seconds * 1000 + 450);
    return () => {
      clearTimeout(start);
      clearTimeout(off);
      clearTimeout(done);
    };
  }, [seconds, onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div
        className={cn(
          'h-40 w-40 rounded-3xl transition-all duration-150 sm:h-56 sm:w-56',
          lit
            ? 'scale-105 bg-accent shadow-[0_0_60px_10px_rgb(var(--accent)/0.6)]'
            : 'scale-100 bg-surface-2',
        )}
        aria-hidden
      />
      <p className="text-sm uppercase tracking-widest text-muted" aria-live="polite">
        {t('watch')}
      </p>
    </div>
  );
}

function Ring({ progress }: { progress: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(progress, 1));
  return (
    <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgb(var(--surface-2))" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke="rgb(var(--accent))"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function TempoInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  const doneRef = useRef(false);

  const loop = useCallback(() => {
    const elapsed = (performance.now() - startRef.current) / 1000;
    setProgress(elapsed / HOLD_RING_MAX_S);
    rafRef.current = requestAnimationFrame(loop);
  }, []);

  const begin = useCallback(() => {
    if (holding || doneRef.current) return;
    setHolding(true);
    startRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
  }, [holding, loop]);

  const end = useCallback(() => {
    if (!holding || doneRef.current) return;
    cancelAnimationFrame(rafRef.current);
    const secs = (performance.now() - startRef.current) / 1000;
    setHolding(false);
    doneRef.current = true;
    vibrate(15);
    onSubmit(round2(Math.max(0.05, secs)));
  }, [holding, onSubmit]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <button
      type="button"
      data-testid="tempo-hold"
      className="no-select flex h-full w-full flex-col items-center justify-center gap-6 outline-none"
      onPointerDown={(e) => {
        e.preventDefault();
        begin();
      }}
      onPointerUp={end}
      onPointerLeave={end}
      onKeyDown={(e) => {
        if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
          e.preventDefault();
          begin();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          end();
        }
      }}
      aria-label={t('tempoRecallHint')}
    >
      <div className={cn('transition-transform', holding && 'scale-105')}>
        <Ring progress={progress} />
      </div>
      <p className="max-w-xs text-center text-sm text-muted">
        {holding ? t('tempoHoldNow') : t('tempoPressStart')}
      </p>
    </button>
  );
}

function TempoReview({ target, guess, compact }: ReviewProps) {
  const tt = target as number;
  const gg = guess as number;
  return (
    <ReviewLayout
      compact={compact}
      targetNode={<span className="tabular text-2xl font-bold">{tt.toFixed(2)}s</span>}
      guessNode={<span className="tabular text-2xl font-bold">{gg.toFixed(2)}s</span>}
    />
  );
}

export const tempoUI: GameUI = {
  Stimulus: TempoStimulus,
  Input: TempoInput,
  Review: TempoReview,
};
