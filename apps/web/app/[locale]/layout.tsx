import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { locales } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToMain from '@/components/SkipToMain';
import { OrganizationSchema, WebSiteSchema } from '@/components/SchemaOrg';
import { QueryProvider } from '@/lib/providers/QueryProvider';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const baseUrl = 'https://www.ccscale.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

type Props = {
  params: { locale: string };
  children: React.ReactNode;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });

  const title = locale === 'en'
    ? 'CC Scale - Professional Weighing Solutions Manufacturer'
    : 'CC Scale - 专业衡器制造商';

  const description = locale === 'en'
    ? 'Leading manufacturer of high-quality weighing scales. Body scales, hanging scales, kitchen scales, baby scales. OEM/ODM solutions for global B2B buyers.'
    : '高品质衡器制造商，提供体重秤、吊秤、厨房秤、婴儿秤等产品。为全球B2B买家提供OEM/ODM解决方案。';

  const alternates: Metadata['alternates'] = {
    canonical: `${baseUrl}/${locale}`,
    languages: {},
  };

  locales.forEach((l) => {
    alternates.languages![l === 'en' ? 'en-US' : 'zh-CN'] = `${baseUrl}/${l}`;
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}`,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      siteName: 'CC Scale',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@CCScale',
      creator: '@CCScale',
      images: ['https://www.ccscale.com/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates,
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  if (!locales.includes(locale as any)) notFound();
  setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0A1628" />
        <meta name="msapplication-TileColor" content="#0A1628" />
      </head>
      <body className="min-h-screen bg-parchment antialiased" suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <QueryProvider>
            <OrganizationSchema />
            <WebSiteSchema />
            <SkipToMain locale={locale} />
            <Header locale={locale} />
            <main id="main-content" className="min-h-screen" role="main">
              {children}
            </main>
            <Footer locale={locale} />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
