import { Suspense } from 'react';
import ProductsPageContent from './ProductsPageContent';

export default function ProductsPage({ params: { locale } }: { params: { locale: 'en' | 'zh' } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent" />
      </div>
    }>
      <ProductsPageContent locale={locale} />
    </Suspense>
  );
}
