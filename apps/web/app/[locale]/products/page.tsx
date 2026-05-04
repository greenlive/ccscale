import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';
import type { Metadata } from 'next';
import { locales } from '@/i18n/routing';

type Props = {
  params: { locale: string };
};

const baseUrl = 'https://www.ccscale.com';

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
  const t = isZh ? '产品中心' : 'Products';

  const title = isZh
    ? '专业衡器产品列表 - CC Scale厂家直供'
    : 'Professional Weighing Scales Catalog - CC Scale Direct Manufacturer';

  const description = isZh
    ? '浏览CC Scale的全系列衡器产品，包括体重秤、吊秤、厨房秤、婴儿秤等。提供OEM/ODM定制服务，厂家直供，价格优惠。'
    : 'Browse CC Scale\'s full range of weighing scales including body scales, hanging scales, kitchen scales, baby scales and more. OEM/ODM available, direct from manufacturer.';

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
    authors: [{ name: 'CC Scale' }],
    creator: 'CC Scale',
    publisher: 'CC Scale',
    openGraph: {
      title,
      description,
      siteName: 'CC Scale',
      type: 'website',
      url: `${baseUrl}/${locale}/products`,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      images: [
        {
          url: 'https://www.ccscale.com/products-og.jpg',
          width: 1200,
          height: 630,
          alt: isZh ? 'CC Scale产品列表' : 'CC Scale Products Catalog',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@CCScale',
      creator: '@CCScale',
      images: ['https://www.ccscale.com/products-og.jpg'],
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
