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
import type { Metadata } from 'next';

const products = [
  {
    id: 1,
    slug: 'digital-body-scale-bs-200',
    sku: 'BS-200',
    nameEn: 'Digital Body Scale BS-200',
    nameZh: '数字体重秤 BS-200',
    category: 'body-scales',
    categoryNameEn: 'Body Scales',
    categoryNameZh: '体重秤',
    image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    images: [
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
      'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
    ],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    descriptionEn: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display.',
    descriptionZh: '高精度数字体重秤，采用先进的称重技术。功能包括即踩即称、自动校准和大液晶显示屏。',
    shortDescEn: 'Professional digital body scale for home and commercial use',
    shortDescZh: '适用于家庭和商业用途的专业数字体重秤',
    priceMin: 15,
    priceMax: 25,
    moq: 100,
    leadTime: '15-20 days',
    isFeatured: true,
    specs: [
      { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅' },
      { keyEn: 'Division', keyZh: '分度值', valueEn: '100g', valueZh: '100克' },
      { keyEn: 'Display', keyZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸' },
      { keyEn: 'Power', keyZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池' },
      { keyEn: 'Dimensions', keyZh: '尺寸', valueEn: '300 x 300 x 25mm', valueZh: '300 x 300 x 25毫米' },
      { keyEn: 'Material', keyZh: '材质', valueEn: 'Tempered glass', valueZh: '钢化玻璃' },
    ],
    downloads: [
      {
        id: '1',
        titleEn: 'Product Catalog',
        titleZh: '产品目录',
        fileUrl: '/downloads/catalog.pdf',
        fileType: 'PDF' as const,
        fileSize: '2.4 MB',
      },
      {
        id: '2',
        titleEn: 'Specification Sheet',
        titleZh: '规格书',
        fileUrl: '/downloads/bs-200-specs.pdf',
        fileType: 'PDF' as const,
        fileSize: '450 KB',
      },
    ],
    relatedProducts: [
      {
        id: 2,
        slug: 'industrial-hanging-scale-hs-500',
        nameEn: 'Industrial Hanging Scale HS-500',
        nameZh: '工业吊秤 HS-500',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        sku: 'HS-500',
        priceMin: 45,
        priceMax: 85,
      },
      {
        id: 3,
        slug: 'precision-kitchen-scale-ks-300',
        nameEn: 'Precision Kitchen Scale KS-300',
        nameZh: '精密厨房秤 KS-300',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
        sku: 'KS-300',
        priceMin: 12,
        priceMax: 20,
      },
    ],
  },
  {
    id: 2,
    slug: 'industrial-hanging-scale-hs-500',
    sku: 'HS-500',
    nameEn: 'Industrial Hanging Scale HS-500',
    nameZh: '工业吊秤 HS-500',
    category: 'hanging-scales',
    categoryNameEn: 'Hanging Scales',
    categoryNameZh: '吊秤',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    videoUrl: '',
    descriptionEn: 'Heavy-duty industrial hanging scale designed for commercial and industrial applications. Perfect for weighing heavy loads in factories, warehouses, and markets.',
    descriptionZh: '重型工业吊秤，专为商业和工业应用设计。非常适合在工厂、仓库和市场称量重物。',
    shortDescEn: 'Heavy-duty hanging scale for industrial use',
    shortDescZh: '工业用重型吊秤',
    priceMin: 45,
    priceMax: 85,
    moq: 50,
    leadTime: '20-25 days',
    isFeatured: true,
    specs: [
      { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '500kg', valueZh: '500公斤' },
      { keyEn: 'Division', keyZh: '分度值', valueEn: '200g', valueZh: '200克' },
      { keyEn: 'Display', keyZh: '显示', valueEn: 'LED, 5 digit', valueZh: 'LED, 5位数字' },
      { keyEn: 'Power', keyZh: '电源', valueEn: 'Rechargeable battery', valueZh: '可充电电池' },
    ],
    downloads: [
      {
        id: '1',
        titleEn: 'Industrial Scales Catalog',
        titleZh: '工业秤目录',
        fileUrl: '/downloads/industrial-catalog.pdf',
        fileType: 'PDF' as const,
        fileSize: '3.1 MB',
      },
    ],
    relatedProducts: [
      {
        id: 1,
        slug: 'digital-body-scale-bs-200',
        nameEn: 'Digital Body Scale BS-200',
        nameZh: '数字体重秤 BS-200',
        image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
        sku: 'BS-200',
        priceMin: 15,
        priceMax: 25,
      },
      {
        id: 3,
        slug: 'precision-kitchen-scale-ks-300',
        nameEn: 'Precision Kitchen Scale KS-300',
        nameZh: '精密厨房秤 KS-300',
        image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
        sku: 'KS-300',
        priceMin: 12,
        priceMax: 20,
      },
    ],
  },
  {
    id: 3,
    slug: 'precision-kitchen-scale-ks-300',
    sku: 'KS-300',
    nameEn: 'Precision Kitchen Scale KS-300',
    nameZh: '精密厨房秤 KS-300',
    category: 'kitchen-scales',
    categoryNameEn: 'Kitchen Scales',
    categoryNameZh: '厨房秤',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    images: [
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    ],
    videoUrl: '',
    descriptionEn: 'Professional precision kitchen scale for accurate food measurement. Perfect for cooking, baking, and portion control.',
    descriptionZh: '专业精密厨房秤，用于精确食物测量。非常适合烹饪、烘焙和份量控制。',
    shortDescEn: 'Accurate digital kitchen scale',
    shortDescZh: '精确的数字厨房秤',
    priceMin: 12,
    priceMax: 20,
    moq: 200,
    leadTime: '12-15 days',
    isFeatured: false,
    specs: [
      { keyEn: 'Capacity', keyZh: '最大称重', valueEn: '5kg / 11lb', valueZh: '5公斤 / 11磅' },
      { keyEn: 'Division', keyZh: '分度值', valueEn: '1g', valueZh: '1克' },
      { keyEn: 'Display', keyZh: '显示', valueEn: 'LCD', valueZh: '液晶显示屏' },
      { keyEn: 'Power', keyZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池' },
    ],
    downloads: [],
    relatedProducts: [
      {
        id: 1,
        slug: 'digital-body-scale-bs-200',
        nameEn: 'Digital Body Scale BS-200',
        nameZh: '数字体重秤 BS-200',
        image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
        sku: 'BS-200',
        priceMin: 15,
        priceMax: 25,
      },
      {
        id: 2,
        slug: 'industrial-hanging-scale-hs-500',
        nameEn: 'Industrial Hanging Scale HS-500',
        nameZh: '工业吊秤 HS-500',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        sku: 'HS-500',
        priceMin: 45,
        priceMax: 85,
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
  const product = products.find(p => p.slug === slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const name = locale === 'en' ? product.nameEn : product.nameZh;
  const description = locale === 'en' ? product.shortDescEn : product.shortDescZh;

  return {
    title: `${name} | CC Scale`,
    description,
    openGraph: {
      title: name,
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
    products.forEach((product) => {
      params.push({ locale, slug: product.slug });
    });
  });

  return params;
}

function ProductKeyFeatures({ locale }: { locale: string }) {
  return (
    <ul className="space-y-2">
      <li className="flex items-start">
        <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-gray-600">
          {locale === 'en' ? 'High precision weighing sensor' : '高精度称重传感器'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-gray-600">
          {locale === 'en' ? 'Automatic calibration' : '自动校准'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-gray-600">
          {locale === 'en' ? 'Energy saving auto-off' : '节能自动关机'}
        </span>
      </li>
      <li className="flex items-start">
        <Check className="h-5 w-5 text-accent mr-2 flex-shrink-0 mt-0.5" />
        <span className="text-gray-600">
          {locale === 'en' ? '2-year warranty' : '2年保修'}
        </span>
      </li>
    </ul>
  );
}

function ProductDetailContent({
  product,
}: {
  product: typeof products[0];
}) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  const name = isZh ? product.nameZh : product.nameEn;
  const description = isZh ? product.descriptionEn : product.descriptionZh;
  const categoryName = isZh ? product.categoryNameZh : product.categoryNameEn;

  return (
    <div>
      <section className="bg-gray-50 py-4 border-b">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-500">
            <a href="/" className="hover:text-[#0A1628]">
              {isZh ? '首页' : 'Home'}
            </a>
            <span className="mx-2">/</span>
            <a href="/products" className="hover:text-[#0A1628]">
              {isZh ? '产品中心' : 'Products'}
            </a>
            <span className="mx-2">/</span>
            <span className="text-[#0A1628]">{name}</span>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <ProductGallery
                images={product.images}
                name={name}
              />
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-2">
                {categoryName}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-4">
                {name}
              </h1>
              <div className="text-lg text-gray-600 mb-6">
                SKU: {product.sku}
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">
                      {isZh ? '价格区间' : 'Price Range'}
                    </div>
                    <div className="text-2xl font-bold text-accent mt-1">
                      ${product.priceMin} - ${product.priceMax}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {isZh ? '最小起订量' : 'MOQ'}
                    </div>
                    <div className="text-2xl font-bold text-[#0A1628] mt-1">
                      {product.moq} {isZh ? '件' : 'pcs'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      {isZh ? '交期' : 'Lead Time'}
                    </div>
                    <div className="text-2xl font-bold text-[#0A1628] mt-1">
                      {product.leadTime}
                    </div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none mb-8">
                <p className="text-gray-600 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <QuickInquiryButton
                  product={{
                    id: product.id,
                    nameEn: product.nameEn,
                    nameZh: product.nameZh,
                    sku: product.sku,
                    mainImage: product.image,
                    priceMin: product.priceMin,
                    priceMax: product.priceMax,
                  }}
                  className="flex-1 bg-accent hover:bg-accent/90"
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-[#0A1628] mb-4">
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
        <ProductSpecTable specs={product.specs} />
      </div>

      {product.videoUrl && (
        <div className="container mx-auto px-4">
          <ProductVideo videoUrl={product.videoUrl} />
        </div>
      )}

      <div className="container mx-auto px-4">
        <ProductDownloads downloads={product.downloads} />
      </div>

      {product.relatedProducts && product.relatedProducts.length > 0 && (
        <RelatedProducts products={product.relatedProducts} />
      )}
    </div>
  );
}

export default function ProductPage({ params: { locale, slug } }: Props) {
  const product = products.find(p => p.slug === slug);

  if (!product) {
    notFound();
  }

  const name = locale === 'en' ? product.nameEn : product.nameZh;
  const description = locale === 'en' ? product.shortDescEn : product.shortDescZh;
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
      <ProductDetailContent product={product} />
    </>
  );
}
