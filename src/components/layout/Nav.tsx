'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { FEATURES } from '@/config';
import { LocaleSwitcher } from './LocaleSwitcher';

function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2 text-lg font-extrabold tracking-tight">
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-full bg-accent shadow-[0_0_12px_2px_rgb(var(--accent)/0.6)]"
      />
      Senso
    </span>
  );
}

export function Nav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // `prefix` keeps a link highlighted across its sub-pages (e.g. any /leaderboard/*).
  type NavLink = { href: string; label: string; prefix?: string };
  const links: NavLink[] = [
    { href: '/', label: t('games') },
    { href: '/leaderboard/tempo', label: t('leaderboard'), prefix: '/leaderboard' },
    { href: '/pricing', label: t('pricing') },
  ];
  if (FEATURES.supabase) {
    links.push({ href: '/account', label: t('account') });
  }

  const isActive = (l: NavLink) =>
    l.href === '/' ? pathname === '/' : pathname.startsWith(l.prefix ?? l.href);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" aria-label={t('brand')} className="shrink-0">
          <BrandMark />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition',
                isActive(l)
                  ? 'bg-accent/10 text-fg ring-1 ring-inset ring-accent/30'
                  : 'text-muted hover:bg-surface-2 hover:text-fg',
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border md:hidden"
            aria-expanded={open}
            aria-label={open ? t('closeMenu') : t('openMenu')}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-xl">
              {open ? '✕' : '☰'}
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3 py-3 text-sm font-medium transition',
                  isActive(l) ? 'bg-accent/10 text-fg' : 'text-fg hover:bg-surface-2',
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
