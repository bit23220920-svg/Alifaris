'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { Spare } from '@/lib/spares-data'

export interface CartItem {
  spareId: string
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  itemCount: number
  addItem: (spare: Spare, quantity?: number) => boolean
  updateQuantity: (spareId: string, quantity: number, stockLimit: number) => void
  removeItem: (spareId: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const CART_STORAGE_KEY = 'alifaris-spares-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (!Array.isArray(parsed)) throw new Error('Stored cart is not an array')
        const validItems = parsed.flatMap((item: unknown) => {
          if (!item || typeof item !== 'object' || !('spareId' in item) || !('quantity' in item)) return []
          const spareId = item.spareId
          const quantity = item.quantity
          if (typeof spareId !== 'string' || typeof quantity !== 'number' || !Number.isInteger(quantity)) return []
          return [{ spareId, quantity: Math.max(1, quantity) }]
        })
        setItems(validItems)
      }
    } catch (error) {
      console.error('Unable to restore the saved spares cart:', error)
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.error('Unable to save the spares cart:', error)
    }
  }, [hydrated, items])

  const addItem = useCallback((spare: Spare, quantity = 1) => {
    const spareId = spare.id
    const limit = spare.condition === 'used' ? Math.min(spare.stock, 1) : spare.stock
    if (!spare || limit < 1 || quantity < 1) return false
    const currentQuantity = items.find((item) => item.spareId === spareId)?.quantity ?? 0
    if (currentQuantity >= limit) return false
    setItems((current) => {
      const existing = current.find((item) => item.spareId === spareId)
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, limit)
      return existing
        ? current.map((item) => item.spareId === spareId ? { ...item, quantity: nextQuantity } : item)
        : [...current, { spareId, quantity: nextQuantity }]
    })
    return true
  }, [items])

  const updateQuantity = useCallback((spareId: string, quantity: number, stockLimit: number) => {
    const limit = Math.max(0, stockLimit)
    if (quantity <= 0 || limit === 0) {
      setItems((current) => current.filter((item) => item.spareId !== spareId))
    } else if (limit > 0) {
      setItems((current) => current.map((item) =>
        item.spareId === spareId ? { ...item, quantity: Math.min(quantity, limit) } : item,
      ))
    }
  }, [])

  const removeItem = useCallback((spareId: string) => {
    setItems((current) => current.filter((item) => item.spareId !== spareId))
  }, [])
  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(() => ({
    items,
    itemCount: items.reduce((total, item) => total + item.quantity, 0),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, addItem, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within a CartProvider')
  return context
}
