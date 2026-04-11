import { INQUIRY_CART_KEY, INQUIRY_CART_TTL, type InquiryCart } from '@/types/inquiry-cart'

const isBrowser = typeof window !== 'undefined'

export function safeGetItem(key: string): string | null {
  if (!isBrowser) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeSetItem(key: string, value: string): void {
  if (!isBrowser) return
  try {
    localStorage.setItem(key, value)
  } catch {
  }
}

export function safeRemoveItem(key: string): void {
  if (!isBrowser) return
  try {
    localStorage.removeItem(key)
  } catch {
  }
}

export function getInquiryCart(): InquiryCart | null {
  const data = safeGetItem(INQUIRY_CART_KEY)
  if (!data) return null

  try {
    const parsed = JSON.parse(data) as InquiryCart
    if (Date.now() - parsed.createdAt > INQUIRY_CART_TTL) {
      safeRemoveItem(INQUIRY_CART_KEY)
      return null
    }
    return parsed
  } catch {
    safeRemoveItem(INQUIRY_CART_KEY)
    return null
  }
}

export function saveInquiryCart(cart: InquiryCart): void {
  safeSetItem(INQUIRY_CART_KEY, JSON.stringify(cart))
}

export function clearInquiryCart(): void {
  safeRemoveItem(INQUIRY_CART_KEY)
}
