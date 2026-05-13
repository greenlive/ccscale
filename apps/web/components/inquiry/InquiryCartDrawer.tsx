'use client'

import { X, ArrowRight, MessageSquare, Send, Undo2 } from 'lucide-react'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/routing'
import { useInquiryCart, useCartIsEmpty, useCartItemCount } from '@/stores/inquiry-cart'
import { getStoredTrackingData } from '@/lib/utils/tracking'
import { InquiryItem } from './InquiryItem'
import { Button } from '@cc-scale/ui'
import { Textarea } from '@cc-scale/ui'
import { Input } from '@cc-scale/ui'
import { cn } from '@cc-scale/ui'
import { useState, useEffect, useRef } from 'react'
import { getApiUrl } from '@/lib/config/api'
import type { InquiryCartItem } from '@/types/inquiry-cart'

const UNDO_TIMEOUT = 5000 // 5 seconds to undo

interface InquiryCartDrawerProps {
  open: boolean
  onClose: () => void
}

export function InquiryCartDrawer({ open, onClose }: InquiryCartDrawerProps) {
  const locale = useLocale() as 'en' | 'zh'
  const cart = useInquiryCart((state) => state.cart)
  const addItem = useInquiryCart((state) => state.addItem)
  const updateMessage = useInquiryCart((state) => state.updateMessage)
  const clearCart = useInquiryCart((state) => state.clearCart)
  const isEmpty = useCartIsEmpty(cart)
  const totalItems = useCartItemCount(cart)
  const isZh = locale === 'zh'

  // Undo state
  const [undoItem, setUndoItem] = useState<InquiryCartItem | null>(null)
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Clear undo timer on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current)
      }
    }
  }, [])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleClear = () => {
    if (confirm(isZh ? '确定要清空询价车吗？' : 'Are you sure you want to clear the inquiry cart?')) {
      clearCart()
    }
  }

  // Handle item removal with undo
  const handleRemoveItem = (item: InquiryCartItem) => {
    // Clear any existing undo timer
    if (undoTimerRef.current) {
      clearTimeout(undoTimerRef.current)
    }

    // Save the item for undo
    setUndoItem(item)

    // Remove the item
    const removeItem = useInquiryCart.getState().removeItem
    removeItem(item.productId)

    // Set timer to clear undo state
    undoTimerRef.current = setTimeout(() => {
      setUndoItem(null)
    }, UNDO_TIMEOUT)
  }

  // Handle undo
  const handleUndo = () => {
    if (undoItem) {
      addItem(undoItem)
      setUndoItem(null)
      if (undoTimerRef.current) {
        clearTimeout(undoTimerRef.current)
        undoTimerRef.current = null
      }
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleOverlayClick}
    >
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

      <div className={cn(
        'relative w-full max-w-md bg-white h-full shadow-xl transform transition-transform flex flex-col',
        open ? 'translate-x-0' : 'translate-x-full'
      )}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-primary">
            {isZh ? '询价车' : 'Inquiry Cart'}
            {!isEmpty && (
              <span className="ml-2 text-sm text-gray-500">
                ({totalItems} {isZh ? '件' : 'items'})
              </span>
            )}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isEmpty && !undoItem ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {isZh ? '询价车是空的' : 'Your inquiry cart is empty'}
              </p>
              <Button asChild className="mt-4 bg-accent hover:bg-accent/90">
                <Link href="/products" onClick={onClose}>
                  {isZh ? '浏览产品' : 'Browse Products'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : undoItem ? (
            <div className="space-y-4">
              {/* Undo Banner */}
              <div className="bg-warm-sand border border-warm-sand rounded-lg p-4 flex items-center justify-between animate-in slide-in-from-top">
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-full p-2">
                    <Undo2 className="h-4 w-4 text-dark-surface" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-gray">
                      {isZh ? '已删除 1 件商品' : '1 item removed'}
                    </p>
                    <p className="text-xs text-dark-surface">
                      {isZh ? '点击"撤销"恢复' : 'Click "Undo" to restore'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUndo}
                  className="text-dark-surface hover:text-stone-gray hover:bg-muted"
                >
                  <Undo2 className="h-4 w-4 mr-1" />
                  {isZh ? '撤销' : 'Undo'}
                </Button>
              </div>

              {cart.items.map((item) => (
                <InquiryItem
                  key={item.productId}
                  item={item}
                  onRemove={() => handleRemoveItem(item)}
                />
              ))}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isZh ? '您的需求' : 'Your Requirements'}
                </label>
                <Textarea
                  value={cart.message}
                  onChange={(e) => updateMessage(e.target.value)}
                  placeholder={isZh ? '请告诉我们您的具体需求...' : 'Tell us about your specific requirements...'}
                  rows={4}
                />
              </div>

              <DrawerInquiryForm onSuccess={onClose} />

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClear}
                >
                  {isZh ? '清空' : 'Clear'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <InquiryItem
                  key={item.productId}
                  item={item}
                  onRemove={() => handleRemoveItem(item)}
                />
              ))}

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {isZh ? '您的需求' : 'Your Requirements'}
                </label>
                <Textarea
                  value={cart.message}
                  onChange={(e) => updateMessage(e.target.value)}
                  placeholder={isZh ? '请告诉我们您的具体需求...' : 'Tell us about your specific requirements...'}
                  rows={4}
                />
              </div>

              <DrawerInquiryForm onSuccess={onClose} />

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClear}
                >
                  {isZh ? '清空' : 'Clear'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Validation helpers
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhone = (phone: string): boolean => {
  if (!phone) return true // phone is optional
  const phoneRegex = /^[+\d\s-()]{6,}$/
  return phoneRegex.test(phone)
}

// Inline inquiry form for drawer
function DrawerInquiryForm({ onSuccess }: { onSuccess: () => void }) {
  const locale = useLocale()
  const cart = useInquiryCart((state) => state.cart)
  const clearCart = useInquiryCart((state) => state.clearCart)
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    whatsapp: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isZh = locale === 'zh'

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = isZh ? '请输入姓名' : 'Please enter your name'
    }

    if (!formData.email) {
      newErrors.email = isZh ? '请输入邮箱' : 'Please enter your email'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = isZh ? '请输入有效的邮箱地址' : 'Please enter a valid email'
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = isZh ? '请输入有效的电话号码' : 'Please enter a valid phone number'
    }

    if (formData.whatsapp && !isValidPhone(formData.whatsapp)) {
      newErrors.whatsapp = isZh ? '请输入有效的WhatsApp号码' : 'Please enter a valid WhatsApp number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setFormStatus('submitting')

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId,
        productNameEn: item.productName.en,
        productNameZh: item.productName.zh,
        quantity: item.quantity,
        unitPrice: item.priceMin,
      }))

      const { landingPage: _landingPage, ...trackingData } = getStoredTrackingData();
      const { trafficSource, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer } = trackingData;

      const inquiryData = {
        ...formData,
        message: cart.message || '',
        source: 'Website',
        items: items.length > 0 ? items : undefined,
        // Only whitelist tracking fields the backend DTO accepts
        ...(trafficSource ? { trafficSource } : {}),
        ...(utmSource ? { utmSource } : {}),
        ...(utmMedium ? { utmMedium } : {}),
        ...(utmCampaign ? { utmCampaign } : {}),
        ...(utmContent ? { utmContent } : {}),
        ...(utmTerm ? { utmTerm } : {}),
        ...(referrer ? { referrer } : {}),
      }

      const response = await fetch(getApiUrl('inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiryData),
      })

      if (response.ok) {
        setFormStatus('success')
        clearCart()
        setTimeout(() => {
          setFormStatus('idle')
          onSuccess()
        }, 2000)
      } else {
        setFormStatus('error')
        setTimeout(() => setFormStatus('idle'), 3000)
      }
    } catch (error) {
      console.error('Failed to submit inquiry:', error)
      setFormStatus('error')
      setTimeout(() => setFormStatus('idle'), 3000)
    }
  }

  if (formStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-medium">
          {isZh ? '询盘提交成功！我们将在24小时内回复您。' : 'Inquiry submitted! We will respond within 24 hours.'}
        </p>
      </div>
    )
  }

  if (formStatus === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-700 font-medium">
          {isZh ? '提交失败，请稍后重试或直接发送邮件联系我们。' : 'Submission failed. Please try again later or contact us via email.'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6 bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            placeholder={isZh ? '姓名 *' : 'Name *'}
            className={errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Email *"
            className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={isZh ? '电话' : 'Phone'}
            className={errors.phone ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="company"
            value={formData.company}
            onChange={handleInputChange}
            placeholder={isZh ? '公司' : 'Company'}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder={isZh ? '国家' : 'Country'}
          />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder={isZh ? '城市' : 'City'}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <Input
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleInputChange}
            placeholder={isZh ? 'WhatsApp (选填)' : 'WhatsApp (optional)'}
            className={errors.whatsapp ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {errors.whatsapp && (
            <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 relative"
        disabled={formStatus === 'submitting'}
      >
        {formStatus === 'submitting' ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            {isZh ? '提交中...' : 'Submitting...'}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {isZh ? '提交询盘' : 'Submit Inquiry'}
          </>
        )}
      </Button>
    </form>
  )
}
