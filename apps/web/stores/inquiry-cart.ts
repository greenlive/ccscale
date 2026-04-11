'use client'

import { create } from 'zustand'
import type { InquiryCart, InquiryCartItem } from '@/types/inquiry-cart'
import { getInquiryCart, saveInquiryCart, clearInquiryCart } from '@/lib/utils/storage'

const MAX_QUANTITY = 9999

const initialCart: InquiryCart = {
  items: [],
  message: '',
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

function loadInitialCart(): InquiryCart {
  const saved = getInquiryCart()
  return saved || initialCart
}

function clampQuantity(quantity: number): number {
  return Math.min(Math.max(1, quantity), MAX_QUANTITY)
}

interface InquiryCartState {
  cart: InquiryCart
  addItem: (item: InquiryCartItem) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  updateMessage: (message: string) => void
  clearCart: () => void
}

export const useInquiryCart = create<InquiryCartState>((set) => ({
  cart: loadInitialCart(),

  addItem: (item: InquiryCartItem) => {
    set((state) => {
      const existingIndex = state.cart.items.findIndex(
        (i) => i.productId === item.productId
      )

      let newItems
      if (existingIndex >= 0) {
        newItems = [...state.cart.items]
        const existing = newItems[existingIndex]!
        newItems[existingIndex] = {
          ...existing,
          quantity: clampQuantity((existing.quantity || 1) + (item.quantity || 1)),
        }
      } else {
        newItems = [...state.cart.items, { ...item, quantity: clampQuantity(item.quantity || 1) }]
      }

      const newCart: InquiryCart = {
        ...state.cart,
        items: newItems,
        updatedAt: Date.now(),
      }

      saveInquiryCart(newCart)
      return { cart: newCart }
    })
  },

  removeItem: (productId: number) => {
    set((state) => {
      const newItems = state.cart.items.filter(
        (item) => item.productId !== productId
      )
      const newCart: InquiryCart = {
        ...state.cart,
        items: newItems,
        updatedAt: Date.now(),
      }
      saveInquiryCart(newCart)
      return { cart: newCart }
    })
  },

  updateQuantity: (productId: number, quantity: number) => {
    set((state) => {
      const newItems = state.cart.items.map((item) => {
        if (item.productId === productId) {
          return { ...item, quantity: clampQuantity(quantity) }
        }
        return item
      })
      const newCart: InquiryCart = {
        ...state.cart,
        items: newItems,
        updatedAt: Date.now(),
      }
      saveInquiryCart(newCart)
      return { cart: newCart }
    })
  },

  updateMessage: (message: string) => {
    set((state) => {
      const newCart: InquiryCart = {
        ...state.cart,
        message,
        updatedAt: Date.now(),
      }
      saveInquiryCart(newCart)
      return { cart: newCart }
    })
  },

  clearCart: () => {
    clearInquiryCart()
    set({ cart: { ...initialCart, createdAt: Date.now(), updatedAt: Date.now() } })
  },
}))

// Selectors - use these in components for reactive values
export function useCartItemCount(cart: InquiryCart): number {
  return cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

export function useCartUniqueCount(cart: InquiryCart): number {
  return cart.items.length
}

export function useCartIsEmpty(cart: InquiryCart): boolean {
  return cart.items.length === 0
}
