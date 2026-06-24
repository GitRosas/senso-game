import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { GameGrid } from '@/components/home/GameGrid';
import { SITE_NAME, SITE_URL, type Locale } from '@/config';

export const revalidate = 86400;

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'Home' });
  return {
    description: t('heroSubtitle'),
    alternates: { canonical: `/${locale}`, languages: { en: '/en', pt: '/pt' } },
  };
}

const primaryBtn =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-accent px-7 py-3.5 text-base font-semibold text-accent-fg shadow-sm transition hover:brightness-110';
const outlineBtn =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-border px-7 py-3.5 text-base font-semibold text-fg transition hover:bg-surface-2';

export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  setRequestLocale(locale);
  const t = await getTranslations('Home');
  const l = (locale as Locale) === 'pt' ? 'pt' : 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: l,
        description: t('heroSubtitle'),
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#org`,
        name: SITE_NAME,
        url: SITE_URL,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-accent/10 to-transparent"
        />
        <div className="mx-auto max-w-3xl px-4 pb-10 pt-16 text-center sm:pt-24">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
            {t('heroBadge')}
          </div>
          <h1 className="text-balance text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            <span className="text-gradient">{t('heroTitle')}</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted">
            {t('heroSubtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/play/tempo" className={primaryBtn}>
              {t('heroCtaPlay')} <span aria-hidden>⏱️</span>
            </Link>
            <a href="#games" className={outlineBtn}>
              {t('heroCtaAll')}
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{t('sectionGames')}</h2>
          <p className="text-muted">{t('sectionGamesSub')}</p>
        </div>
        <GameGrid />
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">{t('howTitle')}</h2>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <li key={n} className="rounded-lg border border-border bg-surface p-5">
              <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-fg">
                {n}
              </div>
              <h3 className="font-semibold">{t(`how${n}Title`)}</h3>
              <p className="mt-1 text-sm text-muted">{t(`how${n}Body`)}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-2xl text-sm text-muted">{t('statsNote')}</p>
      </section>
    </>
  );
}
