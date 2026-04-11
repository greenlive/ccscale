'use client'

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
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] text-white py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="inline-flex items-center text-blue-200 hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isZh ? '返回产品列表' : 'Back to Products'}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {isZh ? '您的询价单' : 'Your Inquiry'}
          </h1>
          {!isEmpty && (
            <p className="text-blue-200">
              {totalItems} {isZh ? '件产品' : 'items'} in your cart
            </p>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            <div className="text-center py-20">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-[#0A1628] mb-4">
                {isZh ? '询价车是空的' : 'Your inquiry cart is empty'}
              </h2>
              <p className="text-gray-500 mb-8">
                {isZh
                  ? '浏览我们的产品并添加到询价车'
                  : 'Browse our products and add them to your inquiry cart'}
              </p>
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/products">
                  {isZh ? '浏览产品' : 'Browse Products'}
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#0A1628]">
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
