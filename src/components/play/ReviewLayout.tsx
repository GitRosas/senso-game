'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

/** Shared target-vs-guess layout reused by every game's Review and the result screen. */
export function ReviewLayout({
  targetNode,
  guessNode,
  delta,
  compact,
}: {
  targetNode: React.ReactNode;
  guessNode: React.ReactNode;
  delta?: React.ReactNode;
  compact?: boolean;
}) {
  const t = useTranslations('Play');
  return (
    <div className="w-full">
      <div className={cn('grid grid-cols-2 gap-3', compact ? 'gap-2' : 'gap-4')}>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide text-muted">{t('target')}</span>
          {targetNode}
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide text-muted">{t('yourGuess')}</span>
          {guessNode}
        </div>
      </div>
      {delta != null && (
        <p className="tabular mt-2 text-center text-sm text-muted">{delta}</p>
      )}
    </div>
  );
}
