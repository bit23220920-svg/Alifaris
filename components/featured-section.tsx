import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CarCard } from '@/components/car-card'
import { getFeaturedCars } from '@/lib/cars-data'

export function FeaturedSection() {
  const featuredCars = getFeaturedCars()

  return (
    <section className="py-28 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">Premium Collection</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground red-line">
              Featured <span className="text-primary">Vehicles</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Explore our handpicked selection of premium vehicles. Each car is thoroughly inspected, certified, and ready for its new owner.
            </p>
          </div>
          <Button asChild variant="outline" size="lg" className="border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-full px-8 group">
            <Link href="/inventory">
              View All Cars
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
