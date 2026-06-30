import { getTranslations } from 'next-intl/server';
import { SOCIAL, FEATURES } from '@/config';

/** Floating Ko-fi support button (bottom-left, clear of bottom-centre toasts). */
export async function SupportButton() {
  if (!FEATURES.kofi) return null;
  const t = await getTranslations('Nav');
  return (
    <a
      href={`https://ko-fi.com/${SOCIAL.kofiHandle}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('support')}
      className="safe-mb fixed bottom-4 left-4 z-40 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-border bg-surface/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur transition hover:bg-surface-2"
    >
      <span aria-hidden>☕</span>
      <span>{t('support')}</span>
    </a>
  );
}
