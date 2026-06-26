import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@cc-scale/database';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import ProductDetailView from './ProductDetailView';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 300; // revalidate every 5 min (was 60, loosened to reduce DB hits)
export const dynamicParams = true; // allow slugs not pre-generated

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.zzscale.com';

export async function generateStaticParams() {
  // Pre-render the most recent 100 active products. New ones render on demand.
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch (err) {
    console.warn('generateStaticParams: DB unavailable, skipping pre-render', err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: 'Product Not Found' };
    const isZh = locale === 'zh';
    const title = (isZh ? product.seoTitleZh : product.seoTitleEn)
      || (isZh ? product.nameZh : product.nameEn);
    const description = (isZh ? product.seoDescZh : product.seoDescEn)
      || (isZh ? product.shortDescZh : product.shortDescEn)
      || (isZh ? product.descriptionZh : product.descriptionEn)?.slice(0, 160);
    const path = `${isZh ? '/zh' : ''}/products/${slug}`;
    return {
      title,
      description,
      alternates: {
        canonical: `${SITE_URL}${path}`,
        languages: {
          'en-US': `${SITE_URL}/products/${slug}`,
          'zh-CN': `${SITE_URL}/zh/products/${slug}`,
        },
      },
      openGraph: {
        title,
        description,
        url: `${SITE_URL}${path}`,
        type: 'website',
        images: product.mainImages
          ? (() => {
              try {
                const arr = JSON.parse(product.mainImages);
                return Array.isArray(arr) && arr[0] ? [{ url: arr[0] }] : [];
              } catch {
                return [];
              }
            })()
          : [],
      },
    };
  } catch (err) {
    console.warn('generateMetadata: DB error for slug', slug, err);
    return { title: 'Product' };
  }
}

async function getProduct(slug: string) {
  try {
    return await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        specs: { orderBy: { order: 'asc' } },
        customerCases: { where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 },
      },
    });
  } catch (err) {
    console.error('getProduct: DB error for slug', slug, err);
    return null;
  }
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const path = `${locale === 'zh' ? '/zh' : ''}/products/${slug}`;
  const breadcrumbItems = [
    { name: locale === 'zh' ? '棣栭〉' : 'Home', url: `${SITE_URL}/${locale === 'zh' ? 'zh' : ''}` },
    { name: locale === 'zh' ? '浜у搧' : 'Products', url: `${SITE_URL}${locale === 'zh' ? '/zh' : ''}/products` },
    { name: locale === 'zh' ? product.nameZh : product.nameEn, url: `${SITE_URL}${path}` },
  ];

  return (
    <>
      <ProductSchema
        name={product.nameEn}
        description={(product.descriptionEn || product.shortDescEn || '').slice(0, 1000)}
        image={(() => { try { const arr = JSON.parse(product.mainImages || '[]'); return Array.isArray(arr) ? arr[0] : (product.mainImages || ''); } catch { return product.mainImages || ''; } })()}
        sku={product.sku}
        brand="CC Scale"
        category={product.category?.nameEn}
        offers={{
          price: product.priceMin ? String(product.priceMin) : undefined,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}${path}`,
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductDetailView product={product} locale={locale} />
    </>
  );
}
