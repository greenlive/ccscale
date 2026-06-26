import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import type { Metadata } from 'next';
import { locales } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/api/server-settings';

type Props = {
  params: { locale: string };
};

const baseUrl = 'https://www.zzscale.com';

// B2B trade keywords for products listing page
const productsPageKeywords = [
  'weighing scales', 'digital scales', 'industrial scales', 'commercial scales',
  'body scales', 'bathroom scales', 'hanging scales', 'crane scales',
  'kitchen scales', 'food scales', 'baby scales', 'infant scales',
  'platform scales', 'bench scales', 'warehouse scales', 'precision scales',
  'OEM scales', 'ODM scales', 'wholesale scales', 'factory direct',
  'B2B weighing equipment', 'bulk weighing scales', 'export scales',
  'weighing solutions', 'scale manufacturer', 'custom scales',
];

// Category filter keywords for international buyers
const categoryKeywords = [
  'digital body scale wholesale', 'industrial hanging scale supplier',
  'commercial kitchen scale manufacturer', 'precision balance exporter',
  'body weight scale B2B', 'crane scale factory', 'medical scale OEM',
  'platform scale bulk order', 'custom branding scale', 'private label scale',
];

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const isZh = locale === 'zh';
  const settings = await getSiteSettings();
  const siteName = settings.companyNameEn || 'CC Scale';
  const t = isZh ? '浜у搧涓績' : 'Products';

  const title = isZh
    ? `涓撲笟琛″櫒浜у搧鍒楄〃 - ${siteName}鍘傚鐩翠緵`
    : `Professional Weighing Scales Catalog - ${siteName} Direct Manufacturer`;

  const description = isZh
    ? `娴忚${siteName}鐨勫叏绯诲垪琛″櫒浜у搧锛屽寘鎷綋閲嶇Г銆佸悐绉ゃ€佸帹鎴跨Г銆佸┐鍎跨Г绛夈€傛彁渚汷EM/ODM瀹氬埗鏈嶅姟锛屽巶瀹剁洿渚涳紝浠锋牸浼樻儬銆俙
    : `Browse ${siteName}'s full range of weighing scales including body scales, hanging scales, kitchen scales, baby scales and more. OEM/ODM available, direct from manufacturer.`;

  // Build hreflang alternates
  const alternates: Metadata['alternates'] = {
    canonical: `${baseUrl}/${locale}/products`,
    languages: {},
  };
  locales.forEach((l) => {
    alternates.languages![l === 'en' ? 'en-US' : 'zh-CN'] = `${baseUrl}/${l}/products`;
  });

  return {
    title,
    description,
    keywords: [...productsPageKeywords, ...categoryKeywords].join(', '),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    openGraph: {
      title,
      description,
      siteName,
      type: 'website',
      url: `${baseUrl}/${locale}/products`,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      images: [
        {
          url: 'https://www.zzscale.com/products-og.svg',
          width: 1200,
          height: 630,
          alt: isZh ? `${siteName}浜у搧鍒楄〃` : `${siteName} Products Catalog`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@ZZScale',
      creator: '@ZZScale',
      images: ['https://www.zzscale.com/products-og.svg'],
    },
    alternates,
  };
}

export default function ProductsPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent" />
      </div>
    }>
      <ProductsPageContent locale={locale} />
    </Suspense>
  );
}
