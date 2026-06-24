'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { getConsent, setConsent } from '@/lib/consent';

export function ConsentBanner() {
  const t = useTranslations('Consent');
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(getConsent() === null);
  }, []);

  if (!show) return null;

  const choose = (choice: 'all' | 'essential') => {
    setConsent(choice);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label={t('title')}
      className="fixed inset-x-3 bottom-3 z-[55] mx-auto max-w-2xl rounded-lg border border-border bg-surface/95 p-4 shadow-2xl backdrop-blur animate-slide-up"
    >
      <p className="mb-3 text-sm text-muted">
        <strong className="text-fg">{t('title')}.</strong> {t('message')}{' '}
        <Link href="/privacy" className="text-accent underline underline-offset-2">
          {t('learnMore')}
        </Link>
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => choose('all')}>
          {t('accept')}
        </Button>
        <Button size="sm" variant="outline" onClick={() => choose('essential')}>
          {t('reject')}
        </Button>
      </div>
    </div>
  );
}
