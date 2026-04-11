import { getTranslations } from 'next-intl/server';

export default async function SkipToMain({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'a11y' });

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-[calc(env(safe-area-inset-top)+1rem)] focus:left-[max(1rem,env(safe-area-inset-left))] bg-primary text-primary-foreground px-4 py-3 rounded-md z-[100] shadow-lg outline-none ring-2 ring-ring ring-offset-2"
    >
      {t('skipToContent')}
    </a>
  );
}
