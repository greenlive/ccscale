import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Check, ChevronRight, MessageSquare, Mail, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Card, CardContent } from '@cc-scale/ui';
import { ProductSchema, BreadcrumbSchema } from '@/components/SchemaOrg';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductSpecTable } from '@/components/product/ProductSpecTable';
import { ProductVideo } from '@/components/product/ProductVideo';
import { ProductDownloads } from '@/components/product/ProductDownloads';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';
import { useProduct } from '@/lib/api/queries';
import { ErrorBoundary, Skeleton, CardSkeleton, GridSkeleton } from '@/components/ErrorBoundary';
import type { Metadata } from 'next';

// Mock data for static generation
const mockProducts = [
  {
    id: 1,
    slug: 'digital-body-scale-bs-200',
    sku: 'BS-200',
    name: { en: 'Digital Body Scale BS-200', zh: '数字体重秤 BS-200' },
    category: { slug: 'body-scales', name: { en: 'Body Scales', zh: '体重秤' } },
    image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    images: [
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    ],
    videoUrl: '',
    description: {
      en: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display.',
      zh: '高精度数字体重秤，采用先进的称重技术。功能包括即踩即称、自动校准和大液晶显示屏。'
    },
    shortDesc: {
      en: 'Professional digital body scale for home and commercial use',
      zh: '适用于家庭和商业用途的专业数字体重秤'
    },
    priceMin: 15,
    priceMax: 25,
    moq: 100,
    leadTime: '15-20 days',
    isFeatured: true,
    specs: [
      { key: { en: 'Capacity', zh: '最大称重' }, value: { en: '180kg / 400lb', zh: '180公斤 / 400磅' } },
      { key: { en: 'Division', zh: '分度值' }, value: { en: '100g', zh: '100克' } },
      { key: { en: 'Display', zh: '显示' }, value: { en: 'LCD, 3.5"', zh: '液晶显示屏, 3.5英寸' } },
      { key: { en: 'Power', zh: '电源' }, value: { en: '2 x AAA batteries', zh: '2节AAA电池' } },
      { key: { en: 'Dimensions', zh: '尺寸' }, value: { en: '300 x 300 x 25mm', zh: '300 x 300 x 25毫米' } },
      { key: { en: 'Material', zh: '材质' }, value: { en: 'Tempered glass', zh: '钢化玻璃' } },
    ],
    downloads: [
      {
        id: '1',
        title: { en: 'Product Catalog', zh: '产品目录' },
        fileUrl: '/downloads/catalog.pdf',
        fileType: 'PDF' as const,
        fileSize: '2.4 MB',
      },
      {
        id: '2',
        title: { en: 'Specification Sheet', zh: '规格书' },
        fileUrl: '/downloads/bs-200-specs.pdf',
        fileType: 'PDF' as const,
        fileSize: '450 KB',
      },
    ],
    relatedProducts: [
      {
        id: 2,
        slug: 'industrial-hanging-scale-hs-500',
        name: { en: 'Industrial Hanging Scale HS-500', zh: '工业吊秤 HS-500' },
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        sku: 'HS-500',
        priceMin: 45,
        priceMax: 85,
      },
      {
        id: 3,
        slug: 'precision-kitchen-scale-ks-300',
        name: { en: 'Precision Kitchen Scale KS-300', zh: '精密厨房秤 KS-300' },
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
        sku: 'KS-300',
        priceMin: 12,
        priceMax: 20,
      },
    ],
  },
];

type Props = {
  params: { locale: string; slug: string };
};

export async function generateMetadata({
  params: { locale, slug },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'products' });
  const product = mockProducts.find(p => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const name = locale === 'en' ? product.name.en : product.name.zh;
  const description = locale === 'en' ? product.shortDesc.en : product.shortDesc.zh;

  return {
    title: `${name} | CC Scale`,
    description,
    openGraph: {
      title,
      description,
      images: [product.image],
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  const locales = ['en', 'zh'];
  const params: Array<{ locale: string; slug: string }> = [];

  locales.forEach((locale) => {
    mockProducts.forEach((product) => {
      params.push({ locale, slug: product.slug });
    });
  });

  return params;
}

function ProductKeyFeatures({ locale }: { locale: string }) {
  return (
    <ul className="space-y-2">
      <li className="flex items-start">
        <Check className="h-5 w-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-olive-gray">
          {locale === 'en' ? 'High precision weighing sensor' : '高精度称重传感器'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-olive-gray">
          {locale === 'en' ? 'Automatic calibration' : '自动校准'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-olive-gray">
          {locale === 'en' ? 'Energy saving auto-off' : '节能自动关机'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-terracotta mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-olive-gray">
          {locale === 'en' ? '2-year warranty' : '2年保修'}
        </span>
      </li>
    </ul>
  );
}

function ProductDetailSkeleton() {
  return (
    <div>
      <section className="bg-warm-sand py-4 border-b border-border-cream">
        <div className="container mx-auto px-4">
          <Skeleton className="h-4 w-48" />
        </div>
      </section>

      <section className="py-12 bg-parchment">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square bg-warm-sand rounded-xl animate-pulse" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-40" />
              <div className="bg-warm-sand rounded-xl p-6 space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductDetailContent({
  slug,
}: {
  slug: string;
}) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  // Fetch product using React Query
  const { data: apiProduct, isLoading, error } = useProduct(slug);

  // Use mock data if API not available
  const product = apiProduct ? {
    id: apiProduct.id,
    slug: apiProduct.slug,
    sku: apiProduct.sku,
    name: { en: apiProduct.nameEn, zh: apiProduct.nameZh },
    category: apiProduct.category ? {
      slug: apiProduct.category.slug,
      name: { en: apiProduct.category.name, zh: apiProduct.category.name }
    } : { slug: 'all', name: { en: 'Products', zh: '产品' } },
    image: apiProduct.mainImage || 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    images: apiProduct.images?.map(img => img.imageUrl) || [apiProduct.mainImage || 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800'],
    videoUrl: apiProduct.videoUrl || '',
    description: { en: apiProduct.descriptionEn || '', zh: apiProduct.descriptionZh || '' },
    shortDesc: { en: apiProduct.shortDescEn || '', zh: apiProduct.shortDescZh || '' },
    priceMin: apiProduct.priceMin || 0,
    priceMax: apiProduct.priceMax || 0,
    moq: apiProduct.moq || 100,
    leadTime: apiProduct.leadTime || '15-20 days',
    isFeatured: apiProduct.isFeatured || false,
    specs: apiProduct.specs?.map(spec => ({
      key: { en: spec.labelEn, zh: spec.labelZh },
      value: { en: spec.valueEn, zh: spec.valueZh }
    })) || [],
    downloads: [],
    relatedProducts: [],
  } : mockProducts.find(p => p.slug === slug) || mockProducts[0];

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <ErrorBoundary>
          <div className="text-center py-20">
            <p className="text-stone-gray mb-4">
              {locale === 'en' ? 'Failed to load product' : '加载产品失败'}
            </p>
            <Button onClick={() => window.location.reload()} variant="accent">
              {locale === 'en' ? 'Try Again' : '重试'}
            </Button>
          </div>
        </ErrorBoundary>
      </div>
    );
  }

  const name = isZh ? product.name.zh : product.name.en;
  const description = isZh ? product.description.zh : product.description.en;
  const categoryName = isZh ? product.category.name.zh : product.category.name.en;

  return (
    <div>
      {/* Breadcrumb - Warm parchment theme */}
      <section className="bg-ivory py-4 border-b border-border-cream">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-stone-gray">
            <Link href="/" className="hover:text-charcoal-warm transition-colors">
              {isZh ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-charcoal-warm transition-colors">
              {isZh ? '产品中心' : 'Products'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{name}</span>
          </nav>
        </div>
      </section>

      {/* Main product section - Warm parchment theme */}
      <section className="py-12 bg-parchment">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ProductGallery
                images={product.images}
                name={name}
              />
            </div>

            <div>
              <div className="text-sm text-stone-gray mb-2">
                {categoryName}
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-4">
                {name}
              </h1>
              <div className="text-lg text-olive-gray mb-6">
                SKU: {product.sku}
              </div>

              {/* Price info card - Warm parchment theme */}
              <div className="bg-ivory rounded-xl border border-border-cream p-6 mb-6 shadow-whisper">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-stone-gray">
                      {isZh ? '价格区间' : 'Price Range'}
                    </div>
                    <div className="text-2xl font-serif font-medium text-terracotta mt-1">
                      ${product.priceMin} - ${product.priceMax}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-gray">
                      {isZh ? '最小起订量' : 'MOQ'}
                    </div>
                    <div className="text-2xl font-serif font-medium text-foreground mt-1">
                      {product.moq} {isZh ? '件' : 'pcs'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-stone-gray">
                      {isZh ? '交期' : 'Lead Time'}
                    </div>
                    <div className="text-2xl font-serif font-medium text-foreground mt-1">
                      {product.leadTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-none mb-8">
                <p className="text-olive-gray leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Key features */}
              <div className="mb-8">
                <ProductKeyFeatures locale={locale} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <QuickInquiryButton
                  product={{
                    id: product.id,
                    nameEn: product.name.en,
                    nameZh: product.name.zh,
                    sku: product.sku,
                    mainImage: product.image,
                    priceMin: product.priceMin,
                    priceMax: product.priceMax,
                  }}
                  className="flex-1"
                />
              </div>

              <div className="border-t border-border-cream pt-6">
                <h3 className="font-serif text-foreground mb-4">
                  {isZh ? '直接联系' : 'Contact Us Directly'}
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href="mailto:sales@ccscale.com">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="tel:+8612345678900">
                      <Phone className="h-4 w-4 mr-2" />
                      Phone
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="https://wa.me/8612345678900" target="_blank">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <ProductSpecTable specs={product.specs.map(s => ({
          keyEn: s.key.en,
          keyZh: s.key.zh,
          valueEn: s.value.en,
          valueZh: s.value.zh,
        }))} />
      </div>

      {product.videoUrl && (
        <div className="container mx-auto px-4">
          <ProductVideo videoUrl={product.videoUrl} />
        </div>
      )}

      <div className="container mx-auto px-4">
        <ProductDownloads downloads={product.downloads.map(d => ({
          titleEn: d.title.en,
          titleZh: d.title.zh,
          fileUrl: d.fileUrl,
          fileType: d.fileType,
          fileSize: d.fileSize,
        }))} />
      </div>

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <RelatedProducts products={product.relatedProducts.map(p => ({
          id: p.id,
          slug: p.slug,
          nameEn: p.name.en,
          nameZh: p.name.zh,
          image: p.image,
          sku: p.sku,
          priceMin: p.priceMin,
          priceMax: p.priceMax,
        }))} />
      )}
    </div>
  );
}

export default function ProductPage({ params: { locale, slug } }: Props) {
  const product = mockProducts.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  const name = locale === 'en' ? product.name.en : product.name.zh;
  const description = locale === 'en' ? product.shortDesc.en : product.shortDesc.zh;
  const baseUrl = 'https://www.ccscale.com';

  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '首页', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'Products' : '产品中心', url: `${baseUrl}/${locale}/products` },
    { name, url: `${baseUrl}/${locale}/products/${slug}` },
  ];

  return (
    <>
      <ProductSchema
        name={name}
        description={description}
        image={product.image}
        sku={product.sku}
        offers={{
          price: product.priceMin.toString(),
          priceCurrency: 'USD',
          url: `${baseUrl}/${locale}/products/${slug}`,
        }}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductDetailContent slug={slug} />
    </>
  );
}
