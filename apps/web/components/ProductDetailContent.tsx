'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MessageSquare, Mail, Phone, Factory, Shield, Clock, DollarSign, Share2, Heart, CheckCircle, Settings, Truck, Scale, Gauge, Ruler, ShieldCheck, Award, Globe, Users, Package, Leaf } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { ProductGallery } from '@/components/ProductGallery';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';
import { useProduct, useRelatedProducts, type ProductSpec } from '@/lib/api/queries';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ProductBulletPoints } from '@/components/product/ProductBulletPoints';
import { ProductApplicationScenarios } from '@/components/product/ProductApplicationScenarios';
import { ProductCertifications } from '@/components/product/ProductCertifications';
import { ProductPackagingInfo } from '@/components/product/ProductPackagingInfo';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { ProductTradeInfo } from '@/components/product/ProductTradeInfo';
import { ProductSchema } from '@/components/SchemaOrg';
import { ProductDetailImages } from '@/components/product/ProductDetailImages';
import { ProductAttributes } from '@/components/product/ProductAttributes';
import { ProductCustomerCases } from '@/components/product/ProductCustomerCases';

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
  mainImages: JSON.stringify(['https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=800']),
  detailImages: JSON.stringify([
    'https://images.unsplash.com/photo-1583864697784-a0efc8379f70?w=800',
    'https://images.unsplash.com/photo-1609347561607-6f26a7c3d1e4?w=800'
  ]),
  videos: '[]',
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
  certifications: ['CE', 'FCC', 'RoHS', 'ISO9001'],
  factoryYears: 15,
  factoryCountries: 50,
  factoryCapacity: '50K+',
  factoryDescription: 'Professional weighing equipment manufacturer with complete R&D, production, and sales system.',
  seoKeywordsEn: 'Digital Scale, Body Scale, Bathroom Scale, Weighing Scale, Health Scale, Precision Scale',
  specs: [
    { id: 1, keyEn: 'Capacity', keyZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅', order: 0 },
    { id: 2, keyEn: 'Division', keyZh: '分度值', valueEn: '100g', valueZh: '100克', order: 1 },
    { id: 3, keyEn: 'Display', keyZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸', order: 2 },
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

  // Parse new image fields
  const mainImagesList = product.mainImages ? JSON.parse(product.mainImages) : (product.mainImage ? [product.mainImage] : []);
  const detailImagesList = product.detailImages ? JSON.parse(product.detailImages) : [];
  const videosList = product.videos ? JSON.parse(product.videos) : (product.videoUrl ? [product.videoUrl] : []);

  const displaySpecs: DisplaySpec[] = (product.specs || []).map((spec: ProductSpec) => ({
    keyEn: spec.keyEn,
    keyZh: spec.keyZh,
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
        additionalProperty={displaySpecs.map(spec => ({
          name: spec.keyEn,
          value: spec.valueEn,
        }))}
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
      <div className="container mx-auto px-4 py-8 pb-20 xl:pb-8">
        <div className="flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* Left Column - Scrollable Content */}
          <div className="flex-1 space-y-6">
            {/* Main Gallery - Product Showcase with main images and videos */}
            <div className="relative">
              <ProductGallery
                mainImages={mainImagesList.length > 0 ? mainImagesList : undefined}
                mainImage={mainImageUrl}
                videos={videosList.length > 0 ? videosList : undefined}
                name={name}
                videoUrl={product.videoUrl}
                onVideoClick={() => setShowVideo(true)}
              />
            </div>

            {/* Product Detail Images - Detailed product images for buyers */}
            {detailImagesList.length > 0 && (
              <ProductDetailImages
                images={detailImagesList}
                productName={name}
              />
            )}

            {/* === FEATURE: 产品展示 === */}
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

            {/* Specifications - Semantic dl/dt/dd for SEO and AI */}
            {displaySpecs.length > 0 && (
              <ProductAttributes
                specs={displaySpecs}
                titleEn="Specifications"
                titleZh="规格参数"
              />
            )}

            {/* === ADVANTAGE: 产品优势 === */}
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

            {/* Application Scenarios */}
            {(product as any).applicationScenariosEn || (product as any).applicationScenariosZh ? (
              <ProductApplicationScenarios
                scenariosEn={(product as any).applicationScenariosEn || ''}
                scenariosZh={(product as any).applicationScenariosZh || ''}
                mainImage={mainImageUrl}
              />
            ) : null}

            {/* Why Choose Us Section */}
            <div className="bg-gradient-to-r from-green-50 via-white to-green-50 border border-green-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-700">{isZh ? '为什么选择我们' : 'Why Choose Us'}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Factory, title: isZh ? '源头工厂' : 'Manufacturer', desc: product.factoryYears ? `${product.factoryYears}+ ${isZh ? '年' : 'Years'} ${isZh ? '专业生产经验' : 'Professional Experience'}` : '15 Years Professional Experience' },
                  { icon: Globe, title: isZh ? '全球出口' : 'Global Export', desc: product.factoryCountries ? `${isZh ? '出口到' : 'Export to '}${product.factoryCountries}+ ${isZh ? '国家' : 'Countries'}` : 'Export to 50+ Countries' },
                  { icon: Leaf, title: isZh ? '环保认证' : 'Eco Certified', desc: isZh ? 'RoHS/REACH合规' : 'RoHS/REACH Compliant' },
                  { icon: Users, title: isZh ? 'OEM/ODM' : 'OEM/ODM Service', desc: isZh ? '支持定制生产' : 'Custom Production Support' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
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

            {/* === TRUST: 信任背书 === */}
            {/* Certifications */}
            {(product as any).certifications ? (
              <ProductCertifications certifications={(product as any).certifications} />
            ) : null}

            {/* Factory Info Section */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-700">{isZh ? '工厂实力' : 'Factory Capabilities'}</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryYears || 15}+</div>
                  <div className="text-xs text-gray-500">{isZh ? '年行业经验' : 'Years Experience'}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryCapacity || '50K+'}</div>
                  <div className="text-xs text-gray-500">{isZh ? '年产能(台)' : 'Annual Capacity'}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryCountries || 50}+</div>
                  <div className="text-xs text-gray-500">{isZh ? '出口国家' : 'Export Countries'}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{product.factoryDescription || (isZh ? '专业衡器制造商，拥有完整的研发、生产、销售体系。产品远销欧洲、北美、东南亚等地区。' : 'Professional weighing equipment manufacturer with complete R&D, production, and sales system. Products exported to Europe, North America, Southeast Asia, and more.')}</p>
              </div>
            </div>

            {/* Customer Cases */}
            <ProductCustomerCases
              cases={(product as any).customerCases}
            />

            {/* === TRANSACTION: 交易条件 === */}
            {/* Trade Info */}
            <ProductTradeInfo
              hsCode={(product as any).hsCode}
              paymentTerms={(product as any).paymentTerms}
              shippingTerms={(product as any).shippingTerms}
              warrantyInfo={(product as any).warrantyInfo}
            />

            {/* Trade Keywords Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-primary text-sm">{isZh ? '热门搜索词' : 'Trade Keywords'}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(product.seoKeywordsEn ? product.seoKeywordsEn.split(',').map(k => k.trim()) : ['Digital Scale', 'Body Scale', 'Bathroom Scale', 'Weighing Scale', 'Health Scale', 'Precision Scale', 'Electronic Scale', 'Smart Scale']).map((keyword) => (
                  <a
                    key={keyword}
                    href={`/products?keyword=${encodeURIComponent(keyword)}`}
                    className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-primary hover:text-primary transition-colors"
                  >
                    {keyword}
                  </a>
                ))}
              </div>
            </div>

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
                {(isZh
                  ? ((product.category as any)?.nameZh || (product.category as any)?.name || '产品分类')
                  : ((product.category as any)?.nameEn || (product.category as any)?.name || 'Product')
                )}
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

            {/* Action Buttons - Enhanced Prominent Inquiry */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-xl blur opacity-30"></div>
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
                  className="relative w-full bg-gradient-to-r from-primary to-primary/90 text-white font-bold py-4 px-6 rounded-xl hover:from-primary/90 hover:to-primary/80 shadow-lg hover:shadow-xl transition-all duration-300 text-base"
                />
              </div>
              <p className="text-xs text-center text-gray-500">{isZh ? '通常在2小时内回复' : 'Typically replies within 2 hours'}</p>

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

            {/* Risk Reversal - Sample Policy & Warranty */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {isZh ? '样品服务' : 'Sample Service'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isZh ? '支持样品订单，3-5个工作日发出' : 'Sample orders available, ships in 3-5 business days'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {isZh ? '质量保障' : 'Quality Assurance'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isZh ? '12个月质保期，支持第三方验货' : '12-month warranty, third-party inspection supported'}
                  </div>
                </div>
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
