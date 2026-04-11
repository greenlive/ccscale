export interface InquiryCartItem {
  productId: number
  productName: { en: string; zh: string }
  sku: string
  quantity?: number
  imageUrl?: string
  priceMin?: number
  priceMax?: number
}

export interface InquiryCart {
  items: InquiryCartItem[]
  message: string
  createdAt: number
  updatedAt: number
}

export const INQUIRY_CART_KEY = 'cc-scale-inquiry-cart'
export const INQUIRY_CART_TTL = 7 * 24 * 60 * 60 * 1000
