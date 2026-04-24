'use client'

import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useInquiryCart } from '@/stores/inquiry-cart'
import type { InquiryCartItem } from '@/types/inquiry-cart'
import { Button } from '@cc-scale/ui'
import { Input } from '@cc-scale/ui'
import Image from 'next/image'

const MAX_QUANTITY = 9999

interface InquiryItemProps {
  item: InquiryCartItem
  onRemove?: () => void
}

export function InquiryItem({ item, onRemove }: InquiryItemProps) {
  const locale = useLocale() as 'en' | 'zh'
  const removeItem = useInquiryCart((state) => state.removeItem)
  const updateQuantity = useInquiryCart((state) => state.updateQuantity)
  const isZh = locale === 'zh'

  const productName = isZh ? item.productName.zh : item.productName.en
  const quantity = item.quantity || 1

  const handleRemove = () => {
    // If onRemove is provided (for undo functionality), call it first
    // Otherwise, remove directly
    if (onRemove) {
      onRemove()
    } else {
      removeItem(item.productId)
    }
  }

  const handleIncrease = () => {
    if (quantity < MAX_QUANTITY) {
      updateQuantity(item.productId, quantity + 1)
    }
  }

  const handleDecrease = () => {
    if (quantity > 1) {
      updateQuantity(item.productId, quantity - 1)
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    if (!isNaN(val) && val >= 1 && val <= MAX_QUANTITY) {
      updateQuantity(item.productId, val)
    }
  }

  return (
    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded overflow-hidden">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <X className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-primary truncate">
          {productName}
        </h4>
        <p className="text-sm text-gray-500 mt-1">SKU: {item.sku}</p>

        {(item.priceMin || item.priceMax) && (
          <p className="text-sm text-gray-600 mt-1">
            {item.priceMin && `$${item.priceMin}`}
            {item.priceMin && item.priceMax && ' - '}
            {item.priceMax && `$${item.priceMax}`}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <span className="text-sm text-gray-600">
            {isZh ? '数量:' : 'Qty:'}
          </span>
          <div className="flex items-center border border-gray-300 rounded bg-white">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none border-r"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={MAX_QUANTITY}
              className="h-10 w-16 text-center border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-none border-l"
              onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-red-500 flex-shrink-0"
        onClick={handleRemove}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}
