'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function PremiumActions({
  configured,
  signedIn,
  isPremium,
}: {
  configured: boolean;
  signedIn: boolean;
  isPremium: boolean;
}) {
  const t = useTranslations('Pricing');
  const ta = useTranslations('Account');
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const post = async (path: string, body?: unknown) => {
    setLoading(true);
    try {
      const r = await fetch(path, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const d = (await r.json()) as { url?: string; error?: string };
      if (d.url) {
        window.location.href = d.url;
        return;
      }
      toast(t('notConfigured'), 'error');
    } catch {
      toast(t('notConfigured'), 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!configured) return <p className="text-sm text-muted">{t('notConfigured')}</p>;

  if (!signedIn) {
    return (
      <Link
        href="/account"
        className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-accent px-5 font-semibold text-accent-fg"
      >
        {t('signInFirst')}
      </Link>
    );
  }

  if (isPremium) {
    return (
      <Button variant="outline" disabled={loading} onClick={() => post('/api/stripe/portal')}>
        {ta('manageBilling')}
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button disabled={loading} onClick={() => post('/api/stripe/checkout', { plan: 'monthly' })}>
        {t('ctaUpgradeMonthly')}
      </Button>
      <Button
        variant="outline"
        disabled={loading}
        onClick={() => post('/api/stripe/checkout', { plan: 'annual' })}
      >
        {t('ctaUpgradeAnnual')}
      </Button>
    </div>
  );
}
