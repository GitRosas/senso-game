import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Scoring' });
  return {
    title: t('title'),
    description: t('intro'),
    alternates: {
      canonical: `/${locale}/scoring`,
      languages: { en: '/en/scoring', pt: '/pt/scoring' },
    },
  };
}

export default async function ScoringPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Scoring');
  const sections: Array<['formula' | 'units' | 'bands' | 'fairness']> = [
    ['formula'],
    ['units'],
    ['bands'],
    ['fairness'],
  ];
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t('title')}</h1>
      <p className="mt-4 text-lg text-muted">{t('intro')}</p>
      <pre className="mt-6 overflow-x-auto rounded-lg border border-border bg-surface p-4 text-sm text-accent">
        score = 10 × 0.5^(error ÷ half)
      </pre>
      <div className="prose-senso mt-8">
        {sections.map(([key]) => (
          <section key={key}>
            <h2>{t(`${key}Title`)}</h2>
            <p>{t(`${key}Body`)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
