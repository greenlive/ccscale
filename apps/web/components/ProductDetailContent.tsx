'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MessageSquare, Mail, Phone, Factory, Shield, Clock, DollarSign, Share2, Heart, CheckCircle, Settings, Truck, Scale, Gauge, Ruler } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { ProductGallery } from '@/components/ProductGallery';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';
import { useProduct, useRelatedProducts, type ProductSpec } from '@/lib/api/queries';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductBulletPoints } from '@/components/product/ProductBulletPoints';
import { ProductApplicationScenarios } from '@/components/product/ProductApplicationScenarios';
import { ProductCertifications } from '@/components/product/ProductCertifications';
import { ProductFactoryShowcase } from '@/components/product/ProductFactoryShowcase';
import { ProductPackagingInfo } from '@/components/product/ProductPackagingInfo';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { ProductTradeInfo } from '@/components/product/ProductTradeInfo';
import { ProductSchema } from '@/components/SchemaOrg';

interface DisplaySpec {
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
}

const mockProduct = {
  id: 1,
  slug: 'digital-body-scale-bs-200',
  sku: 'BS-200',
  nameEn: 'Digital Body Scale BS-200',
  nameZh: '数字体重秤 BS-200',
  category: { slug: 'body-scales', name: 'Body Scales' },
  mainImage: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800',
  images: [
    { id: 1, imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800', order: 0, isMain: true },
    { id: 2, imageUrl: 'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=800', order: 1, isMain: false },
  ],
  videoUrl: '',
  descriptionEn: 'High-precision digital body scale with advanced weighing technology.',
  descriptionZh: '高精度数字体重秤，采用先进的称重技术。',
  priceMin: 15,
  priceMax: 25,
  moq: 100,
  leadTime: '15-20 days',
  isFeatured: true,
  specs: [
    { id: 1, labelEn: 'Capacity', labelZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅', order: 0 },
    { id: 2, labelEn: 'Division', labelZh: '分度值', valueEn: '100g', valueZh: '100克', order: 1 },
    { id: 3, labelEn: 'Display', labelZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸', order: 2 },
  ],
};

function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-12">
          <div className="animate-pulse flex-1">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="aspect-video bg-gray-200 rounded" />
          </div>
          <div className="w-full xl:w-[380px] animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailContent({ slug }: { slug: string }) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const [isFavorite, setIsFavorite] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const { data: apiProduct, isLoading, error } = useProduct(slug);
  const { data: relatedProducts } = useRelatedProducts(apiProduct?.id ?? 0, 4);
  const product = apiProduct || mockProduct;

  const productImages = product.images || [];
  const mainImage = productImages.find((img) => img.isMain) || productImages[0];
  const mainImageUrl = mainImage?.imageUrl || product.mainImage || '';
  const galleryImages = productImages.map((img) => img.imageUrl);

  const displaySpecs: DisplaySpec[] = (product.specs || []).map((spec: ProductSpec) => ({
    keyEn: spec.labelEn,
    keyZh: spec.labelZh,
    valueEn: spec.valueEn,
    valueZh: spec.valueZh,
  }));

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            {isZh ? '加载产品失败' : 'Failed to load product'}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {isZh ? '重试' : 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  const name = isZh ? (product.nameZh || product.nameEn || '') : (product.nameEn || product.nameZh || '');
  const description = isZh
    ? (product.descriptionZh || product.descriptionEn || '')
    : (product.descriptionEn || product.descriptionZh || '');
  const priceMin = product.priceMin ?? 0;
  const priceMax = product.priceMax ?? 0;
  const priceDisplay = priceMax > priceMin ? `$${priceMin} - $${priceMax}` : `$${priceMin}`;

  return (
    <div className="bg-white min-h-screen">
      {/* Schema.org Product Markup */}
      <ProductSchema
        name={product.nameEn || name}
        description={product.descriptionEn || description}
        image={mainImageUrl}
        sku={product.sku}
        brand="CC Scale"
        offers={{
          price: priceMin?.toString() || '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://www.ccscale.com/${locale}/products/${product.slug}`,
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">
              {isZh ? '首页' : 'Home'}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              {isZh ? '产品中心' : 'Products'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary">{name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content - New Layout with Sticky Right Column */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* Left Column - Scrollable Content */}
          <div className="flex-1 space-y-6">
            {/* Main Gallery */}
            <div className="relative">
              <ProductGallery
                mainImage={mainImageUrl}
                name={name}
                videoUrl={product.videoUrl}
                onVideoClick={() => setShowVideo(true)}
              />
            </div>

            {/* Detail Images - Stacked Full-Width */}
            {galleryImages.filter((img) => img !== mainImageUrl).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500">
                  {isZh ? '详情图片' : 'Product Details'}
                </h3>
                {galleryImages.filter((img) => img !== mainImageUrl).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => {
                      const win = window.open(img, '_blank');
                      win?.focus();
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${name} detail ${idx + 1}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 60vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Quick Specs Strip */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{isZh ? '价格区间' : 'Price Range'}</div>
                  <div className="font-bold text-primary text-lg">{priceDisplay}</div>
                  <div className="text-xs text-gray-400">/ {isZh ? '件' : 'pc'}</div>
                </div>
                <div className="text-center border-l border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{isZh ? '最小起订量' : 'MOQ'}</div>
                  <div className="font-bold text-primary text-lg">{product.moq}</div>
                  <div className="text-xs text-gray-400">{isZh ? '件' : 'pcs'}</div>
                </div>
                <div className="text-center border-l border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">{isZh ? '交期' : 'Lead Time'}</div>
                  <div className="font-bold text-primary text-lg">{product.leadTime}</div>
                </div>
              </div>
            </div>

            {/* Key Specifications Cards */}
            {(() => {
              const keySpecKeys = ['Capacity', 'Division', 'Platform Size', 'Power'];
              const keySpecs = displaySpecs.filter(spec =>
                keySpecKeys.includes(spec.keyEn)
              );
              const specIcons: Record<string, React.ReactNode> = {
                'Capacity': <Scale className="w-5 h-5" />,
                'Division': <Gauge className="w-5 h-5" />,
                'Platform Size': <Ruler className="w-5 h-5" />,
                'Power': <Settings className="w-5 h-5" />,
              };

              if (keySpecs.length === 0) return null;

              return (
                <div className="grid grid-cols-2 gap-3">
                  {keySpecs.map((spec, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                      <div className="text-primary mt-0.5">
                        {specIcons[spec.keyEn] || <Scale className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">
                          {isZh ? spec.keyZh : spec.keyEn}
                        </div>
                        <div className="font-bold text-primary text-sm">
                          {isZh ? spec.valueZh : spec.valueEn}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Specifications Table */}
            {displaySpecs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-primary text-white px-4 py-3 font-semibold">
                  {isZh ? '技术规格' : 'Specifications'}
                </div>
                <div className="p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-100">
                      {displaySpecs.map((spec, idx) => (
                        <tr key={idx}>
                          <th className="text-left py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                            {isZh ? spec.keyZh : spec.keyEn}
                          </th>
                          <td className="py-3 px-4 text-primary font-medium">
                            {isZh ? spec.valueZh : spec.valueEn}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Product Description */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-primary text-white px-4 py-3 font-semibold">
                {isZh ? '产品描述' : 'Description'}
              </div>
              <div className="p-4">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description || (isZh ? '暂无详细描述' : 'No description available')}
                </p>
              </div>
            </div>

            {/* OEM/ODM Section */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent border border-gray-200 rounded-xl p-6">
              <h3 className="font-bold text-primary mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isZh ? 'OEM/ODM 定制服务' : 'OEM/ODM Customization'}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {isZh
                  ? '我们提供全面的OEM/ODM服务，支持Logo定制、包装定制、功能定制等。'
                  : 'We provide full OEM/ODM services including logo customization, packaging design, and feature modifications.'}
              </p>
              <Link href="/oem-odm" className="text-primary text-sm font-medium hover:underline">
                {isZh ? '查看定制流程 →' : 'View Customization Process →'}
              </Link>
            </div>

            {/* Core Selling Points */}
            {(product as any).coreSellingPointsEn || (product as any).coreSellingPointsZh ? (
              <ProductBulletPoints
                pointsEn={(product as any).coreSellingPointsEn || ''}
                pointsZh={(product as any).coreSellingPointsZh || ''}
              />
            ) : null}

            {/* Application Scenarios */}
            {(product as any).applicationScenariosEn || (product as any).applicationScenariosZh ? (
              <ProductApplicationScenarios
                scenariosEn={(product as any).applicationScenariosEn || ''}
                scenariosZh={(product as any).applicationScenariosZh || ''}
                mainImage={mainImageUrl}
              />
            ) : null}

            {/* Trade Info */}
            <ProductTradeInfo
              hsCode={(product as any).hsCode}
              paymentTerms={(product as any).paymentTerms}
              shippingTerms={(product as any).shippingTerms}
              warrantyInfo={(product as any).warrantyInfo}
            />

            {/* Quality Control Section */}
            <div className="bg-gradient-to-r from-green-50 to-transparent border border-green-200 rounded-xl p-6">
              <h3 className="font-bold text-green-700 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {isZh ? '质量控制' : 'Quality Control Process'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isZh
                  ? '每个产品在包装前都会经过全量程校准(Full Calibration)和72小时老化测试(Aging Test)，确保产品性能稳定。'
                  : 'Every product undergoes Full Calibration and 72-hour Aging Test before packaging to ensure stable performance.'}
              </p>
            </div>

            {/* Logistics Section */}
            <div className="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                {isZh ? '物流与包装' : 'Shipping & Packaging'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isZh
                  ? '采用加固出口包装（多层泡沫保护+强化纸箱），适合长途海运和空运，有效防损。'
                  : 'Reinforced export packaging with multi-layer foam protection and reinforced cartons, suitable for long-distance sea and air freight.'}
              </p>
            </div>

            {/* Certifications */}
            {(product as any).certifications ? (
              <ProductCertifications certifications={(product as any).certifications} />
            ) : null}

            {/* Factory Showcase */}
            <ProductFactoryShowcase
              manufacturerName={(product as any).manufacturerName}
              factoryLocation={(product as any).factoryLocation}
              productionCapacity={(product as any).productionCapacity}
            />

            {/* Packaging Info */}
            <ProductPackagingInfo
              packagingInfoEn={(product as any).packagingInfoEn}
              packagingInfoZh={(product as any).packagingInfoZh}
            />

            {/* FAQ */}
            <ProductFAQ
              faqEn={(product as any).faqEn}
              faqZh={(product as any).faqZh}
            />

            {/* Related Products */}
            {relatedProducts && relatedProducts.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-lg font-bold text-primary mb-4">
                  {isZh ? '其他产品推荐' : 'You May Also Like'}
                </h2>
                <div className="grid grid-cols-4 gap-2">
                  {relatedProducts.map((related) => {
                    const relatedName = isZh ? (related.nameZh || related.nameEn || '') : (related.nameEn || related.nameZh || '');
                    const relatedMainImage = related.images?.find((img: any) => img.isMain)?.imageUrl || related.mainImage || '';
                    const relatedPriceMin = related.priceMin ?? 0;
                    const relatedPriceMax = related.priceMax ?? 0;
                    const relatedPriceDisplay = relatedPriceMax > relatedPriceMin
                      ? `$${relatedPriceMin}-$${relatedPriceMax}`
                      : `$${relatedPriceMin}`;

                    return (
                      <Link
                        key={related.id}
                        href={`/products/${related.slug}`}
                        className="group block bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                          {relatedMainImage ? (
                            <Image
                              src={relatedMainImage}
                              alt={relatedName}
                              fill
                              sizes="150px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="p-1.5">
                          <h3 className="font-medium text-[10px] text-primary line-clamp-2 leading-tight">
                            {relatedName}
                          </h3>
                          <p className="text-[10px] font-bold text-primary mt-0.5">
                            {relatedPriceDisplay}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sticky Product Info */}
          <div className="hidden xl:block w-[380px] xl:sticky xl:top-20 xl:self-start xl:space-y-6">
            {/* Product Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="text-sm text-gray-500 mb-2">
                {product.category?.name || (isZh ? '产品分类' : 'Product')}
              </div>
              <h1 className="text-2xl font-bold text-primary mb-2">
                {name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>SKU: {product.sku}</span>
                {product.isFeatured && (
                  <span className="bg-primary text-white px-2 py-0.5 rounded text-xs">
                    {isZh ? '精选' : 'Featured'}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Price Info */}
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="text-sm mb-2 opacity-80">{isZh ? 'FOB 价格' : 'FOB Price'}</div>
              <div className="text-3xl font-bold mb-1">{priceDisplay}</div>
              <div className="text-sm opacity-80">/ {isZh ? '件 (USD)' : 'pc (USD)'}</div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span>{isZh ? '最小起订量' : 'MOQ'}:</span>
                  <span className="font-semibold">{product.moq} {isZh ? '件' : 'pcs'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>{isZh ? '交期' : 'Lead Time'}:</span>
                  <span className="font-semibold">{product.leadTime}</span>
                </div>
              </div>
            </div>

            {/* Core Selling Points */}
            {(product as any).coreSellingPointsEn || (product as any).coreSellingPointsZh ? (
              <ProductBulletPoints
                pointsEn={(product as any).coreSellingPointsEn || ''}
                pointsZh={(product as any).coreSellingPointsZh || ''}
              />
            ) : null}

            {/* Action Buttons */}
            <div className="space-y-3">
              <QuickInquiryButton
                product={{
                  id: product.id,
                  nameEn: product.nameEn || '',
                  nameZh: product.nameZh || '',
                  sku: product.sku || '',
                  mainImage: mainImageUrl || '',
                  priceMin: product.priceMin || 0,
                  priceMax: product.priceMax || 0,
                }}
                className="w-full"
              />

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-primary text-gray-600 hover:text-primary'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  <span className="text-sm">{isZh ? '收藏' : 'Favorite'}</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 hover:border-primary text-gray-600 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{isZh ? '分享' : 'Share'}</span>
                </button>
                <a
                  href={`https://wa.me/8612345678900?text=${encodeURIComponent(`${name} - ${product.sku}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 rounded-lg border border-green-500 text-green-600 hover:bg-green-50 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200">
                  <Factory className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-primary">CC Scale Co., Ltd</div>
                  <div className="text-sm text-gray-500">{isZh ? '认证制造商' : 'Verified Manufacturer'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Shield, text: isZh ? '品质保证' : 'Quality Assured' },
                  { icon: Clock, text: isZh ? '快速响应' : 'Fast Response' },
                  { icon: DollarSign, text: isZh ? '支持定制' : 'Customizable' },
                  { icon: Settings, text: isZh ? '出口认证' : 'Export Ready' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-primary rounded-xl p-4 text-white">
              <div className="text-sm mb-3 opacity-80">{isZh ? '有问题想咨询？' : 'Have questions?'}</div>
              <div className="flex flex-col gap-2">
                <a href="mailto:sales@ccscale.com" className="flex items-center gap-2 hover:text-warm-silver transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">sales@ccscale.com</span>
                </a>
                <a href="tel:+8612345678900" className="flex items-center gap-2 hover:text-warm-silver transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+86 123 4567 8900</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && product.videoUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video src={product.videoUrl} controls autoPlay className="w-full h-full" />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Inquiry Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 xl:hidden">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={mainImageUrl}
              alt={name}
              width={50}
              height={50}
              className="rounded-lg object-cover"
            />
            <div>
              <div className="font-bold text-primary">{name}</div>
              <div className="text-sm text-gray-500">{priceDisplay} / {isZh ? '件' : 'pc'}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <QuickInquiryButton
              product={{
                id: product.id,
                nameEn: product.nameEn || '',
                nameZh: product.nameZh || '',
                sku: product.sku || '',
                mainImage: mainImageUrl || '',
                priceMin: product.priceMin || 0,
                priceMax: product.priceMax || 0,
              }}
              className="px-6"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
