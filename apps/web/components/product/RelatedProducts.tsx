'use client'

import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@cc-scale/ui'
import Image from 'next/image'

interface Product {
  id: number
  slug: string
  nameEn: string
  nameZh: string
  image: string
  sku?: string
  priceMin?: number
  priceMax?: number
}

interface RelatedProductsProps {
  products: Product[]
  titleEn?: string
  titleZh?: string
}

export function RelatedProducts({
  products,
  titleEn = 'Related Products',
  titleZh = '相关产品',
}: RelatedProductsProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!products || products.length === 0) {
    return null
  }

  const title = isZh ? titleZh : titleEn

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary">
            {title}
          </h2>
          <Link
            href="/products"
            className="text-accent hover:text-accent/80 font-medium flex items-center"
          >
            {isZh ? '查看全部' : 'View All'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const productName = isZh ? product.nameZh : product.nameEn
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
              >
                <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden border-none h-full">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={productName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    {product.sku && (
                      <div className="text-sm text-gray-500 mb-1">
                        SKU: {product.sku}
                      </div>
                    )}
                    <h3 className="font-semibold text-lg text-primary group-hover:text-accent transition-colors">
                      {productName}
                    </h3>
                    {(product.priceMin || product.priceMax) && (
                      <div className="text-sm text-gray-600 mt-2">
                        {product.priceMin && `$${product.priceMin}`}
                        {product.priceMin && product.priceMax && ' - '}
                        {product.priceMax && `$${product.priceMax}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
