'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { Button } from '@/components/ui/Button';
import { angle, circularDistanceDeg, type AngleGuess, type AngleTarget } from '@/games/angle';
import { mod } from '@/games/engine/math';
import { vibrate } from '@/lib/haptics';

function Dial({
  deg,
  size = 220,
  showTicks = false,
  showNeedle = true,
  color = 'rgb(var(--accent))',
}: {
  deg: number;
  size?: number;
  showTicks?: boolean;
  showNeedle?: boolean;
  color?: string;
}) {
  const rad = (deg * Math.PI) / 180;
  const L = 44;
  const x2 = 60 + L * Math.sin(rad);
  const y2 = 60 - L * Math.cos(rad);
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
      <circle cx="60" cy="60" r="50" fill="rgb(var(--surface-2))" stroke="rgb(var(--border))" />
      {showTicks &&
        Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={60 + 46 * Math.sin(a)}
              y1={60 - 46 * Math.cos(a)}
              x2={60 + 50 * Math.sin(a)}
              y2={60 - 50 * Math.cos(a)}
              stroke="rgb(var(--muted))"
              strokeWidth="1.5"
            />
          );
        })}
      {showNeedle && (
        <>
          <line x1="60" y1="60" x2={x2} y2={y2} stroke={color} strokeWidth="4" strokeLinecap="round" />
          <circle cx={x2} cy={y2} r="5" fill={color} />
        </>
      )}
      <circle cx="60" cy="60" r="4" fill="rgb(var(--fg))" />
    </svg>
  );
}

function AngleStimulus({ target, mode, onDone }: StimulusProps) {
  const t = useTranslations('Play');
  const deg = target as AngleTarget;
  const [show, setShow] = useState(true);

  useEffect(() => {
    const off = setTimeout(() => setShow(false), angle.studyMs(mode));
    const done = setTimeout(() => onDone(), angle.studyMs(mode) + 350);
    return () => {
      clearTimeout(off);
      clearTimeout(done);
    };
  }, [mode, onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <Dial deg={deg} showNeedle={show} showTicks={mode === 'easy'} />
      <p className="text-sm uppercase tracking-widest text-muted">{t('angleStudyHint')}</p>
    </div>
  );
}

function AngleInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const ref = useRef<HTMLDivElement>(null);
  const [deg, setDeg] = useState(0);
  const dragging = useRef(false);

  const fromPointer = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    setDeg(mod((Math.atan2(dx, -dy) * 180) / Math.PI, 360));
  }, []);

  return (
    <div className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center gap-5 px-4">
      <p className="text-center text-sm text-muted">{t('angleRecallHint')}</p>
      <div
        ref={ref}
        role="slider"
        tabIndex={0}
        aria-label={t('angleRecallHint')}
        aria-valuemin={0}
        aria-valuemax={360}
        aria-valuenow={Math.round(deg)}
        className="no-select touch-none rounded-full outline-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          dragging.current = true;
          fromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (dragging.current) fromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            setDeg((d) => mod(d + (e.shiftKey ? 5 : 1), 360));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            setDeg((d) => mod(d - (e.shiftKey ? 5 : 1), 360));
          }
        }}
      >
        <Dial deg={deg} />
      </div>
      <div className="tabular text-3xl font-bold text-accent" aria-live="polite">
        {Math.round(deg)}°
      </div>
      <Button
        size="lg"
        onClick={() => {
          vibrate(15);
          onSubmit(Math.round(deg * 10) / 10);
        }}
      >
        {t('lockIn')}
      </Button>
    </div>
  );
}

function AngleReview({ target, guess, compact }: ReviewProps) {
  const tt = target as AngleTarget;
  const gg = guess as AngleGuess;
  const d = circularDistanceDeg(tt, gg);
  return (
    <ReviewLayout
      compact={compact}
      targetNode={
        <div className="flex flex-col items-center">
          <Dial deg={tt} size={compact ? 72 : 96} />
          <span className="tabular text-sm font-semibold">{Math.round(tt)}°</span>
        </div>
      }
      guessNode={
        <div className="flex flex-col items-center">
          <Dial deg={gg} size={compact ? 72 : 96} color="rgb(var(--fg))" />
          <span className="tabular text-sm font-semibold">{Math.round(gg)}°</span>
        </div>
      }
      delta={`Δ ${d.toFixed(1)}°`}
    />
  );
}

export const angleUI: GameUI = {
  Stimulus: AngleStimulus,
  Input: AngleInput,
  Review: AngleReview,
};
