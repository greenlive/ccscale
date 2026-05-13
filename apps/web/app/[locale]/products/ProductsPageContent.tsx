'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Search, ArrowRight, X } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button, Input } from '@cc-scale/ui';
import { QuickInquiryButton } from '@/components/inquiry/QuickInquiryButton';
import { useProducts, useProductCategories, ProductCategory } from '@/lib/api/queries';
import { GridSkeleton } from '@/components/ErrorBoundary';
import CategorySidebar from '@/components/CategorySidebar';

// Default categories for initial render (before API loads)
const defaultCategories = [
  { id: 'all', nameEn: 'All Products', nameZh: '全部产品' },
];

// Extended fallback categories (used when API returns empty)
const fallbackCategories = [
  { id: 'all', nameEn: 'All Products', nameZh: '全部产品', productCount: 6 },
  { id: 'body-scales', nameEn: 'Body Scales', nameZh: '体重秤', productCount: 2 },
  { id: 'hanging-scales', nameEn: 'Hanging Scales', nameZh: '吊秤', productCount: 2 },
  { id: 'kitchen-scales', nameEn: 'Kitchen Scales', nameZh: '厨房秤', productCount: 2 },
  { id: 'baby-scales', nameEn: 'Baby Scales', nameZh: '婴儿秤', productCount: 0 },
  { id: 'dial-scales', nameEn: 'Dial Scales', nameZh: '度盘秤', productCount: 0 },
];

// Mock products data for now (will be replaced by API)
const mockProducts = [
  {
    id: 1,
    slug: 'digital-body-scale-bs-200',
    sku: 'BS-200',
    name: { en: 'Digital Body Scale BS-200', zh: '数字体重秤 BS-200' },
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
    name: { en: 'Industrial Hanging Scale HS-500', zh: '工业吊秤 HS-500' },
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
    name: { en: 'Precision Kitchen Scale KS-300', zh: '精密厨房秤 KS-300' },
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
    name: { en: 'Smart Body Composition Scale', zh: '智能体脂秤' },
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
    name: { en: 'Mini Crane Scale 300kg', zh: '迷你吊钩秤 300kg' },
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
    name: { en: 'Stainless Steel Kitchen Scale', zh: '不锈钢厨房秤' },
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

  // Fetch data using React Query
  const { data: apiProducts = [], isLoading: productsLoading, error: productsError } = useProducts();
  const { data: apiCategories = [], isLoading: categoriesLoading } = useProductCategories();

  // Use API categories if available, otherwise use fallback
  const categories = useMemo(() => {
    if (apiCategories.length > 0) {
      return [
        { id: 'all', nameEn: 'All Products', nameZh: '全部产品', slug: 'all', productCount: apiProducts.length || 0 },
        ...apiCategories.map((cat: ProductCategory) => ({
          id: cat.slug || String(cat.id),
          nameEn: cat.nameEn || '',
          nameZh: cat.nameZh || cat.nameEn || '',
          slug: cat.slug || String(cat.id),
          productCount: cat.products?.length || 0,
        })),
      ];
    }
    return fallbackCategories;
  }, [apiCategories]);

  // Initialize from URL params
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const category = searchParams.get('category');
    return category && categories.some(c => c.id === category) ? category : 'all';
  });
  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get('search') || '';
  });

  // Use mock data if API data not available
  const products = apiProducts.length > 0 ? apiProducts.map(p => {
    // Parse mainImages - could be JSON array string or array
    let imageUrl = 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400';
    if (p.mainImages) {
      try {
        const images = typeof p.mainImages === 'string' ? JSON.parse(p.mainImages) : p.mainImages;
        if (Array.isArray(images) && images.length > 0) {
          imageUrl = images[0];
        }
      } catch (e) {
        // If JSON parse fails, use fallback
      }
    } else if (p.mainImage) {
      imageUrl = p.mainImage;
    }

    return {
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: { en: p.nameEn, zh: p.nameZh },
      category: p.category?.slug || 'all',
      image: imageUrl,
      priceMin: p.priceMin || 0,
      priceMax: p.priceMax || 0,
      moq: p.moq || 100,
      isFeatured: p.isFeatured || false,
    };
  }) : mockProducts;

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
      const name = locale === 'en' ? (product.name?.en || '') : (product.name?.zh || '');
      const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery, locale]);

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div>
        {/* Hero */}
        <section className="bg-gradient-to-br from-dark-surface to-dark-warm text-ivory py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">{tNav('products')}</h1>
            <p className="text-xl text-warm-silver max-w-2xl mx-auto">
              {locale === 'en'
                ? 'Explore our comprehensive range of professional weighing solutions'
                : '探索我们全面的专业衡器解决方案'}
            </p>
          </div>
        </section>

        {/* Filters skeleton */}
        <section className="py-8 bg-ivory border-b border-border-cream sticky top-16 z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto -mx-4 md:mx-0 px-4 md:px-0 no-scrollbar">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-24 bg-warm-sand rounded-full animate-pulse flex-shrink-0" />
                ))}
              </div>
              <div className="h-10 w-72 bg-warm-sand rounded-xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* Products grid skeleton */}
        <section className="py-16 bg-parchment">
          <div className="container mx-auto px-4">
            <GridSkeleton count={6} />
          </div>
        </section>
      </div>
    );
  }

  // Show fallback mock data when API fails (mobile/tablet compatibility)
  return (
    <div>
      {/* Hero - Warm parchment theme */}
      <section className="bg-gradient-to-br from-dark-surface to-dark-warm text-ivory py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">{tNav('products')}</h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Explore our comprehensive range of professional weighing solutions'
              : '探索我们全面的专业衡器解决方案'}
          </p>
        </div>
      </section>

      {/* Main content: Sidebar + Products */}
      <section className="py-16 bg-parchment">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Left sidebar - hidden below lg */}
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
              resultCount={filteredProducts.length}
              locale={locale}
              onCategoryChange={handleCategoryChange}
              onSearchChange={setSearchQuery}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />

            {/* Right content */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter bar - visible only below lg */}
              <div className="lg:hidden mb-8">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 md:mx-0 px-4 md:px-0 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-terracotta text-ivory shadow-ring-terracotta'
                          : 'bg-warm-sand text-charcoal-warm hover:bg-warm-sand/80 hover:text-foreground shadow-ring-warm'
                      }`}
                    >
                      {locale === 'en' ? cat.nameEn : cat.nameZh}
                    </button>
                  ))}
                </div>
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-gray" />
                  <Input
                    type="text"
                    placeholder={locale === 'en' ? 'Search products...' : '搜索产品...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label={locale === 'en' ? 'Search products' : '搜索产品'}
                    className="pl-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray hover:text-charcoal-warm"
                      aria-label={locale === 'en' ? 'Clear search' : '清除搜索'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {hasActiveFilters && (
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-cream">
                    <span className="text-sm text-stone-gray">
                      {isZh
                        ? `显示 ${filteredProducts.length} 个产品`
                        : `Showing ${filteredProducts.length} products`}
                    </span>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-terracotta hover:text-coral flex items-center gap-1"
                    >
                      <X className="h-3 w-3" />
                      {isZh ? '清除筛选' : 'Clear filters'}
                    </button>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <div className="max-w-md mx-auto">
                    <Search className="h-16 w-16 text-warm-silver mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-medium text-charcoal-warm mb-2">
                      {isZh ? '未找到相关产品' : 'No products found'}
                    </h3>
                    <p className="text-stone-gray mb-6">
                      {isZh
                        ? '尝试调整筛选条件或搜索关键词'
                        : 'Try adjusting your filters or search terms'}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        onClick={clearFilters}
                        variant="outline"
                        className="border-terracotta text-terracotta hover:bg-terracotta hover:text-ivory"
                      >
                        <X className="h-4 w-4 mr-2" />
                        {isZh ? '清除所有筛选' : 'Clear all filters'}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {filteredProducts.map((product) => {
                    const name = locale === 'en' ? product.name.en : product.name.zh;
                    return (
                      <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
                        <Link href={`/products/${product.slug}`}>
                          <div className="relative aspect-[4/3] overflow-hidden bg-warm-sand">
                            <img
                              src={product.image}
                              alt={name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {product.isFeatured && (
                              <div className="absolute top-4 left-4">
                                <span className="bg-terracotta text-ivory text-xs font-medium px-3 py-1 rounded-lg">
                                  {locale === 'en' ? 'Featured' : '精选'}
                                </span>
                              </div>
                            )}
                          </div>
                        </Link>
                        <CardContent className="p-5 flex-1 flex flex-col">
                          <div className="flex-1">
                            <div className="text-sm text-stone-gray mb-1">SKU: {product.sku}</div>
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-terracotta transition-colors">
                                {name}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between text-sm text-olive-gray mb-3">
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
                            <Link href={`/products/${product.slug}`} className="flex items-center text-terracotta font-medium text-sm">
                              {t('viewDetails')}
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                            <QuickInquiryButton
                              product={{
                                id: product.id,
                                nameEn: product.name?.en || '',
                                nameZh: product.name?.zh || '',
                                sku: product.sku || '',
                                mainImage: product.image || '',
                                priceMin: product.priceMin || 0,
                                priceMax: product.priceMax || 0,
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
          </div>
        </div>
      </section>

      {/* CTA - Warm parchment theme */}
      <section className="py-16 bg-dark-surface">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-medium text-ivory mb-4">
            {locale === 'en' ? 'Need a Custom Solution?' : '需要定制解决方案？'}
          </h2>
          <p className="text-warm-silver mb-8 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'We can tailor our products to your specific requirements. Contact us today for OEM/ODM services.'
              : '我们可以根据您的具体需求定制产品。立即联系我们获取OEM/ODM服务。'}
          </p>
          <Button asChild size="lg" variant="accent">
            <Link href="/oem">
              {locale === 'en' ? 'Learn About OEM' : '了解OEM服务'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
