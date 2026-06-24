import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { LegalPage } from '@/components/LegalPage';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Privacy' });
  return {
    title: t('title'),
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: { en: '/en/privacy', pt: '/pt/privacy' },
    },
  };
}

export default function Page({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  return <LegalPage locale={locale} namespace="Privacy" />;
}
