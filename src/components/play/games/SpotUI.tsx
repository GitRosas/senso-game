'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { Button } from '@/components/ui/Button';
import { spot, type SpotGuess, type SpotTarget } from '@/games/spot';
import { vibrate } from '@/lib/haptics';
import { clamp } from '@/lib/utils';

function Field({
  children,
  className = 'w-[min(82vw,440px)]',
  cursorNone = false,
}: {
  children: React.ReactNode;
  className?: string;
  cursorNone?: boolean;
}) {
  return (
    <div
      style={cursorNone ? { cursor: 'none' } : undefined}
      className={`relative aspect-square ${className} touch-none overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-surface`}
    >
      {/* faint grid for spatial reference */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(var(--fg)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--fg)) 1px, transparent 1px)',
          backgroundSize: '25% 25%',
        }}
      />
      {children}
    </div>
  );
}

function Marker({ x, y, variant }: { x: number; y: number; variant: 'target' | 'guess' }) {
  const style = { left: `${x * 100}%`, top: `${y * 100}%` };
  return (
    <span
      aria-hidden
      style={style}
      className={
        variant === 'target'
          ? 'absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_24px_6px_rgb(var(--accent)/0.7)]'
          : 'absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-fg bg-fg/20'
      }
    />
  );
}

function SpotStimulus({ target, mode, onDone }: StimulusProps) {
  const t = useTranslations('Play');
  const tgt = target as SpotTarget;
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = setTimeout(() => setShow(true), 200);
    const off = setTimeout(() => setShow(false), 200 + spot.studyMs(mode));
    const done = setTimeout(() => onDone(), 200 + spot.studyMs(mode) + 350);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
      clearTimeout(done);
    };
  }, [mode, onDone]);

  return (
    <div style={{ cursor: 'none' }} className="flex h-full w-full flex-col items-center justify-center gap-5">
      <Field cursorNone>{show && <Marker x={tgt.x} y={tgt.y} variant="target" />}</Field>
      <p className="text-sm uppercase tracking-widest text-muted">{t('spotStudyHint')}</p>
    </div>
  );
}

function SpotInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<SpotGuess>({ x: 0.5, y: 0.5 });
  const [placed, setPlaced] = useState(false);
  const dragging = useRef(false);

  const fromPointer = useCallback((clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: clamp((clientX - rect.left) / rect.width, 0, 1),
      y: clamp((clientY - rect.top) / rect.height, 0, 1),
    });
    setPlaced(true);
  }, []);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col items-center justify-center gap-5 px-4">
      <p className="text-center text-sm text-muted">{t('spotRecallHint')}</p>
      <div
        ref={ref}
        role="application"
        aria-label={t('spotRecallHint')}
        tabIndex={0}
        style={{ cursor: 'crosshair' }}
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
          const step = e.shiftKey ? 0.05 : 0.02;
          const moves: Record<string, [number, number]> = {
            ArrowRight: [step, 0],
            ArrowLeft: [-step, 0],
            ArrowDown: [0, step],
            ArrowUp: [0, -step],
          };
          const m = moves[e.key];
          if (m) {
            e.preventDefault();
            setPlaced(true);
            setPos((p) => ({ x: clamp(p.x + m[0], 0, 1), y: clamp(p.y + m[1], 0, 1) }));
          }
        }}
      >
        {/* Click or tap to drop your marker, then drag to fine-tune. */}
        <Field>
          {placed ? (
            <Marker x={pos.x} y={pos.y} variant="guess" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted">
              {t('spotTapHint')}
            </span>
          )}
        </Field>
      </div>
      <Button
        size="lg"
        disabled={!placed}
        onClick={() => {
          vibrate(15);
          onSubmit(pos);
        }}
      >
        {t('lockIn')}
      </Button>
    </div>
  );
}

function SpotReview({ target, guess, mode, compact }: ReviewProps) {
  const tt = target as SpotTarget;
  const gg = guess as SpotGuess;
  const dist = spot.computeError(tt, gg, mode);
  const size = compact ? 'w-24' : 'w-40';
  return (
    <ReviewLayout
      compact={compact}
      targetNode={
        <Field className={size}>
          <Marker x={tt.x} y={tt.y} variant="target" />
        </Field>
      }
      guessNode={
        <Field className={size}>
          <Marker x={gg.x} y={gg.y} variant="guess" />
        </Field>
      }
      delta={`Δ ${(dist * 100).toFixed(1)}%`}
    />
  );
}

export const spotUI: GameUI = {
  Stimulus: SpotStimulus,
  Input: SpotInput,
  Review: SpotReview,
};
