'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { FEATURES, SOCIAL } from '@/config';

export function Footer() {
  const t = useTranslations('Footer');
  const year = new Date().getUTCFullYear();

  const pages: Array<{ href: string; label: string }> = [
    { href: '/about', label: t('about') },
    { href: '/scoring', label: t('scoring') },
    { href: '/privacy', label: t('privacy') },
    { href: '/terms', label: t('terms') },
  ];

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 text-lg font-extrabold">
            <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
            Senso
          </div>
          <p className="mt-2 text-sm text-muted">{t('tagline')}</p>
          <p className="mt-4 text-xs text-muted">{t('rights', { year })}</p>
        </div>

        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm" aria-label="Footer">
          {pages.map((p) => (
            <Link key={p.href} href={p.href} className="text-muted transition hover:text-fg">
              {p.label}
            </Link>
          ))}
          {FEATURES.kofi && (
            <a
              href={`https://ko-fi.com/${SOCIAL.kofiHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition hover:text-fg"
            >
              {t('support')}
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
