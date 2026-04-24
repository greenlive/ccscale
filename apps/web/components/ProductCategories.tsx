'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';
import { useProductCategories } from '@/lib/api/queries';
import { GridSkeleton } from '@/components/ErrorBoundary';

export default function ProductCategories({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const { data: categories = [], isLoading, error } = useProductCategories();

  // Mock fallback data
  const fallbackCategories = [
    {
      id: 1,
      nameEn: 'Body Scales',
      nameZh: '体重秤',
      slug: 'body-scales',
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
      products: [],
    },
    {
      id: 2,
      nameEn: 'Hanging Scales',
      nameZh: '吊秤',
      slug: 'hanging-scales',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      products: [],
    },
    {
      id: 3,
      nameEn: 'Kitchen Scales',
      nameZh: '厨房秤',
      slug: 'kitchen-scales',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400',
      products: [],
    },
    {
      id: 4,
      nameEn: 'Baby Scales',
      nameZh: '婴儿秤',
      slug: 'baby-scales',
      imageUrl: 'https://images.unsplash.com/photo-1576659531892-8f5b3d7e86f5?w=400',
      products: [],
    },
  ];

  const displayCategories = categories.length > 0 ? categories.slice(0, 4) : fallbackCategories;

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

  if (error || displayCategories.length === 0) {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCategories.map((category) => {
            const cat = category as any;
            const name = locale === 'en'
              ? cat.nameEn || cat.name || ''
              : cat.nameZh || cat.name || '';
            return (
              <Link key={category.id} href="/products">
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
                    {(category as any).products && (
                      <p className="text-sm text-stone-gray mt-1">
                        {(category as any).products.length} {locale === 'en' ? 'products' : '产品'}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
