import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, Palette, Zap, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import InquiryForm from '@/components/inquiry-form'
import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/cars-data'
import { getCar, listCars, listSpares } from '@/lib/catalog-repository'
import { ScrollToInquiry } from '@/components/scroll-to-inquiry'

interface CarPageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: CarPageProps) {
  const { id } = await params
  const car = await getCar(id)
  if (!car) return { title: 'Car Not Found | ALIFARIS Auto' }
  return {
    title: `${car.year} ${car.brand} ${car.name} | ALIFARIS Auto`,
    description: car.description,
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params
  const [car, cars, allSpares] = await Promise.all([getCar(id), listCars(), listSpares()])
  if (!car) return notFound()

  const relatedCars = cars
    .filter((candidate) => candidate.category === car.category && candidate.id !== car.id)
    .slice(0, 3)
  const compatibleSpares = allSpares.filter((spare) => spare.compatibility.some((fit) =>
    fit.make.toLowerCase() === car.brand.toLowerCase()
    && fit.model.toLowerCase() === car.name.toLowerCase()
    && car.year >= fit.yearFrom
    && car.year <= fit.yearTo,
  ))

  const allImages = [car.image, ...car.images.filter((image) => image !== car.image)]
  const thumbnails = allImages.slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Back button */}
      <div className="pt-28 pb-4">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary rounded-full group">
            <Link href="/inventory">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Inventory
            </Link>
          </Button>
        </div>
      </div>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* Hero image */}
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden glass border-border/30 card-glow">
              <Image
                src={car.image}
                alt={`${car.brand} ${car.name}`}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              <Badge className="absolute top-5 left-5 bg-primary text-primary-foreground capitalize px-4 py-1.5 text-sm font-semibold">
                {car.category}
              </Badge>
              <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <p className="text-primary font-semibold text-sm mb-0.5">{car.brand}</p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow">{car.name}</h1>
                </div>
                <div className="glass-red px-5 py-2.5 rounded-2xl self-start sm:self-auto">
                  <p className="text-xs text-white/70 mb-0.5">Price</p>
                  <span className="text-2xl font-bold text-primary">{formatPrice(car.price)}</span>
                </div>
              </div>
            </div>

            {/* Photo gallery */}
            {thumbnails.length > 1 && (
              <div className={`grid gap-3 sm:gap-4 ${thumbnails.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'}`}>
                {thumbnails.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden glass border-border/30 hover:scale-[1.02] transition-transform cursor-pointer"
                  >
                    <Image
                      src={img}
                      alt={`${car.name} photo ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Quick specs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass rounded-2xl p-5 text-center hover-lift card-glow">
                <Calendar className="w-7 h-7 text-primary mx-auto mb-3" />
                <p className="text-xs text-muted-foreground mb-1">Year</p>
                <p className="text-xl font-bold text-foreground">{car.year}</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center hover-lift card-glow">
                <Gauge className="w-7 h-7 text-primary mx-auto mb-3" />
                <p className="text-xs text-muted-foreground mb-1">Mileage</p>
                <p className="text-xl font-bold text-foreground">{car.mileage.toLocaleString()} mi</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center hover-lift card-glow">
                <Fuel className="w-7 h-7 text-primary mx-auto mb-3" />
                <p className="text-xs text-muted-foreground mb-1">Fuel Type</p>
                <p className="text-xl font-bold text-foreground">{car.fuelType}</p>
              </div>
              <div className="glass rounded-2xl p-5 text-center hover-lift card-glow">
                <Settings className="w-7 h-7 text-primary mx-auto mb-3" />
                <p className="text-xs text-muted-foreground mb-1">Transmission</p>
                <p className="text-lg font-bold text-foreground">{car.transmission}</p>
              </div>
            </div>

            {/* About */}
            <div className="glass rounded-2xl p-8 card-glow">
              <h2 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">About This Vehicle</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{car.description}</p>
            </div>

            {/* Specifications */}
            <div className="glass rounded-2xl p-8 card-glow">
              <h2 className="text-2xl font-bold text-foreground mb-8 red-line pb-2">Specifications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Engine</p>
                    <p className="font-semibold text-foreground">{car.engine}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Gauge className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Horsepower</p>
                    <p className="font-semibold text-foreground">{car.horsepower} HP</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Exterior Color</p>
                    <p className="font-semibold text-foreground">{car.color}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Transmission</p>
                    <p className="font-semibold text-foreground">{car.transmission}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key features */}
            <div className="glass rounded-2xl p-8 card-glow">
              <h2 className="text-2xl font-bold text-foreground mb-8 red-line pb-2">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {car.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {compatibleSpares.length > 0 && (
              <section className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 sm:p-8">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Spares for this car</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Sample compatibility only — please verify fitment before ordering.</p>
                  </div>
                  <Link href="/spares" className="text-sm font-semibold text-orange-400 hover:underline">Browse all spares</Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {compatibleSpares.slice(0, 4).map((spare) => (
                    <Link key={spare.id} href={`/spares/${spare.id}`} className="flex min-h-[72px] items-center justify-between gap-3 rounded-xl border border-border bg-background/70 p-4 transition hover:border-orange-500/50">
                      <span>
                        <span className="block font-semibold">{spare.name}</span>
                        <span className="text-xs text-muted-foreground">{spare.partNumber}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-orange-400">View part <ChevronRight className="inline h-4 w-4" /></span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <Link href={`/car-checkout/${encodeURIComponent(car.id)}`} className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90">
              <ShoppingBag className="h-5 w-5" />
              Request to buy this vehicle
            </Link>

            {/* Enquire button */}
            <ScrollToInquiry carName={car.name} />

            {/* Inquiry form */}
            <div id="inquiry-form" className="pt-4 scroll-mt-28 isolate">
              <h2 className="text-3xl font-bold text-foreground mb-4 text-center red-line pb-2 mx-auto w-fit">
                Interested in this <span className="text-primary">{car.name}</span>?
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Fill out the form below and we&apos;ll get back to you shortly via WhatsApp.
              </p>
              <InquiryForm car={car} />
            </div>

          </div>
        </div>
      </section>

      {/* Related vehicles */}
      {relatedCars.length > 0 && (
        <section className="py-20 border-t border-border/30 relative overflow-clip">
          <div className="absolute top-0 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground red-line pb-2">
                  Similar <span className="text-primary">Vehicles</span>
                </h2>
                <p className="text-muted-foreground mt-2">You might also be interested in these</p>
              </div>
              <Button asChild variant="ghost" className="text-primary hover:text-primary/80 group">
                <Link href={`/inventory?category=${car.category}`}>
                  View All
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedCars.map((relatedCar, index) => (
                <CarCard key={relatedCar.id} car={relatedCar} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
