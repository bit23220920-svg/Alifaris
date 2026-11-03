import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, Gauge, Fuel, Settings, Palette, Zap, CheckCircle2, ChevronRight } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { InquiryForm } from '@/components/inquiry-form'
import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCarById, cars, formatPrice } from '@/lib/cars-data'
import { ScrollToInquiry } from '@/components/scroll-to-inquiry'

interface CarPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }))
}

export async function generateMetadata({ params }: CarPageProps) {
  const { id } = await params
  const car = getCarById(id)
  if (!car) return { title: 'Car Not Found | ALIFARISO Auto Spare' }
  return {
    title: `${car.year} ${car.brand} ${car.name} | ALIFARISO Auto Spare`,
    description: car.description,
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const { id } = await params
  const car = getCarById(id)
  if (!car) notFound()

  const relatedCars = cars
    .filter(c => c.category === car.category && c.id !== car.id)
    .slice(0, 3)

  // Build gallery: main image + extras, deduplicated, show up to 3 thumbnails
  const allImages = [car.image, ...car.images.filter(img => img !== car.image)]
  const thumbnails = allImages.slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Back Button */}
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

            {/* ── HERO IMAGE ── */}
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
              {/* Car name + price overlaid on the hero */}
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

            {/* ── PHOTO GALLERY (2–3 thumbnails) ── */}
            {thumbnails.length > 1 && (
              <div className={`grid gap-4 ${thumbnails.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
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

            {/* ── QUICK SPECS ── */}
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

            {/* ── ABOUT ── */}
            <div className="glass rounded-2xl p-8 card-glow">
              <h2 className="text-2xl font-bold text-foreground mb-4 red-line pb-2">About This Vehicle</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">{car.description}</p>
            </div>

            {/* ── SPECIFICATIONS ── */}
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

            {/* ── KEY FEATURES ── */}
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

            {/* ── ENQUIRE BUTTON – scrolls to form below ── */}
            <ScrollToInquiry carName={car.name} />

            {/* ── INQUIRY FORM ── */}
            <div id="inquiry-form" className="pt-4 scroll-mt-28">
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

      {/* Related Vehicles */}
      {relatedCars.length > 0 && (
        <section className="py-20 border-t border-border/30 relative overflow-hidden">
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
