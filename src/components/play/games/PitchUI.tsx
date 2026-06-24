'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { Button } from '@/components/ui/Button';
import { pitch, erbRate, type PitchGuess, type PitchTarget } from '@/games/pitch';
import { playTone, type ToneHandle } from '@/lib/audio';
import { vibrate } from '@/lib/haptics';
import { clamp, cn } from '@/lib/utils';

const FMIN = 60;
const FMAX = 2000;

function freqFromFraction(frac: number): number {
  return Math.exp(Math.log(FMIN) + clamp(frac, 0, 1) * (Math.log(FMAX) - Math.log(FMIN)));
}
function fractionFromFreq(f: number): number {
  return (Math.log(f) - Math.log(FMIN)) / (Math.log(FMAX) - Math.log(FMIN));
}

function PitchStimulus({ target, mode, onDone }: StimulusProps) {
  const t = useTranslations('Play');
  useEffect(() => {
    const dur = pitch.studyMs(mode);
    const handle = playTone(target as PitchTarget, { durationMs: dur });
    const done = setTimeout(onDone, dur + 400);
    return () => {
      handle?.stop();
      clearTimeout(done);
    };
  }, [target, mode, onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inline-flex h-24 w-24 animate-ping rounded-full bg-accent/30" />
        <span className="relative text-5xl" aria-hidden>
          🎵
        </span>
      </div>
      <p className="text-sm uppercase tracking-widest text-muted">{t('listen')}</p>
      <p className="text-xs text-muted">🎧 {t('pitchHeadphones')}</p>
    </div>
  );
}

function PitchInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const trackRef = useRef<HTMLDivElement>(null);
  const toneRef = useRef<ToneHandle | null>(null);
  const [frac, setFrac] = useState(fractionFromFreq(300));
  const [dragging, setDragging] = useState(false);

  const freq = freqFromFraction(frac);

  const updateFromClientY = useCallback((clientY: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rel = clamp((clientY - rect.top) / rect.height, 0, 1);
    setFrac(1 - rel);
  }, []);

  // Keep the sustained tone's frequency in sync with the slider.
  useEffect(() => {
    if (toneRef.current) toneRef.current.setFrequency(freqFromFraction(frac));
  }, [frac]);

  // Stop the tone if the player leaves the round.
  useEffect(() => () => toneRef.current?.stop(), []);

  const startTone = () => {
    if (!toneRef.current) toneRef.current = playTone(freqFromFraction(frac), { gain: 0.16 });
  };
  const stopTone = () => {
    toneRef.current?.stop();
    toneRef.current = null;
  };

  const begin = (clientY: number) => {
    setDragging(true);
    startTone();
    updateFromClientY(clientY);
  };
  const move = (clientY: number) => {
    if (!dragging) return;
    updateFromClientY(clientY);
  };
  // Release keeps the tone playing — it only stops on Lock in (or leaving).
  const end = () => setDragging(false);

  const nudge = (deltaErb: number) => {
    startTone();
    const newErb = erbRate(freq) + deltaErb;
    // invert erbRate: f = ((10^(erb/21.4)) - 1) / 0.00437
    const f = (Math.pow(10, newErb / 21.4) - 1) / 0.00437;
    setFrac(fractionFromFreq(clamp(f, FMIN, FMAX)));
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <div className="tabular text-5xl font-extrabold text-accent" aria-live="polite">
          {Math.round(freq)}
          <span className="ml-1 text-2xl text-muted">Hz</span>
        </div>
        <p className="mt-1 text-sm text-muted">{t('pitchRecallHint')}</p>
      </div>

      <div className="flex items-stretch gap-3">
        <div className="flex select-none flex-col justify-between py-1 text-xl text-muted" aria-hidden>
          <span>▲</span>
          <span>▼</span>
        </div>
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-label={t('pitchDrag')}
          aria-valuemin={FMIN}
          aria-valuemax={FMAX}
          aria-valuenow={Math.round(freq)}
          aria-valuetext={`${Math.round(freq)} Hz`}
          className="no-select relative h-72 w-28 cursor-ns-resize touch-none overflow-hidden rounded-2xl border border-border bg-gradient-to-t from-surface-2 to-accent/15"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            begin(e.clientY);
          }}
          onPointerMove={(e) => move(e.clientY)}
          onPointerUp={end}
          onPointerCancel={end}
          onKeyDown={(e) => {
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              nudge(e.shiftKey ? 1 : 0.3);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              nudge(e.shiftKey ? -1 : -0.3);
            }
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-accent/45 to-accent/5"
            style={{ height: `${frac * 100}%` }}
            aria-hidden
          />
          <div
            className={cn(
              'absolute inset-x-2 h-4 -translate-y-1/2 rounded-full bg-accent transition-shadow',
              dragging
                ? 'shadow-[0_0_28px_8px_rgb(var(--accent)/0.7)]'
                : 'shadow-[0_0_14px_3px_rgb(var(--accent)/0.45)]',
            )}
            style={{ top: `${(1 - frac) * 100}%` }}
            aria-hidden
          />
        </div>
      </div>

      <Button
        size="lg"
        onClick={() => {
          stopTone();
          setDragging(false);
          vibrate(15);
          onSubmit(Math.round(freq));
        }}
      >
        {t('lockIn')}
      </Button>
    </div>
  );
}

function PitchReview({ target, guess, compact }: ReviewProps) {
  const tt = target as PitchTarget;
  const gg = guess as PitchGuess;
  return (
    <ReviewLayout
      compact={compact}
      targetNode={<span className="tabular text-2xl font-bold">{Math.round(tt)} Hz</span>}
      guessNode={<span className="tabular text-2xl font-bold">{Math.round(gg)} Hz</span>}
      delta={`Δ ${Math.abs(erbRate(gg) - erbRate(tt)).toFixed(2)} ERB`}
    />
  );
}

export const pitchUI: GameUI = {
  Stimulus: PitchStimulus,
  Input: PitchInput,
  Review: PitchReview,
};
