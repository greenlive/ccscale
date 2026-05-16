import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import { ProductDetailContent } from '@/components/ProductDetailContent';
import type { Metadata } from 'next';
import { locales } from '@/i18n/routing';
import { getSiteSettings } from '@/lib/api/server-settings';

type Props = {
  params: { locale: string; slug: string };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// B2B trade keywords for international buyers
const categoryKeywords: Record<string, string[]> = {
  'body-scales': [
    'digital body scale', 'body weight scale', 'bathroom scale', 'personal scale',
    'weight scale digital', 'body composition analyzer', 'smart body scale',
    'weighing scale for home', 'professional body scale', 'medical body scale',
    'digital bathroom scale', 'LED display scale', 'glass platform scale',
  ],
  'hanging-scales': [
    'hanging scale', 'industrial hanging scale', 'crane scale', '吊秤',
    'digital hanging scale', 'pallet scale', 'warehouse scale', 'heavy duty scale',
    'industrial weighing scale', 'mechanical hanging scale', 'digital crane scale',
    'hook scale', 'suspension scale', 'livestock weighing scale',
  ],
  'kitchen-scales': [
    'kitchen scale', 'digital kitchen scale', 'food scale', 'cooking scale',
    'precision kitchen scale', 'bath scale', 'culinary scale', 'bakery scale',
    'stainless steel kitchen scale', 'digital food scale', 'measuring scale',
    'diet scale', 'food weighing scale', 'commercial kitchen scale',
  ],
  'baby-scales': [
    'baby scale', 'infant scale', 'pediatric scale', 'digital baby scale',
    'baby weighing scale', 'neonatal scale', 'medical infant scale',
    'baby height scale', 'nursing scale', 'birth weight scale',
  ],
  'dial-scales': [
    'dial scale', 'mechanical scale', 'platform scale', 'bench scale',
    'industrial platform scale', 'mechanical platform scale', 'dial platform scale',
    'warehouse platform scale', 'heavy platform scale', 'commercial scale',
  ],
};

// Generate English keywords combining product name with category terms
function generateProductKeywords(productName: string, category: string | null): string[] {
  const baseKeywords = [
    'weighing scale', 'digital scale', 'precision scale', 'industrial scale',
    'commercial scale', 'B2B scale', 'wholesale scale', 'factory price',
    'OEM scale', 'ODM scale', 'custom scale', 'private label scale',
  ];

  const categoryTerms = category ? categoryKeywords[category] || [] : [];
  const productTerms = productName.toLowerCase().split(' ').filter(t => t.length > 2);

  return Array.from(new Set([...productTerms, ...categoryTerms.slice(0, 5), ...baseKeywords]));
}

interface ProductSEOData {
  id: number;
  slug: string;
  nameEn: string | null;
  nameZh: string | null;
  seoTitleEn: string | null;
  seoTitleZh: string | null;
  seoDescEn: string | null;
  seoDescZh: string | null;
  category: { name: string | null; slug?: string | null } | null;
  priceMin?: number;
  priceMax?: number;
  mainImage?: string;
  sku?: string;
}

// All product slugs from database
const allProductSlugs = [
  'digital-body-scale-bs-200',
  'smart-body-scale-bs-100',
  'industrial-hanging-scale-hs-500',
  'precision-kitchen-scale-ks-300',
  'digital-baby-scale-bb-100',
];

async function getProductForSEO(slug: string): Promise<ProductSEOData | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/slug/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params: { locale, slug } }: Props): Promise<Metadata> {
  const isZh = locale === 'zh';
  const product = await getProductForSEO(slug);
  const baseUrl = 'https://www.ccscale.com';
  const settings = await getSiteSettings();
  const siteName = settings.companyNameEn || 'CC Scale';

  if (!product) {
    return {
      title: `${isZh ? '产品' : 'Product'} | ${siteName}`,
      description: isZh ? '查看产品详情' : 'View product details',
    };
  }

  const name = isZh ? (product.nameZh || product.nameEn || '') : (product.nameEn || product.nameZh || '');
  const seoTitle = isZh ? (product.seoTitleZh || product.seoTitleEn || name) : (product.seoTitleEn || product.seoTitleZh || name);
  const seoDesc = isZh ? (product.seoDescZh || product.seoDescEn || '') : (product.seoDescEn || product.seoDescZh || '');

  // Generate B2B international keywords
  const categorySlug = product.category?.slug || '';
  const keywords = generateProductKeywords(name, categorySlug);

  // Build hreflang alternates
  const alternates: Metadata['alternates'] = {
    canonical: `${baseUrl}/${locale}/products/${slug}`,
    languages: {},
  };
  locales.forEach((l) => {
    alternates.languages![l === 'en' ? 'en-US' : 'zh-CN'] = `${baseUrl}/${l}/products/${slug}`;
  });

  // Open Graph images
  const ogImage = product.mainImage || 'https://www.ccscale.com/og-image.jpg';

  return {
    title: seoTitle || `${name} | ${siteName}`,
    description: seoDesc || (isZh ? `了解${name}的详细信息、规格和价格。` : `View details, specifications and pricing for ${name}.`),
    keywords: keywords.join(', '),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    openGraph: {
      title: seoTitle || name,
      description: seoDesc,
      siteName,
      type: 'website',
      url: `${baseUrl}/${locale}/products/${slug}`,
      locale: locale === 'en' ? 'en_US' : 'zh_CN',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle || name,
      description: seoDesc,
      site: '@CCScale',
      creator: '@CCScale',
      images: [ogImage],
    },
    alternates,
  };
}

export function generateStaticParams() {
  const locales = ['en', 'zh'];
  const params: Array<{ locale: string; slug: string }> = [];

  locales.forEach((locale) => {
    allProductSlugs.forEach((slug) => {
      params.push({ locale, slug });
    });
  });

  return params;
}

export default async function ProductPage({ params: { locale, slug } }: Props) {
  const baseUrl = 'https://www.ccscale.com';
  const name = locale === 'en' ? '产品' : 'Product';
  const isZh = locale === 'zh';

  // Fetch full product data for JSON-LD schema
  const product = await getProductForSEO(slug);
  const settings = await getSiteSettings();
  const brandName = settings.companyNameEn || 'CC Scale';

  const breadcrumbItems = [
    { name: isZh ? '首页' : 'Home', url: `${baseUrl}/${locale}` },
    { name: isZh ? '产品中心' : 'Products', url: `${baseUrl}/${locale}/products` },
    { name, url: `${baseUrl}/${locale}/products/${slug}` },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {product && (
        <ProductSchema
          name={product.nameEn || product.nameZh || ''}
          description={isZh ? (product.seoDescZh || product.seoDescEn || '') : (product.seoDescEn || product.seoDescZh || '')}
          image={product.mainImage || 'https://www.ccscale.com/og-image.jpg'}
          sku={product.sku}
          brand={brandName}
          category={product.category?.name || undefined}
          offers={{
            price: product.priceMin ? String(product.priceMin) : undefined,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            url: `${baseUrl}/${locale}/products/${slug}`,
            minOrderQuantity: 100,
          }}
        />
      )}
      <ProductDetailContent slug={slug} />
    </>
  );
}
