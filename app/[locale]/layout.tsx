import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { inter, mono } from '@/lib/fonts';
import { SITE_NAME, SITE_URL, SITE_TAGLINE, type Locale } from '@/config';
import { ToastProvider } from '@/components/ui/Toast';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ConsentBanner } from '@/components/ConsentBanner';
import { SupportButton } from '@/components/SupportButton';
import { Analytics } from '@/components/Analytics';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0e14',
};

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const tagline = SITE_TAGLINE[(locale as Locale) in SITE_TAGLINE ? (locale as Locale) : 'en'];
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${SITE_NAME} — ${tagline}`,
      template: `%s · ${SITE_NAME}`,
    },
    description: tagline,
    applicationName: SITE_NAME,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: '/en', pt: '/pt' },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale,
      url: `${SITE_URL}/${locale}`,
      title: `${SITE_NAME} — ${tagline}`,
      description: tagline,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${SITE_NAME} — ${tagline}`,
      description: tagline,
    },
    icons: { icon: '/favicon.svg' },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const t = await getTranslations('Nav');

  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`}>
      <body className="overflow-x-hidden font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
            >
              {t('games')}
            </a>
            <div className="flex min-h-[100dvh] flex-col">
              <Nav />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <SupportButton />
            <ConsentBanner />
            <Analytics />
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
