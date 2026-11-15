import Link from 'next/link'
import { ArrowRight, Clock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CarCard } from '@/components/car-card'
import { getFeaturedCars, type Car } from '@/lib/cars-data'

export function FeaturedSection({ cars }: { cars: Car[] }) {
  const featuredCars = getFeaturedCars(cars)

  return (
    <section className="border-y border-border/60 bg-background py-12 sm:py-16 overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 relative">
        <div className="mb-6 flex flex-col gap-3 border-b border-border/60 pb-4 sm:pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-primary-foreground">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-black uppercase tracking-wide">Premium Collection</span>
            </div>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
              Featured Vehicles
            </h2>
            <p className="mt-3 text-muted-foreground">
              Explore our handpicked selection of premium vehicles. Each car is thoroughly inspected, certified, and ready for its new owner.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="rounded-md border-border/70 px-6 font-bold hover:border-primary/60 hover:bg-primary/5">
            <Link href="/inventory">
              View All Cars
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mb-5 -mx-4 overflow-x-auto scrollbar-none sm:mx-0">
          <div className="flex gap-3 px-4 pb-2 sm:grid sm:grid-cols-3 sm:px-0 sm:pb-0">
            {['Today Special Offer', 'Prime seller', 'Special Discount'].map(label => (
              <Link
                key={label}
                href="/inventory"
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/70 px-4 py-3 text-sm font-bold hover:border-primary/70 hover:text-primary shrink-0 sm:shrink"
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Clock className="h-4 w-4 text-primary" />
                  {label}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
