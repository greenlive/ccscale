'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';
import { useProductCategories, ProductCategory } from '@/lib/api/queries';
import { GridSkeleton } from '@/components/ErrorBoundary';
import Carousel from '@/components/Carousel';

function CategoryCard({ category, locale }: { category: ProductCategory; locale: string }) {
  const name = locale === 'en'
    ? category.nameEn || ''
    : category.nameZh || '';
  const categorySlug = category.slug || '';

  return (
    <Link href={categorySlug ? `/products?category=${categorySlug}` : '/products'}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-warm-sand">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-warm-sand flex items-center justify-center">
              <span className="text-stone-gray">No image</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-serif text-lg text-foreground">{name}</h3>
          {category.products && (
            <p className="text-sm text-stone-gray mt-1">
              {category.products.length} {locale === 'en' ? 'products' : '产品'}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ProductCategories({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const { data: categories = [], isLoading, error } = useProductCategories();

  // Mock fallback data
  const fallbackCategories: ProductCategory[] = [
    {
      id: 1,
      nameEn: 'Body Scales',
      nameZh: '体重秤',
      slug: 'body-scales',
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
      order: 1,
      isActive: true,
      products: [],
    },
    {
      id: 2,
      nameEn: 'Hanging Scales',
      nameZh: '吊秤',
      slug: 'hanging-scales',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      order: 2,
      isActive: true,
      products: [],
    },
    {
      id: 3,
      nameEn: 'Kitchen Scales',
      nameZh: '厨房秤',
      slug: 'kitchen-scales',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
      order: 3,
      isActive: true,
      products: [],
    },
    {
      id: 4,
      nameEn: 'Baby Scales',
      nameZh: '婴儿秤',
      slug: 'baby-scales',
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
      order: 4,
      isActive: true,
      products: [],
    },
  ];

  const displayCategories = categories.length > 0 ? categories : fallbackCategories;
  const showCarousel = displayCategories.length > 4;

  if (isLoading) {
    return (
      <section className="py-16 bg-parchment">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-serif font-medium text-foreground">
              {t('ourProducts')}
            </h2>
          </div>
          <GridSkeleton count={4} />
        </div>
      </section>
    );
  }

  // Show fallback categories on error to ensure mobile/tablet users still see content
  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-parchment">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-serif font-medium text-foreground">
            {t('ourProducts')}
          </h2>
          <Button asChild variant="outline">
            <Link href="/products">
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        {showCarousel ? (
          <Carousel autoPlay showArrows showDots>
            {displayCategories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </Carousel>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayCategories.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
