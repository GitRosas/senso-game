import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default function CatchAll({ params: { locale } }: { params: { locale: string; rest: string[] } }) {
  setRequestLocale(locale);
  notFound();
}
