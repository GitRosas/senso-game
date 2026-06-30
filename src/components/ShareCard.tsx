'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import type { GameId } from '@/games/engine/types';
import { GAME_ACCENTS, GAME_GLYPHS, SITE_NAME } from '@/config';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

function drawCard(
  canvas: HTMLCanvasElement,
  opts: { gameId: GameId; gameName: string; total: number; scores: number[]; url: string },
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = 1200;
  const H = 630;
  const accent = GAME_ACCENTS[opts.gameId];

  // Background
  ctx.fillStyle = '#0b0e14';
  ctx.fillRect(0, 0, W, H);
  const grad = ctx.createRadialGradient(W - 200, 120, 50, W - 200, 120, 600);
  grad.addColorStop(0, `${accent}33`);
  grad.addColorStop(1, '#0b0e1400');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Brand
  ctx.fillStyle = '#edf0f8';
  ctx.font = '700 44px Inter, system-ui, sans-serif';
  ctx.fillText(SITE_NAME, 64, 96);
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(48, 82, 12, 0, Math.PI * 2);
  ctx.fill();

  // Glyph + game name
  ctx.font = '120px serif';
  ctx.fillText(GAME_GLYPHS[opts.gameId], 64, 280);
  ctx.fillStyle = '#969fb8';
  ctx.font = '600 40px Inter, system-ui, sans-serif';
  ctx.fillText(opts.gameName, 220, 250);

  // Score
  ctx.fillStyle = '#edf0f8';
  ctx.font = '800 180px Inter, system-ui, sans-serif';
  ctx.fillText(opts.total.toFixed(1), 60, 470);
  ctx.fillStyle = '#969fb8';
  ctx.font = '600 56px Inter, system-ui, sans-serif';
  ctx.fillText('/ 50', 60 + ctx.measureText(opts.total.toFixed(1)).width + 360, 470);

  // Per-round bars (score 0..10)
  const bx = 760;
  const by = 200;
  const bw = 64;
  const gap = 24;
  const maxH = 240;
  opts.scores.forEach((s, i) => {
    const h = Math.max(6, (s / 10) * maxH);
    const x = bx + i * (bw + gap);
    ctx.fillStyle = '#1a1f2f';
    ctx.fillRect(x, by, bw, maxH);
    ctx.fillStyle = accent;
    ctx.fillRect(x, by + (maxH - h), bw, h);
  });

  // URL / tagline
  ctx.fillStyle = '#969fb8';
  ctx.font = '500 32px Inter, system-ui, sans-serif';
  ctx.fillText(opts.url.replace(/^https?:\/\//, ''), 64, 570);
}

export function ShareCard({
  gameId,
  gameName,
  total,
  scores,
  shareText,
  shareUrl,
}: {
  gameId: GameId;
  gameName: string;
  total: number;
  scores: number[];
  shareText: string;
  shareUrl: string;
}) {
  const t = useTranslations('Share');
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filename = `senso-${gameId}-${total.toFixed(1)}.png`;

  useEffect(() => {
    if (canvasRef.current) drawCard(canvasRef.current, { gameId, gameName, total, scores, url: shareUrl });
  }, [gameId, gameName, total, scores, shareUrl]);

  const toBlob = (): Promise<Blob | null> =>
    new Promise((resolve) => {
      const c = canvasRef.current;
      if (!c) return resolve(null);
      c.toBlob((b) => resolve(b), 'image/png');
    });

  const onDownload = async () => {
    const blob = await toBlob();
    if (!blob) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(t('cardSaved'), 'success');
  };

  const onShare = async () => {
    const blob = await toBlob();
    const file = blob ? new File([blob], filename, { type: 'image/png' }) : null;
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    try {
      if (file && nav.canShare?.({ files: [file] })) {
        await nav.share({ files: [file], text: shareText, url: shareUrl, title: SITE_NAME });
        return;
      }
      if (nav.share) {
        await nav.share({ text: shareText, url: shareUrl, title: SITE_NAME });
        return;
      }
    } catch {
      // user cancelled or share failed - fall through to clipboard copy
    }
    await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
    toast(t('shareFailed'), 'default');
  };

  const onCopy = async () => {
    await navigator.clipboard?.writeText(`${shareText} ${shareUrl}`);
    toast(t('linkCopied'), 'success');
  };

  return (
    <div className="w-full">
      <canvas
        ref={canvasRef}
        width={1200}
        height={630}
        className="w-full rounded-lg border border-border"
        aria-label={`${gameName} ${total.toFixed(1)} / 50`}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <Button onClick={onShare}>{t('shareResult')}</Button>
        <Button variant="outline" onClick={onDownload}>
          {t('downloadCard')}
        </Button>
        <Button variant="outline" onClick={onCopy}>
          {t('copyLink')}
        </Button>
      </div>
    </div>
  );
}
