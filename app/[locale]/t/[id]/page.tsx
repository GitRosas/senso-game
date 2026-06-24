import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { TournamentClient } from '@/components/TournamentClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TournamentPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <TournamentClient id={id} />
    </div>
  );
}
