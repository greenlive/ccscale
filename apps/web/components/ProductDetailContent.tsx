'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MessageSquare, Mail, Phone, Factory, Award, Shield, Clock, DollarSign, Share2, Heart, CheckCircle, Play } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { ProductGallery } from '@/components/ProductGallery';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';
import { useProduct, type ProductSpec } from '@/lib/api/queries';
import { useState } from 'react';
import Image from 'next/image';

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
  descriptionEn: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display.',
  descriptionZh: '高精度数字体重秤，采用先进的称重技术。功能包括即踩即称、自动校准和大液晶显示屏。',
  priceMin: 15,
  priceMax: 25,
  moq: 100,
  leadTime: '15-20 days',
  isFeatured: true,
  specs: [
    { id: 1, labelEn: 'Capacity', labelZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅', order: 0 },
    { id: 2, labelEn: 'Division', labelZh: '分度值', valueEn: '100g', valueZh: '100克', order: 1 },
    { id: 3, labelEn: 'Display', labelZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸', order: 2 },
    { id: 4, labelEn: 'Power', labelZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池', order: 3 },
    { id: 5, labelEn: 'Material', labelZh: '材质', valueEn: 'Tempered Glass + ABS', valueZh: '钢化玻璃 + ABS', order: 4 },
    { id: 6, labelEn: 'Platform Size', labelZh: '秤面尺寸', valueEn: '280 x 280 mm', valueZh: '280 x 280 毫米', order: 5 },
  ],
};

function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded" />
              ))}
            </div>
          </div>
          <div className="animate-pulse space-y-4">
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
  const product = apiProduct || mockProduct;

  const productImages = product.images || [];
  const mainImage = productImages.find((img) => img.isMain) || productImages[0];
  const mainImageUrl = mainImage?.imageUrl || product.mainImage || '';
  const galleryImages = productImages.map((img) => img.imageUrl);
  const detailImages = productImages.filter((img) => !img.isMain).map((img) => img.imageUrl);

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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left Column - Product Images */}
          <div className="space-y-6">
            {/* Main Gallery */}
            <div className="relative">
              <ProductGallery
                mainImage={mainImageUrl}
                images={galleryImages.filter((img) => img !== mainImageUrl)}
                name={name}
                videoUrl={product.videoUrl}
                onVideoClick={() => setShowVideo(true)}
              />
            </div>

            {/* Video Section */}
            {product.videoUrl && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    {isZh ? '产品视频' : 'Product Video'}
                  </h3>
                </div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={product.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={mainImageUrl}
                  />
                </div>
              </div>
            )}

            {/* Detail Images */}
            {detailImages.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary mb-4">
                  {isZh ? '产品详情图' : 'Product Images'}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {detailImages.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={img}
                        alt={`${name} detail ${idx + 1}`}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="text-sm text-gray-500 mb-2">
                {product.category?.name || (isZh ? '产品分类' : 'Product')}
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-primary mb-2">
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

            {/* Key Specifications */}
            {displaySpecs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-primary text-white px-4 py-3 font-semibold">
                  {isZh ? '技术规格' : 'Specifications'}
                </div>
                <div className="divide-y divide-gray-100">
                  {displaySpecs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between px-4 py-3 text-sm">
                      <span className="text-gray-500">{isZh ? spec.keyZh : spec.keyEn}</span>
                      <span className="font-medium text-primary">{isZh ? spec.valueZh : spec.valueEn}</span>
                    </div>
                  ))}
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
                  { icon: Award, text: isZh ? '出口认证' : 'Export Ready' },
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
              <div className="flex flex-wrap gap-3">
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
    </div>
  );
}