import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnalyticsTrackerWrapper from '@/components/AnalyticsTrackerWrapper';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { QueryProvider } from '@/lib/providers/QueryProvider';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className='antialiased'>
        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <AnalyticsTrackerWrapper />
            <Header locale={locale} />
            <main className='min-h-screen'>{children}</main>
            <Footer locale={locale} />
            <WhatsAppButton />
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}