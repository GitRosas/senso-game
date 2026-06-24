import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { AccountClient } from '@/components/account/AccountClient';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AccountPage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Account');
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-extrabold">{t('title')}</h1>
      <AccountClient />
    </div>
  );
}
