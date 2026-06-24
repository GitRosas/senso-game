import { getTranslations } from 'next-intl/server';

export async function LegalPage({
  locale,
  namespace,
}: {
  locale: string;
  namespace: 'About' | 'Privacy' | 'Terms';
}) {
  const t = await getTranslations({ locale, namespace });
  const body = t.raw('body') as string[];
  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t('title')}</h1>
      <div className="prose-senso mt-6">
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
