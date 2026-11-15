'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { useCart } from '@/components/spares/cart-provider'
import { formatPrice, type Spare } from '@/lib/spares-data'
import { WHATSAPP_NUMBER } from '@/lib/config'

export function CheckoutPageClient({ allSpares }: { allSpares: Spare[] }) {
  const { items, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const cartItems = items.flatMap((item) => {
    const spare = allSpares.find((candidate) => candidate.id === item.spareId)
    if (!spare) return []
    const maxQuantity = spare.condition === 'used' ? 1 : spare.stock
    return maxQuantity > 0 ? [{ ...item, quantity: Math.min(item.quantity, maxQuantity), spare }] : []
  })
  const hasPendingDetails = cartItems.some((item) => item.spare.isSample)
  const total = hasPendingDetails ? null : cartItems.reduce((sum, item) => sum + item.spare.price * item.quantity, 0)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSubmitted(false)
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const email = String(formData.get('email') ?? '')
    const fulfilment = String(formData.get('fulfilment') ?? '')
    const popup = window.open('about:blank', '_blank')
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          fulfilment,
          items: cartItems.map(({ spare, quantity }) => ({ spareId: spare.id, quantity })),
        }),
      })
      const result = await response.json() as {
        error?: string
        id?: string
        total?: number
        items?: { name: string; partNumber: string; quantity: number; price: number }[]
      }

      if (response.status === 503) {
        popup?.close()
        const fallbackItems = cartItems.map(({ spare, quantity }) =>
          `- ${spare.name} x${quantity}${spare.isSample ? ' — price to be confirmed' : ` — ${formatPrice(spare.price * quantity)}`}`,
        ).join('\n')
        const fallbackMessage = encodeURIComponent(
          `ALIFARIS Auto Spares Order Request (not saved online)\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nFulfilment: ${fulfilment}\n\nItems:\n${fallbackItems}\n\nSubtotal: ${total === null ? 'To be confirmed' : formatPrice(total)}\nPlease confirm stock and delivery costs.`,
        )
        setWhatsappUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${fallbackMessage}`)
        setSubmitted(true)
        return
      }
      if (!response.ok || !result.id || !result.items) {
        popup?.close()
        setError(result.error || 'Could not save your order. Please try again.')
        return
      }

      const orderLines = result.items.map((item) =>
        `- ${item.name} (${item.partNumber}) x${item.quantity} — ${formatPrice(item.price * item.quantity)}`,
      ).join('\n')
      const message = encodeURIComponent(
        `ALIFARIS Auto Spares Order Request #${result.id}\n\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nFulfilment: ${fulfilment}\n\nItems:\n${orderLines}\n\nSubtotal: ${formatPrice(result.total ?? 0)}\nPlease confirm delivery details.`,
      )
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
      if (popup) popup.location.href = url
      else setWhatsappUrl(url)
      clearCart()
      setSubmitted(true)
    } catch (requestError) {
      popup?.close()
      console.error('Unable to submit the checkout order:', requestError)
      setError('Could not connect to save your order. Please try again.')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="container mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-32">
        <Link href="/cart" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-orange-400"><ArrowLeft className="h-4 w-4" />Back to cart</Link>
        <h1 className="mb-2 mt-5 text-3xl font-black">Checkout</h1>
        <p className="mb-6 text-sm text-muted-foreground">Your order will be sent as a WhatsApp request. No payment is taken on this storefront.</p>
        {cartItems.length ? (
          <>
            <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
              <p className="font-semibold">Order summary</p>
              {cartItems.map(({ spare, quantity }) => <p key={spare.id} className="mt-2 text-sm text-muted-foreground">{spare.name} × {quantity} — {spare.isSample ? 'price to be confirmed' : formatPrice(spare.price * quantity)}</p>)}
              <p className="mt-3 font-bold text-orange-400">{total === null ? 'Price to be confirmed' : `Subtotal: ${formatPrice(total)}`}</p>
            </div>
            {hasPendingDetails && <p role="alert" className="mb-5 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-sm text-orange-200">Some item details are still being confirmed and cannot be ordered yet. Remove them from your cart to continue.</p>}
            <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card/60 p-5 sm:p-8">
              <label className="block space-y-2 text-sm font-medium">Full name
                <input required name="name" autoComplete="name" className="h-12 w-full rounded-lg border border-border bg-background px-3" />
              </label>
              <label className="block space-y-2 text-sm font-medium">Phone
                <input required name="phone" type="tel" autoComplete="tel" className="h-12 w-full rounded-lg border border-border bg-background px-3" />
              </label>
              <label className="block space-y-2 text-sm font-medium">Email
                <input required name="email" type="email" autoComplete="email" className="h-12 w-full rounded-lg border border-border bg-background px-3" />
              </label>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Delivery or pickup</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border px-3"><input required type="radio" name="fulfilment" value="Delivery" />Delivery</label>
                  <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border px-3"><input required type="radio" name="fulfilment" value="Pickup" />Pickup</label>
                </div>
              </fieldset>
              <button type="submit" disabled={hasPendingDetails} className="flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-500 px-4 font-bold text-black hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50">
                <MessageCircle className="mr-2 h-4 w-4" />Send order request on WhatsApp
              </button>
              {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
              {submitted && (
                <p className="text-sm text-emerald-300" role="status">
                  Order request ready. {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline">Open WhatsApp</a> : 'WhatsApp should open in a new tab.'}
                </p>
              )}
            </form>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            Your cart is empty or items are no longer available. <Link href="/spares" className="text-orange-400 underline">Browse parts</Link>.
          </div>
        )}
      </section>
      <Footer />
    </main>
  )
}
