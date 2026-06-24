'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { GameUI, InputProps, ReviewProps, StimulusProps } from '../types';
import { ReviewLayout } from '../ReviewLayout';
import { Slider } from '@/components/ui/Slider';
import { Button } from '@/components/ui/Button';
import {
  hue,
  hueGuessToHex,
  hueTargetToHex,
  hueTargetToHsv,
  type HueGuess,
  type HueTarget,
} from '@/games/hue';
import { vibrate } from '@/lib/haptics';

function HueStimulus({ target, mode, onDone }: StimulusProps) {
  const t = useTranslations('Play');
  const color = hueTargetToHex(target as HueTarget);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const off = setTimeout(() => setShow(false), hue.studyMs(mode));
    const done = setTimeout(() => onDone(), hue.studyMs(mode) + 350);
    return () => {
      clearTimeout(off);
      clearTimeout(done);
    };
  }, [mode, onDone]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5">
      <div
        className="h-48 w-48 rounded-2xl shadow-2xl transition-opacity duration-300 sm:h-64 sm:w-64"
        style={{ backgroundColor: show ? color : 'rgb(var(--surface-2))', opacity: show ? 1 : 0.15 }}
        aria-hidden
      />
      <p className="text-sm uppercase tracking-widest text-muted">{t('study')}</p>
    </div>
  );
}

function HueInput({ onSubmit }: InputProps) {
  const t = useTranslations('Play');
  const [g, setG] = useState<HueGuess>({ h: 180, s: 50, v: 60 });
  const preview = hueGuessToHex(g);

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-5 px-4">
      <div className="flex flex-col items-center gap-2">
        <div
          className="h-28 w-28 rounded-2xl shadow-lg"
          style={{ backgroundColor: preview }}
          aria-label={`${t('yourGuess')}: ${preview}`}
        />
        <p className="tabular text-sm text-muted" aria-live="polite">
          H {Math.round(g.h)}° · S {Math.round(g.s)}% · V {Math.round(g.v)}%
        </p>
      </div>
      <div className="space-y-4">
        <Slider
          label={t('hueSliderH')}
          min={0}
          max={360}
          value={g.h}
          onChange={(h) => setG((p) => ({ ...p, h }))}
          valueLabel={`${Math.round(g.h)}°`}
        />
        <Slider
          label={t('hueSliderS')}
          min={0}
          max={100}
          value={g.s}
          onChange={(s) => setG((p) => ({ ...p, s }))}
          valueLabel={`${Math.round(g.s)}%`}
        />
        <Slider
          label={t('hueSliderV')}
          min={0}
          max={100}
          value={g.v}
          onChange={(v) => setG((p) => ({ ...p, v }))}
          valueLabel={`${Math.round(g.v)}%`}
        />
      </div>
      <Button
        size="lg"
        onClick={() => {
          vibrate(15);
          onSubmit(g);
        }}
      >
        {t('lockIn')}
      </Button>
      <p className="text-center text-xs text-muted">{t('hueCvdTip')}</p>
    </div>
  );
}

function Swatch({ color }: { color: string }) {
  return (
    <span
      className="block h-16 w-16 rounded-xl border border-border shadow"
      style={{ backgroundColor: color }}
    />
  );
}

function hsvLine(c: HueGuess): string {
  return `H ${Math.round(c.h)}°  S ${Math.round(c.s)}%  V ${Math.round(c.v)}%`;
}

function HueReview({ target, guess, compact }: ReviewProps) {
  const tt = target as HueTarget;
  const gg = guess as HueGuess;
  const targetHsv = hueTargetToHsv(tt);
  return (
    <ReviewLayout
      compact={compact}
      targetNode={
        <div className="flex flex-col items-center gap-1">
          <Swatch color={hueTargetToHex(tt)} />
          <span className="tabular text-xs text-muted">{hsvLine(targetHsv)}</span>
        </div>
      }
      guessNode={
        <div className="flex flex-col items-center gap-1">
          <Swatch color={hueGuessToHex(gg)} />
          <span className="tabular text-xs text-muted">{hsvLine(gg)}</span>
        </div>
      }
    />
  );
}

export const hueUI: GameUI = {
  Stimulus: HueStimulus,
  Input: HueInput,
  Review: HueReview,
};
