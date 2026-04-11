'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search, Filter, ArrowRight, ShoppingCart, X } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button, Input } from '@cc-scale/ui';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';

const categories = [
  { id: 'all', nameEn: 'All Products', nameZh: '全部产品' },
  { id: 'body-scales', nameEn: 'Body Scales', nameZh: '体重秤' },
  { id: 'hanging-scales', nameEn: 'Hanging Scales', nameZh: '吊秤' },
  { id: 'kitchen-scales', nameEn: 'Kitchen Scales', nameZh: '厨房秤' },
  { id: 'baby-scales', nameEn: 'Baby Scales', nameZh: '婴儿秤' },
  { id: 'dial-scales', nameEn: 'Dial Scales', nameZh: '度盘秤' },
];

const products = [
  {
    id: 1,
    slug: 'digital-body-scale-bs-200',
    sku: 'BS-200',
    nameEn: 'Digital Body Scale BS-200',
    nameZh: '数字体重秤 BS-200',
    category: 'body-scales',
    image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
    priceMin: 15,
    priceMax: 25,
    moq: 100,
    isFeatured: true,
  },
  {
    id: 2,
    slug: 'industrial-hanging-scale-hs-500',
    sku: 'HS-500',
    nameEn: 'Industrial Hanging Scale HS-500',
    nameZh: '工业吊秤 HS-500',
    category: 'hanging-scales',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    priceMin: 45,
    priceMax: 85,
    moq: 50,
    isFeatured: true,
  },
  {
    id: 3,
    slug: 'precision-kitchen-scale-ks-300',
    sku: 'KS-300',
    nameEn: 'Precision Kitchen Scale KS-300',
    nameZh: '精密厨房秤 KS-300',
    category: 'kitchen-scales',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    priceMin: 12,
    priceMax: 20,
    moq: 200,
    isFeatured: false,
  },
  {
    id: 4,
    slug: 'smart-body-composition-scale',
    sku: 'BS-100',
    nameEn: 'Smart Body Composition Scale',
    nameZh: '智能体脂秤',
    category: 'body-scales',
    image: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
    priceMin: 25,
    priceMax: 45,
    moq: 80,
    isFeatured: true,
  },
  {
    id: 5,
    slug: 'mini-crane-scale-300kg',
    sku: 'HS-300',
    nameEn: 'Mini Crane Scale 300kg',
    nameZh: '迷你吊钩秤 300kg',
    category: 'hanging-scales',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    priceMin: 35,
    priceMax: 55,
    moq: 60,
    isFeatured: false,
  },
  {
    id: 6,
    slug: 'stainless-steel-kitchen-scale',
    sku: 'KS-100',
    nameEn: 'Stainless Steel Kitchen Scale',
    nameZh: '不锈钢厨房秤',
    category: 'kitchen-scales',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
    priceMin: 18,
    priceMax: 28,
    moq: 150,
    isFeatured: false,
  },
];

export default function ProductsPageContent({ locale }: { locale: 'en' | 'zh' }) {
  const t = useTranslations('products');
  const tNav = useTranslations('nav');
  const tInquiry = useTranslations('inquiry');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isZh = locale === 'zh';

  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const category = searchParams.get('category');
    return category && categories.some(c => c.id === category) ? category : 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });

  // Update URL when filters change (debounced for search)
  const updateURL = useCallback((category: string, search: string) => {
    const params = new URLSearchParams();
    if (category !== 'all') {
      params.set('category', category);
    }
    if (search) {
      params.set('search', search);
    }
    const queryString = params.toString();
    const newURL = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(newURL, { scroll: false });
  }, [pathname, router]);

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateURL(categoryId, searchQuery);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(selectedCategory, searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, updateURL]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    router.push(pathname, { scroll: false });
  };

  // Check if any filter is active
  const hasActiveFilters = selectedCategory !== 'all' || searchQuery.length > 0;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const name = locale === 'en' ? product.nameEn : product.nameZh;
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, locale]);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{tNav('products')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Explore our comprehensive range of professional weighing solutions'
              : '探索我们全面的专业衡器解决方案'}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Pills - Horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto -mx-4 md:mx-0 px-4 md:px-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#0A1628] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {locale === 'en' ? cat.nameEn : cat.nameZh}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={locale === 'en' ? 'Search products...' : '搜索产品...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={locale === 'en' ? 'Search products' : '搜索产品'}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={locale === 'en' ? 'Clear search' : '清除搜索'}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                {isZh
                  ? `显示 ${filteredProducts.length} 个产品`
                  : `Showing ${filteredProducts.length} products`}
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-accent hover:text-accent/80 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                {isZh ? '清除筛选' : 'Clear filters'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {isZh ? '未找到相关产品' : 'No products found'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {isZh
                    ? '尝试调整筛选条件或搜索关键词'
                    : 'Try adjusting your filters or search terms'}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {isZh ? '清除所有筛选' : 'Clear all filters'}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => {
                const name = locale === 'en' ? product.nameEn : product.nameZh;
                return (
                  <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-none h-full flex flex-col">
                    <Link href={`/products/${product.slug}`}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img
                          src={product.image}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.isFeatured && (
                          <div className="absolute top-4 left-4">
                            <span className="bg-accent text-white text-xs font-bold px-3 py-1 rounded">
                              {locale === 'en' ? 'Featured' : '精选'}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">SKU: {product.sku}</div>
                        <Link href={`/products/${product.slug}`}>
                          <h3 className="font-semibold text-lg text-[#0A1628] mb-2 group-hover:text-accent transition-colors">
                            {name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">${product.priceMin}</span>
                            {product.priceMax && <span> - ${product.priceMax}</span>}
                          </div>
                          <div>
                            {t('moq')}: {product.moq}
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto space-y-3">
                        <Link href={`/products/${product.slug}`} className="flex items-center text-accent font-medium text-sm">
                          {t('viewDetails')}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
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
                          className="w-full justify-center"
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0A1628]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {locale === 'en' ? 'Need a Custom Solution?' : '需要定制解决方案？'}
          </h2>
          <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'We can tailor our products to your specific requirements. Contact us today for OEM/ODM services.'
              : '我们可以根据您的具体需求定制产品。立即联系我们获取OEM/ODM服务。'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/oem">
              {locale === 'en' ? 'Learn About OEM' : '了解OEM服务'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
