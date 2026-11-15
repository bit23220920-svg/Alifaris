import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Mail, MessageCircle } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { AddToCartButton } from '@/components/spares/add-to-cart-button'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/spares-data'
import { getSpare, listCars } from '@/lib/catalog-repository'
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '@/lib/config'

interface SparePageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: SparePageProps) {
  const { id } = await params
  const spare = await getSpare(id)
  return { title: spare ? `${spare.name} | ALIFARIS Auto Spares` : 'Part not found | ALIFARIS Auto' }
}

export default async function SparePage({ params }: SparePageProps) {
  const { id } = await params
  const [spare, cars] = await Promise.all([getSpare(id), listCars()])
  if (!spare) notFound()

  const matchingCars = cars.filter((car) => !spare.isSample && spare.compatibility.some((fit) =>
    car.brand.toLowerCase() === fit.make.toLowerCase()
    && car.name.toLowerCase() === fit.model.toLowerCase()
    && car.year >= fit.yearFrom
    && car.year <= fit.yearTo,
  ))
  const whatsappText = encodeURIComponent(`Hello ALIFARIS Auto, I would like to enquire about ${spare.name}. Please confirm the price, availability and vehicle fitment.`)
  const emailSubject = encodeURIComponent(`Spares enquiry: ${spare.name}`)
  const emailBody = encodeURIComponent(`Hello ALIFARIS Auto,\n\nI would like to enquire about ${spare.name}. Please confirm the price, availability and vehicle fitment.`)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 pb-4 pt-32">
        <Button asChild variant="ghost" className="min-h-11 text-muted-foreground hover:text-orange-400">
          <Link href="/spares"><ArrowLeft className="mr-2 h-4 w-4" />Back to spares</Link>
        </Button>
      </div>
      <section className="container mx-auto grid gap-8 px-4 pb-16 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-orange-500/20 bg-card">
          <Image src={spare.image} alt={spare.name} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="space-y-6 py-2">
          <div>
            <p className="font-semibold uppercase tracking-wide text-orange-400">{spare.category}</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{spare.name}</h1>
            {!spare.isSample && <p className="mt-3 text-muted-foreground">Part number: <span className="font-medium text-foreground">{spare.partNumber}</span></p>}
          </div>
          <div className="flex flex-wrap gap-2">
            {spare.isSample ? (
              <span className="rounded-full border border-border px-3 py-1.5 text-sm">Condition and availability to be confirmed</span>
            ) : (
              <>
                <span className="rounded-full border border-border px-3 py-1.5 text-sm capitalize">{spare.condition}</span>
                {spare.condition === 'used' && <span className="rounded-full border border-border px-3 py-1.5 text-sm">{spare.grade}</span>}
                <span className={`rounded-full px-3 py-1.5 text-sm ${spare.stock > 0 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                  {spare.stock > 0 ? `In stock · ${spare.stock}` : 'Out of stock'}
                </span>
              </>
            )}
          </div>
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
            <p className="text-sm text-orange-200">{spare.isSample ? 'Price and availability' : 'Price'}</p>
            <p className="mt-1 text-3xl font-black text-orange-400">{spare.isSample ? 'To be confirmed' : formatPrice(spare.price)}</p>
            {spare.isSample && <p className="mt-2 text-xs text-muted-foreground">Contact us to confirm the part details and vehicle fitment.</p>}
          </div>
          <p className="leading-relaxed text-muted-foreground">{spare.description}</p>
          <div>
            <h2 className="mb-3 text-lg font-bold">{spare.isSample ? 'Vehicle fitment' : 'Fits these vehicles'}</h2>
            <ul className="space-y-2">
              {spare.isSample
                ? <li className="text-sm text-muted-foreground">To be confirmed. Contact us with your vehicle details.</li>
                : spare.compatibility.map((fit) => {
                const car = matchingCars.find((item) => item.brand === fit.make && item.name === fit.model)
                return (
                  <li key={`${fit.make}-${fit.model}`} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" />
                    {car ? (
                      <Link className="text-foreground underline decoration-orange-500/50 underline-offset-4 hover:text-orange-400" href={`/car/${car.id}`}>
                        {fit.yearFrom}–{fit.yearTo} {fit.make} {fit.model} · View showroom car
                      </Link>
                    ) : `${fit.yearFrom}–${fit.yearTo} ${fit.make} ${fit.model}`}
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="space-y-2">
            <AddToCartButton spare={spare} />
            <Button asChild variant="outline" className="min-h-12 w-full border-emerald-600/50 text-emerald-300 hover:bg-emerald-500/10">
              <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappText}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />Enquire on WhatsApp
              </a>
            </Button>
            <Button asChild variant="ghost" className="min-h-11 w-full text-muted-foreground hover:text-orange-400">
              <a href={`mailto:${CONTACT_EMAIL}?subject=${emailSubject}&body=${emailBody}`}>
                <Mail className="mr-2 h-4 w-4" />Enquire by email
              </a>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
