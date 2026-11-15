'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useCart } from '@/components/spares/cart-provider'
import { formatPrice, type Spare } from '@/lib/spares-data'

export function CartPageClient({ allSpares }: { allSpares: Spare[] }) {
  const { items, updateQuantity, removeItem } = useCart()
  useEffect(() => {
    items.forEach((item) => {
      const spare = allSpares.find((candidate) => candidate.id === item.spareId)
      if (!spare) {
        removeItem(item.spareId)
        return
      }
      const limit = spare.condition === 'used' ? Math.min(spare.stock, 1) : spare.stock
      if (limit === 0 || item.quantity > limit) updateQuantity(item.spareId, Math.min(item.quantity, limit), limit)
    })
  }, [items, allSpares, removeItem, updateQuantity])
  const cartItems = items.flatMap((item) => {
    const spare = allSpares.find((candidate) => candidate.id === item.spareId)
    return spare ? [{ ...item, spare }] : []
  })
  const hasPendingDetails = cartItems.some((item) => item.spare.isSample)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="container mx-auto min-h-[65vh] px-4 pb-16 pt-32">
        <Link href="/spares" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-orange-400">
          <ArrowLeft className="h-4 w-4" />Continue shopping
        </Link>
        <h1 className="mb-2 mt-5 text-3xl font-black">Your spares cart</h1>
        <p className="mb-8 text-sm text-orange-200">Confirm current availability and prices before ordering.</p>
        {cartItems.length ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <ul className="space-y-4">
              {cartItems.map(({ spare, quantity }) => {
                const maxQuantity = spare.condition === 'used' ? 1 : spare.stock
                return (
                  <li key={spare.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 sm:flex-row sm:items-center">
                    <Link href={`/spares/${spare.id}`} className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl sm:w-32">
                      <Image src={spare.image} alt={spare.name} fill sizes="128px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/spares/${spare.id}`} className="font-bold hover:text-orange-400">{spare.name}</Link>
                      <p className="mt-1 text-sm text-muted-foreground">{spare.isSample ? 'Price and part number to be confirmed' : `${spare.partNumber} · ${formatPrice(spare.price)}`}</p>
                      {!spare.isSample && <p className="mt-1 text-sm font-semibold text-orange-400">{formatPrice(spare.price * quantity)} subtotal</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => updateQuantity(spare.id, quantity - 1, maxQuantity)} aria-label={`Decrease ${spare.name} quantity`} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:border-orange-500"><Minus className="h-4 w-4" /></button>
                      <span className="min-w-8 text-center" aria-label={`Quantity ${quantity}`}>{quantity}</span>
                      <button type="button" onClick={() => updateQuantity(spare.id, quantity + 1, maxQuantity)} disabled={quantity >= maxQuantity} aria-label={`Increase ${spare.name} quantity`} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border hover:border-orange-500 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                      <button type="button" onClick={() => removeItem(spare.id)} aria-label={`Remove ${spare.name} from cart`} className="flex h-11 w-11 items-center justify-center rounded-lg text-red-300 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </li>
                )
              })}
            </ul>
            <aside className="h-fit rounded-2xl border border-orange-500/30 bg-card p-5">
              <h2 className="text-lg font-bold">Order summary</h2>
              <p className="mt-3 text-sm text-muted-foreground">{hasPendingDetails ? 'Price' : 'Subtotal'}</p>
              <p className="text-2xl font-black text-orange-400">{hasPendingDetails ? 'To be confirmed' : formatPrice(cartItems.reduce((sum, item) => sum + item.spare.price * item.quantity, 0))}</p>
              <p className="mt-2 text-xs text-muted-foreground">Delivery costs, final price, and availability are confirmed by ALIFARIS Auto.</p>
              <Link href="/checkout" className="mt-5 flex min-h-12 items-center justify-center rounded-lg bg-orange-500 px-4 font-bold text-black hover:bg-orange-400">Proceed to checkout</Link>
            </aside>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center">
            <p className="mb-5 text-muted-foreground">Your cart is empty or its items are no longer listed.</p>
            <Link href="/spares" className="inline-flex min-h-11 items-center rounded-lg bg-orange-500 px-5 font-semibold text-black">Browse parts</Link>
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
