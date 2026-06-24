import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { GAME_ORDER, isGameId } from '@/games/engine/registry';
import { GAME_CONTENT } from '@/games/content-registry';
import { GAME_ACCENTS, GAME_GLYPHS, SITE_NAME, SITE_URL, type Locale } from '@/config';
import { PlayPanel } from '@/components/play/PlayPanel';
import { AdSlot } from '@/components/AdSlot';
import { hexToRgbChannels } from '@/lib/utils';

export const revalidate = 86400;

export function generateStaticParams() {
  return (['en', 'pt'] as const).flatMap((locale) =>
    GAME_ORDER.map((game) => ({ locale, game })),
  );
}

function loc(locale: string): Locale {
  return locale === 'pt' ? 'pt' : 'en';
}

export async function generateMetadata({
  params: { locale, game },
}: {
  params: { locale: string; game: string };
}): Promise<Metadata> {
  if (!isGameId(game)) return {};
  const c = GAME_CONTENT[game][loc(locale)];
  const path = `/${locale}/play/${game}`;
  const ogImage = `${SITE_URL}/api/og?game=${game}`;
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: {
      canonical: path,
      languages: { en: `/en/play/${game}`, pt: `/pt/play/${game}` },
    },
    openGraph: {
      type: 'article',
      title: c.metaTitle,
      description: c.metaDescription,
      url: `${SITE_URL}${path}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: c.metaTitle,
      description: c.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function GameIntro({
  params: { locale, game },
}: {
  params: { locale: string; game: string };
}) {
  setRequestLocale(locale);
  if (!isGameId(game)) notFound();

  const l = loc(locale);
  const c = GAME_CONTENT[game][l];
  const ts = await getTranslations('Sections');
  const tg = await getTranslations('Games');
  const accent = GAME_ACCENTS[game];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'VideoGame',
        name: `${tg(`${game}.name`)} — ${SITE_NAME}`,
        description: c.metaDescription,
        url: `${SITE_URL}/${locale}/play/${game}`,
        inLanguage: l,
        applicationCategory: 'Game',
        operatingSystem: 'Web',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/${locale}` },
          {
            '@type': 'ListItem',
            position: 2,
            name: tg(`${game}.name`),
            item: `${SITE_URL}/${locale}/play/${game}`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };

  const Section = ({ title, paragraphs }: { title: string; paragraphs: string[] }) => (
    <>
      <h2>{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );

  return (
    <div
      style={{ ['--accent' as string]: hexToRgbChannels(accent) }}
      className="mx-auto max-w-3xl px-4 py-10"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-4 text-sm text-muted">
        <Link href="/" className="hover:text-fg">
          {SITE_NAME}
        </Link>{' '}
        / <span className="text-fg">{tg(`${game}.name`)}</span>
      </nav>

      <header className="mb-6 text-center">
        <div className="text-5xl" aria-hidden>
          {GAME_GLYPHS[game]}
        </div>
        <h1 className="mt-2 text-4xl font-extrabold">{tg(`${game}.name`)}</h1>
        <p className="text-accent">{tg(`${game}.tagline`)}</p>
        <p className="mx-auto mt-3 max-w-xl text-muted">{c.intro}</p>
      </header>

      <PlayPanel gameId={game} />

      <div className="mt-4 text-center">
        <Link
          href={`/leaderboard/${game}`}
          className="text-sm font-semibold text-accent underline underline-offset-2"
        >
          {ts('leaderboardCta')}
        </Link>
      </div>

      <article className="prose-senso mx-auto mt-12">
        <Section title={ts('whatItIs')} paragraphs={c.whatItIs} />
        <Section title={ts('howToPlay')} paragraphs={c.howToPlay} />
        <Section title={ts('science')} paragraphs={c.science} />
        <Section title={ts('scoring')} paragraphs={c.scoring} />

        <h2>{ts('tips')}</h2>
        <ul>
          {c.tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>

        <h2>{ts('faq')}</h2>
        {c.faq.map((f, i) => (
          <div key={i}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </article>

      <div className="mt-12">
        <AdSlot />
      </div>
    </div>
  );
}
