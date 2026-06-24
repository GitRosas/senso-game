import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <div className="text-5xl" aria-hidden>
        🧭
      </div>
      <h1 className="mt-4 text-3xl font-extrabold">{t('title')}</h1>
      <p className="mt-3 text-muted">{t('body')}</p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-accent px-6 font-semibold text-accent-fg"
      >
        {t('home')}
      </Link>
    </div>
  );
}
