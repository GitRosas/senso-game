import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { FEATURES } from '@/config';
import { getCurrentUser } from '@/lib/premium';
import { PremiumActions } from '@/components/PremiumActions';
import { cn } from '@/lib/utils';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Pricing' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `/${locale}/pricing`,
      languages: { en: '/en/pricing', pt: '/pt/pricing' },
    },
  };
}

export default async function PricingPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Pricing');
  const user = await getCurrentUser();

  const freeFeatures = ['featAllGames', 'featLeaderboards', 'featSupport'] as const;
  const premiumFeatures = ['featNoAds', 'featTraining', 'featTournaments', 'featSupport'] as const;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold">{t('title')}</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">{t('subtitle')}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Plan title={t('free')} price={t('freePrice')} note={t('freeForever')} features={freeFeatures.map((f) => t(f))} />
        <Plan
          title={t('premium')}
          price="€"
          note={`${t('monthly')} · ${t('annual')} (${t('save')})`}
          features={premiumFeatures.map((f) => t(f))}
          highlight
        >
          <PremiumActions
            configured={FEATURES.stripe}
            signedIn={Boolean(user)}
            isPremium={user?.isPremium ?? false}
          />
        </Plan>
      </div>
    </div>
  );
}

function Plan({
  title,
  price,
  note,
  features,
  highlight,
  children,
}: {
  title: string;
  price: string;
  note: string;
  features: string[];
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-lg border bg-surface p-6',
        highlight ? 'border-accent shadow-[0_0_40px_-12px_rgb(var(--accent)/0.5)]' : 'border-border',
      )}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-extrabold">{price}</span>
        <span className="pb-1 text-sm text-muted">{note}</span>
      </div>
      <ul className="mt-4 flex-1 space-y-2 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="text-accent" aria-hidden>
              ✓
            </span>
            <span className="text-muted">{f}</span>
          </li>
        ))}
      </ul>
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
