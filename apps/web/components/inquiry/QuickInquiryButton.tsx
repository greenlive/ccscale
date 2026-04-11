'use client'

import { useState } from 'react'
import { ShoppingCart, ArrowRight, Check } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { useInquiryCart } from '@/stores/inquiry-cart'
import type { InquiryCartItem } from '@/types/inquiry-cart'
import { Button } from '@cc-scale/ui'

interface QuickInquiryButtonProps {
  product: {
    id: number
    nameEn: string
    nameZh: string
    sku: string
    mainImage?: string | null
    priceMin?: number | null
    priceMax?: number | null
  }
  className?: string
}

export function QuickInquiryButton({ product, className }: QuickInquiryButtonProps) {
  const t = useTranslations('inquiry')
  const locale = useLocale() as 'en' | 'zh'
  const addItem = useInquiryCart((state) => state.addItem)
  const isZh = locale === 'zh'
  const [added, setAdded] = useState(false)

  const handleAddToInquiry = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const item: InquiryCartItem = {
      productId: product.id,
      productName: { en: product.nameEn, zh: product.nameZh },
      sku: product.sku,
      quantity: 1,
      imageUrl: product.mainImage || undefined,
      priceMin: product.priceMin || undefined,
      priceMax: product.priceMax || undefined,
    }
    addItem(item)

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      size="lg"
      className={className}
      onClick={handleAddToInquiry}
      variant={added ? 'outline' : 'default'}
    >
      {added ? (
        <>
          <Check className="mr-2 h-5 w-5 text-green-500" />
          {isZh ? '已添加!' : 'Added!'}
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {isZh ? '加入询价车' : 'Add to Inquiry'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  )
}
