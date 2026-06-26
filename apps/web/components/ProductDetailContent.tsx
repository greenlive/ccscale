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
  nameZh: '鏁板瓧浣撻噸绉?BS-200',
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
  descriptionZh: '楂樼簿搴︽暟瀛椾綋閲嶇Г锛岄噰鐢ㄥ厛杩涚殑绉伴噸鎶€鏈€?,
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
    { id: 1, keyEn: 'Capacity', keyZh: '鏈€澶хО閲?, valueEn: '180kg / 400lb', valueZh: '180鍏枻 / 400纾?, order: 0 },
    { id: 2, keyEn: 'Division', keyZh: '鍒嗗害鍊?, valueEn: '100g', valueZh: '100鍏?, order: 1 },
    { id: 3, keyEn: 'Display', keyZh: '鏄剧ず', valueEn: 'LCD, 3.5"', valueZh: '娑叉櫠鏄剧ず灞? 3.5鑻卞', order: 2 },
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
  const [companyName, setCompanyName] = useState('CC Scale Co., Ltd');

  // Fetch dynamic company name from site settings
  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, unknown>) => { if (data.companyNameEn) setCompanyName(String(data.companyNameEn)); })
      .catch(() => {});
  }, []);

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
            {isZh ? '鍔犺浇浜у搧澶辫触' : 'Failed to load product'}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {isZh ? '閲嶈瘯' : 'Try Again'}
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
        offers={{
          price: priceMin?.toString() || '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: `https://www.zzscale.com/${locale}/products/${product.slug}`,
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
              {isZh ? '棣栭〉' : 'Home'}
            </Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary transition-colors">
              {isZh ? '浜у搧涓績' : 'Products'}
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

            {/* === FEATURE: 浜у搧灞曠ず === */}
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
                titleZh="瑙勬牸鍙傛暟"
              />
            )}

            {/* === ADVANTAGE: 浜у搧浼樺娍 === */}
            {/* Product Description */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-primary text-white px-4 py-3 font-semibold">
                {isZh ? '浜у搧鎻忚堪' : 'Description'}
              </div>
              <div className="p-4">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {description || (isZh ? '鏆傛棤璇︾粏鎻忚堪' : 'No description available')}
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
                <h3 className="font-bold text-green-700">{isZh ? '涓轰粈涔堥€夋嫨鎴戜滑' : 'Why Choose Us'}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Factory, title: isZh ? '婧愬ご宸ュ巶' : 'Manufacturer', desc: product.factoryYears ? `${product.factoryYears}+ ${isZh ? '骞? : 'Years'} ${isZh ? '涓撲笟鐢熶骇缁忛獙' : 'Professional Experience'}` : '15 Years Professional Experience' },
                  { icon: Globe, title: isZh ? '鍏ㄧ悆鍑哄彛' : 'Global Export', desc: product.factoryCountries ? `${isZh ? '鍑哄彛鍒? : 'Export to '}${product.factoryCountries}+ ${isZh ? '鍥藉' : 'Countries'}` : 'Export to 50+ Countries' },
                  { icon: Leaf, title: isZh ? '鐜繚璁よ瘉' : 'Eco Certified', desc: isZh ? 'RoHS/REACH鍚堣' : 'RoHS/REACH Compliant' },
                  { icon: Users, title: isZh ? 'OEM/ODM' : 'OEM/ODM Service', desc: isZh ? '鏀寔瀹氬埗鐢熶骇' : 'Custom Production Support' },
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
                {isZh ? 'OEM/ODM 瀹氬埗鏈嶅姟' : 'OEM/ODM Customization'}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {isZh
                  ? '鎴戜滑鎻愪緵鍏ㄩ潰鐨凮EM/ODM鏈嶅姟锛屾敮鎸丩ogo瀹氬埗銆佸寘瑁呭畾鍒躲€佸姛鑳藉畾鍒剁瓑銆?
                  : 'We provide full OEM/ODM services including logo customization, packaging design, and feature modifications.'}
              </p>
              <Link href="/oem-odm" className="text-primary text-sm font-medium hover:underline">
                {isZh ? '鏌ョ湅瀹氬埗娴佺▼ 鈫? : 'View Customization Process 鈫?}
              </Link>
            </div>

            {/* === TRUST: 淇′换鑳屼功 === */}
            {/* Certifications */}
            {(product as any).certifications ? (
              <ProductCertifications certifications={(product as any).certifications} />
            ) : null}

            {/* Factory Info Section */}
            <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-blue-700">{isZh ? '宸ュ巶瀹炲姏' : 'Factory Capabilities'}</h3>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryYears || 15}+</div>
                  <div className="text-xs text-gray-500">{isZh ? '骞磋涓氱粡楠? : 'Years Experience'}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryCapacity || '50K+'}</div>
                  <div className="text-xs text-gray-500">{isZh ? '骞翠骇鑳?鍙?' : 'Annual Capacity'}</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{product.factoryCountries || 50}+</div>
                  <div className="text-xs text-gray-500">{isZh ? '鍑哄彛鍥藉' : 'Export Countries'}</div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>{product.factoryDescription || (isZh ? '涓撲笟琛″櫒鍒堕€犲晢锛屾嫢鏈夊畬鏁寸殑鐮斿彂銆佺敓浜с€侀攢鍞綋绯汇€備骇鍝佽繙閿€娆ф床銆佸寳缇庛€佷笢鍗椾簹绛夊湴鍖恒€? : 'Professional weighing equipment manufacturer with complete R&D, production, and sales system. Products exported to Europe, North America, Southeast Asia, and more.')}</p>
              </div>
            </div>

            {/* Customer Cases */}
            <ProductCustomerCases
              cases={(product as any).customerCases}
            />

            {/* === TRANSACTION: 浜ゆ槗鏉′欢 === */}
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
                <h3 className="font-semibold text-primary text-sm">{isZh ? '鐑棬鎼滅储璇? : 'Trade Keywords'}</h3>
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
                {isZh ? '璐ㄩ噺鎺у埗' : 'Quality Control Process'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isZh
                  ? '姣忎釜浜у搧鍦ㄥ寘瑁呭墠閮戒細缁忚繃鍏ㄩ噺绋嬫牎鍑?Full Calibration)鍜?2灏忔椂鑰佸寲娴嬭瘯(Aging Test)锛岀‘淇濅骇鍝佹€ц兘绋冲畾銆?
                  : 'Every product undergoes Full Calibration and 72-hour Aging Test before packaging to ensure stable performance.'}
              </p>
            </div>

            {/* Logistics Section */}
            <div className="bg-gradient-to-r from-blue-50 to-transparent border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                {isZh ? '鐗╂祦涓庡寘瑁? : 'Shipping & Packaging'}
              </h3>
              <p className="text-gray-600 text-sm">
                {isZh
                  ? '閲囩敤鍔犲浐鍑哄彛鍖呰锛堝灞傛场娌繚鎶?寮哄寲绾哥锛夛紝閫傚悎闀块€旀捣杩愬拰绌鸿繍锛屾湁鏁堥槻鎹熴€?
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
                  {isZh ? '鍏朵粬浜у搧鎺ㄨ崘' : 'You May Also Like'}
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
                  ? ((product.category as any)?.nameZh || (product.category as any)?.name || '浜у搧鍒嗙被')
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
                    {isZh ? '绮鹃€? : 'Featured'}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Price Info */}
            <div className="bg-primary text-white rounded-xl p-6">
              <div className="text-sm mb-2 opacity-80">{isZh ? 'FOB 浠锋牸' : 'FOB Price'}</div>
              <div className="text-3xl font-bold mb-1">{priceDisplay}</div>
              <div className="text-sm opacity-80">/ {isZh ? '浠?(USD)' : 'pc (USD)'}</div>
              <div className="mt-3 pt-3 border-t border-white/20">
                <div className="flex justify-between text-sm">
                  <span>{isZh ? '鏈€灏忚捣璁㈤噺' : 'MOQ'}:</span>
                  <span className="font-semibold">{product.moq} {isZh ? '浠? : 'pcs'}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>{isZh ? '浜ゆ湡' : 'Lead Time'}:</span>
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
              <p className="text-xs text-center text-gray-500">{isZh ? '閫氬父鍦?灏忔椂鍐呭洖澶? : 'Typically replies within 2 hours'}</p>

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
                  <span className="text-sm">{isZh ? '鏀惰棌' : 'Favorite'}</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-gray-300 hover:border-primary text-gray-600 hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">{isZh ? '鍒嗕韩' : 'Share'}</span>
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
                    {isZh ? '鏍峰搧鏈嶅姟' : 'Sample Service'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isZh ? '鏀寔鏍峰搧璁㈠崟锛?-5涓伐浣滄棩鍙戝嚭' : 'Sample orders available, ships in 3-5 business days'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {isZh ? '璐ㄩ噺淇濋殰' : 'Quality Assurance'}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {isZh ? '12涓湀璐ㄤ繚鏈燂紝鏀寔绗笁鏂归獙璐? : '12-month warranty, third-party inspection supported'}
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
                  <div className="font-semibold text-primary">{companyName}</div>
                  <div className="text-sm text-gray-500">{isZh ? '璁よ瘉鍒堕€犲晢' : 'Verified Manufacturer'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Shield, text: isZh ? '鍝佽川淇濊瘉' : 'Quality Assured' },
                  { icon: Clock, text: isZh ? '蹇€熷搷搴? : 'Fast Response' },
                  { icon: DollarSign, text: isZh ? '鏀寔瀹氬埗' : 'Customizable' },
                  { icon: Settings, text: isZh ? '鍑哄彛璁よ瘉' : 'Export Ready' },
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
              <div className="text-sm mb-3 opacity-80">{isZh ? '鏈夐棶棰樻兂鍜ㄨ锛? : 'Have questions?'}</div>
              <div className="flex flex-col gap-2">
                <a href="mailto:sales@zzscale.com" className="flex items-center gap-2 hover:text-warm-silver transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">sales@zzscale.com</span>
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
              <div className="text-sm text-gray-500">{priceDisplay} / {isZh ? '浠? : 'pc'}</div>
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
