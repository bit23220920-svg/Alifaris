import Link from 'next/link'
import Image from 'next/image'
import { Car, Zap, Truck, Sparkles, CircleDot, Crown, ArrowRight } from 'lucide-react'
import { categories, getCarsByCategory, type Car as CarType } from '@/lib/cars-data'

const categoryIcons: Record<string, React.ReactNode>= {
  suv: <Car className="w-7 h-7" />,
  coupe: <CircleDot className="w-7 h-7" />,
  truck: <Truck className="w-7 h-7" />,
  electric: <Zap className="w-7 h-7" />,
  sedan: <Car className="w-7 h-7" />,
  luxury: <Crown className="w-7 h-7" />,
}

const categoryImages: Record<string, string> = {
  suv: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0164-auWE2yaxGb8qSKprlVDN8J4Tmp9CW7.jpg',
  coupe: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0169-IeQK8A8ADCU1q8e5Tc2iL2FGpfKf9I.jpg',
  truck: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260410-WA0086-6Zm6qb0XORutJijiMXgqHXgB95ISuS.jpg',
  electric: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg',
  sedan: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0161-Szc7GM0V4DDfQfDya0Knr1WeEo8Dde.jpg',
  luxury: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0162-wwlxk8M12Vra3YuD5AnS5EaAGinc9a.jpg',
}

export function CategoriesSection({ cars }: { cars: CarType[] }) {
  return (
    <section className="bg-secondary/30 py-12 sm:py-16">
      <div className="container mx-auto px-3 sm:px-4 relative">
        <div className="mb-6 flex flex-col gap-2 border-b border-border/60 pb-4 sm:pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-card px-3 py-1.5 text-primary">
              <Car className="h-4 w-4" />
              <span className="text-sm font-black uppercase tracking-wide">Browse By Type</span>
            </div>
            <h2 className="text-2xl font-black text-foreground sm:text-3xl lg:text-4xl">
              Vehicle Categories
            </h2>
            <p className="mt-2 text-muted-foreground">
              Find the perfect vehicle type for your lifestyle and needs
            </p>
          </div>
          <Link href="/inventory" className="text-sm font-bold text-primary hover:text-primary/80">
            View all body types
            <ArrowRight className="ml-1 inline h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((category, index) => {
            const carCount = getCarsByCategory(category.id, cars).length
            
            return (
              <Link
                key={category.id}
                href={`/inventory?category=${category.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-border/60 bg-card animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="absolute inset-0">
                  <Image
                    src={categoryImages[category.id]}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/5" />
                </div>

                <div className="relative flex h-full flex-col justify-end p-4">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                    {categoryIcons[category.id] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <h3 className="text-lg font-black text-foreground transition-colors group-hover:text-primary">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-bold text-primary">
                    <span>{carCount} {carCount === 1 ? 'vehicle' : 'vehicles'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
