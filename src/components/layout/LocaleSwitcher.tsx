'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations('Common');
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchTo = (next: string) => {
    if (next === locale) return;
    const search = typeof window !== 'undefined' ? window.location.search : '';
    startTransition(() => {
      router.replace(`${pathname}${search}`, { locale: next });
    });
  };

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface/70 p-1 backdrop-blur"
      aria-label={t('switchLocale')}
      role="group"
    >
      <span aria-hidden className="pl-1 text-xs text-muted">
        🌐
      </span>
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          data-testid={`locale-${l}`}
          disabled={pending}
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={cn(
            'min-h-[32px] rounded-full px-2.5 text-xs font-bold uppercase tracking-wide transition',
            l === locale
              ? 'bg-accent text-accent-fg shadow-[0_2px_10px_-2px_rgb(var(--accent)/0.6)]'
              : 'text-muted hover:bg-surface-2 hover:text-fg',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
