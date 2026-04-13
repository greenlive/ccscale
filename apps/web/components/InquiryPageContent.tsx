'use client';

import { useTranslations, useLocale } from 'next-intl'
import { useInquiryCart, useCartIsEmpty, useCartItemCount } from '@/stores/inquiry-cart'
import { InquiryItem } from './inquiry/InquiryItem'
import InquiryForm from './InquiryForm'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { Button } from '@cc-scale/ui'

export default function InquiryPageContent() {
  const locale = useLocale() as 'en' | 'zh'
  const cart = useInquiryCart((state) => state.cart)
  const clearCart = useInquiryCart((state) => state.clearCart)
  const isEmpty = useCartIsEmpty(cart)
  const totalItems = useCartItemCount(cart)
  const isZh = locale === 'zh'

  const handleClear = () => {
    if (confirm(isZh ? '确定要清空询价车吗？' : 'Are you sure you want to clear the inquiry cart?')) {
      clearCart()
    }
  }

  return (
    <div>
      {/* Hero - Warm parchment theme */}
      <section className="bg-gradient-to-br from-dark-surface to-dark-warm text-ivory py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center text-warm-silver hover:text-ivory mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isZh ? '返回产品列表' : 'Back to Products'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-medium mb-4">
            {isZh ? '您的询价单' : 'Your Inquiry'}
          </h1>
          {!isEmpty && (
            <p className="text-warm-silver">
              {totalItems} {isZh ? '件产品' : 'items'} in your cart
            </p>
          )}
        </div>
      </section>

      {/* Main content - Warm parchment theme */}
      <section className="py-12 bg-parchment">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            <div className="text-center py-20">
              <ShoppingCart className="h-16 w-16 text-warm-silver mx-auto mb-6" />
              <h2 className="text-2xl font-serif font-medium text-foreground mb-4">
                {isZh ? '询价车是空的' : 'Your inquiry cart is empty'}
              </h2>
              <p className="text-stone-gray mb-8">
                {isZh
                  ? '浏览我们的产品并添加到询价车'
                  : 'Browse our products and add them to your inquiry cart'}
              </p>
              <Button asChild variant="accent">
                <Link href="/products">
                  {isZh ? '浏览产品' : 'Browse Products'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-ivory rounded-xl shadow-whisper border border-border-cream p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-medium text-foreground">
                      {isZh ? '产品列表' : 'Products'}
                    </h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClear}
                    >
                      {isZh ? '清空' : 'Clear All'}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <InquiryItem key={item.productId} item={item} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <InquiryForm />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
