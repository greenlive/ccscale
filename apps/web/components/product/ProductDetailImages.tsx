'use client'

import Image from 'next/image'
import { useLocale } from 'next-intl'

interface ProductDetailImagesProps {
  images: string[]
  productName?: string
  altEn?: string[]
  altZh?: string[]
}

export function ProductDetailImages({
  images,
  productName,
  altEn,
  altZh,
}: ProductDetailImagesProps) {
  const locale = useLocale() as 'en' | 'zh'
  const isZh = locale === 'zh'

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="w-[750px] max-w-full mx-auto space-y-4">
      {images.map((imageUrl, index) => {
        const alt = isZh
          ? altZh?.[index] || productName || `产品详情图 ${index + 1}`
          : altEn?.[index] || productName || `Product detail image ${index + 1}`

        return (
          <figure
            key={index}
            itemScope
            itemType="https://schema.org/ImageObject"
            className="relative overflow-hidden bg-gray-100 rounded-lg"
          >
            <Image
              src={imageUrl}
              alt={alt}
              width={750}
              height={750}
              className="w-full h-auto"
              priority={index === 0}
              loading={index === 0 ? undefined : 'lazy'}
            />
            <meta itemProp="contentUrl" content={imageUrl} />
            {alt && (
              <figcaption
                itemProp="caption"
                className="sr-only"
              >
                {alt}
              </figcaption>
            )}
          </figure>
        )
      })}
    </div>
  )
}
