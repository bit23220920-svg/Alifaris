'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MessageCircle } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { formatPrice, type Car } from '@/lib/cars-data'
import { WHATSAPP_NUMBER } from '@/lib/config'

export function CarCheckoutPageClient({ car }: { car: Car }) {
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting) return
    setError('')
    setSubmitted(false)
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const customerName = String(formData.get('name') ?? '')
    const phone = String(formData.get('phone') ?? '')
    const email = String(formData.get('email') ?? '')
    const fulfilment = String(formData.get('fulfilment') ?? '')
    const popup = window.open('about:blank', '_blank')

    try {
      const response = await fetch('/api/car-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: car.id, customerName, phone, email, fulfilment }),
      })
      const result = await response.json() as { error?: string; id?: string; total?: number; carName?: string }

      if (response.status === 503) {
        popup?.close()
        const fallbackMessage = encodeURIComponent(
          `ALIFARIS Auto Vehicle Order Request (not saved online)\n\nName: ${customerName}\nPhone: ${phone}\nEmail: ${email}\nFulfilment: ${fulfilment}\n\nVehicle: ${car.year} ${car.brand} ${car.name}\nPrice: ${formatPrice(car.price)}\nPlease confirm availability, delivery costs, and payment.`,
        )
        setWhatsappUrl(`https://wa.me/${WHATSAPP_NUMBER}?text=${fallbackMessage}`)
        setSubmitted(true)
        return
      }

      if (!response.ok || !result.id) {
        popup?.close()
        setError(result.error || 'Could not save your order request. Please try again.')
        return
      }

      const message = encodeURIComponent(
        `ALIFARIS Auto Vehicle Order Request #${result.id}\n\nName: ${customerName}\nPhone: ${phone}\nEmail: ${email}\nFulfilment: ${fulfilment}\n\nVehicle: ${result.carName || `${car.year} ${car.brand} ${car.name}`}\nPrice: ${formatPrice(result.total ?? car.price)}\nPlease confirm availability, delivery costs, and payment.`,
      )
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
      if (popup) popup.location.href = url
      else setWhatsappUrl(url)
      setSubmitted(true)
    } catch (requestError) {
      popup?.close()
      console.error('Unable to submit the car order request:', requestError)
      setError('Could not connect to save your order request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <section className="container mx-auto min-h-[65vh] max-w-3xl px-4 pb-16 pt-32">
        <Link href={`/car/${encodeURIComponent(car.id)}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-orange-400">
          <ArrowLeft className="h-4 w-4" />Back to vehicle
        </Link>
        <h1 className="mb-2 mt-5 text-3xl font-black">Vehicle checkout</h1>
        <p className="mb-6 text-sm text-muted-foreground">Submit an order request. No payment is taken online; our team will confirm availability, delivery costs, and payment with you.</p>
        <div className="mb-6 rounded-xl border border-orange-500/30 bg-orange-500/5 p-4">
          <p className="font-semibold">{car.year} {car.brand} {car.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">Price</p>
          <p className="text-2xl font-black text-orange-400">{formatPrice(car.price)}</p>
        </div>
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
            <p className="mt-2 text-xs text-muted-foreground">If you choose delivery, our team will confirm the address and delivery cost later.</p>
          </fieldset>
          <button type="submit" disabled={submitting} className="flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-500 px-4 font-bold text-black hover:bg-orange-400 disabled:cursor-wait disabled:opacity-60">
            <MessageCircle className="mr-2 h-4 w-4" />{submitting ? 'Submitting request...' : 'Submit order request'}
          </button>
          {error && <p className="text-sm text-red-300" role="alert">{error}</p>}
          {submitted && (
            <p className="text-sm text-emerald-300" role="status">
              Order request submitted. {whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline">Open WhatsApp</a> : 'WhatsApp should open in a new tab.'}
            </p>
          )}
        </form>
      </section>
      <Footer />
    </main>
  )
}
