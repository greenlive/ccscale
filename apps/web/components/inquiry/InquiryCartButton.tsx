'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useInquiryCart, useCartIsEmpty, useCartUniqueCount } from '@/stores/inquiry-cart'
import { Button } from '@cc-scale/ui'
import { cn } from '@cc-scale/ui'

interface InquiryCartButtonProps {
  className?: string
  onClick?: () => void
}

export function InquiryCartButton({ className, onClick }: InquiryCartButtonProps) {
  const [mounted, setMounted] = useState(false)
  const cart = useInquiryCart((state) => state.cart)
  const isEmpty = useCartIsEmpty(cart)
  const uniqueItemCount = useCartUniqueCount(cart)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="accent"
      className={cn(
        'relative',
        className
      )}
      onClick={onClick}
    >
      <ShoppingCart className="h-5 w-5 mr-2" />
      <span className="hidden sm:inline">Request Quote</span>
      {mounted && !isEmpty && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {uniqueItemCount > 99 ? '99+' : uniqueItemCount}
        </span>
      )}
    </Button>
  )
}
