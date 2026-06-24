'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { GameId, Mode } from '@/games/engine/types';
import { totalScore, MAX_TOTAL } from '@/games/engine/scoring';
import { GAME_GLYPHS, SITE_URL } from '@/config';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { GAME_UI } from '@/components/play/ui-registry';
import { ShareCard } from '@/components/ShareCard';
import { AdSlot } from '@/components/AdSlot';
import { submitResult } from '@/lib/leaderboard';
import { getBest } from '@/lib/local-scores';
import { getDisplayName, setDisplayName } from '@/lib/identity';
import type { RoundOutcome } from '@/components/play/types';

function CountUp({ value }: { value: number }) {
  const reduced = useReducedMotion();
  const [n, setN] = useState(reduced ? value : 0);
  useEffect(() => {
    if (reduced) {
      setN(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 900;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);
  return <span className="tabular">{n.toFixed(1)}</span>;
}

function band(total: number): 'bandPerfect' | 'bandGreat' | 'bandGood' | 'bandOk' | 'bandHumble' {
  if (total >= 47) return 'bandPerfect';
  if (total >= 40) return 'bandGreat';
  if (total >= 33) return 'bandGood';
  if (total >= 25) return 'bandOk';
  return 'bandHumble';
}

export function ResultScreen({
  gameId,
  mode,
  seed,
  isDaily,
  dailyDate,
  outcomes,
  onPlayAgain,
}: {
  gameId: GameId;
  mode: Mode;
  seed: string;
  isDaily: boolean;
  dailyDate?: string;
  outcomes: RoundOutcome[];
  onPlayAgain?: () => void;
}) {
  const t = useTranslations('Result');
  const tg = useTranslations('Games');
  const tShare = useTranslations('Share');
  const { toast } = useToast();
  const locale = useLocale();
  const Review = GAME_UI[gameId].Review;

  const total = useMemo(() => totalScore(outcomes.map((o) => o.score)), [outcomes]);
  const gameName = tg(`${gameId}.name`);

  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const [source, setSource] = useState<'global' | 'local' | null>(null);
  const [isBest, setIsBest] = useState(false);

  useEffect(() => {
    setName(getDisplayName());
    const prevBest = getBest(gameId, mode);
    setIsBest(prevBest === null || total >= prevBest);
  }, [gameId, mode, total]);

  const shareUrl = `${SITE_URL}/${locale}/play/${gameId}/play?c=${encodeURIComponent(seed)}&mode=${mode}`;
  const shareText = tShare(gameId, { score: Math.round(total) });

  const onSubmit = async () => {
    setSubmitting(true);
    try {
      if (name) setDisplayName(name);
      const res = await submitResult({
        gameId,
        mode,
        seed,
        isDaily,
        dailyDate,
        guesses: outcomes.map((o) => o.guess),
        displayName: name,
      });
      setRank(res.rank);
      setSource(res.source);
      toast(t('submitted'), 'success');
    } catch {
      toast(t('submitted'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const copyChallenge = async () => {
    await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
    toast(tShare('linkCopied'), 'success');
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10" data-testid="result-screen">
      <header className="text-center">
        <div className="text-4xl" aria-hidden>
          {GAME_GLYPHS[gameId]}
        </div>
        <h1 className="mt-2 text-sm uppercase tracking-widest text-muted">
          {gameName} · {t('title')}
        </h1>
        <div className="mt-3 flex items-end justify-center gap-2">
          <span className="text-7xl font-extrabold text-accent drop-shadow-[0_0_30px_rgb(var(--accent)/0.45)]">
            <CountUp value={total} />
          </span>
          <span className="mb-2 text-2xl text-muted">/ {MAX_TOTAL}</span>
        </div>
        <p className="mt-2 text-lg text-fg">{t(band(total))}</p>
        {isBest && <p className="mt-1 text-sm font-semibold text-accent">{t('newScoreBest')}</p>}
      </header>

      {/* Submit */}
      <section className="mt-8 rounded-lg border border-border bg-surface p-4">
        {rank === null ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="mb-1 block text-muted">{t('enterName')}</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('namePlaceholder')}
                maxLength={24}
                className="h-11 w-full rounded-md border border-border bg-bg px-3 outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </label>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? t('submitting') : t('submit')}
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold">
              {source === 'global' ? t('yourRank', { rank: rank ?? 0 }) : t('localRank')}
            </p>
            {source === 'local' && <p className="mt-1 text-xs text-muted">{t('offlineNote')}</p>}
            {isDaily && <p className="mt-1 text-xs text-muted">{t('alreadyDaily')}</p>}
            <Link
              href={`/leaderboard/${gameId}`}
              className="mt-3 inline-block text-sm font-semibold text-accent underline underline-offset-2"
            >
              {t('viewLeaderboard')}
            </Link>
          </div>
        )}
      </section>

      {/* Share */}
      <section className="mt-6">
        <ShareCard
          gameId={gameId}
          gameName={gameName}
          total={total}
          scores={outcomes.map((o) => o.score)}
          shareText={shareText}
          shareUrl={shareUrl}
        />
      </section>

      {/* Per-round breakdown */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm uppercase tracking-widest text-muted">{t('perRound')}</h2>
        <ol className="space-y-3">
          {outcomes.map((o) => (
            <li
              key={o.roundIndex}
              className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3"
            >
              <span className="w-6 shrink-0 text-center text-sm font-bold text-muted">
                {o.roundIndex + 1}
              </span>
              <div className="flex-1">
                <Review target={o.target} guess={o.guess} mode={mode} compact />
              </div>
              <span className="tabular w-16 shrink-0 text-right text-lg font-bold text-accent">
                {o.score.toFixed(1)}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Actions */}
      <section className="mt-8 flex flex-wrap justify-center gap-3">
        {onPlayAgain && <Button onClick={onPlayAgain}>{t('playAgain')}</Button>}
        <Button variant="outline" onClick={copyChallenge}>
          {t('challenge')}
        </Button>
        <Link
          href={`/play/${gameId}/play?daily=1&mode=${mode}`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-surface-2"
        >
          {t('playDaily')}
        </Link>
      </section>

      <div className="mt-10">
        <AdSlot />
      </div>
    </div>
  );
}
