'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Car, Zap, Truck, Sparkles, CircleDot, Crown, ArrowRight } from 'lucide-react'
import { categories, getCarsByCategory } from '@/lib/cars-data'

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

export function CategoriesSection() {
  return (
    <section className="py-28 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-4">
            <Car className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Browse By Type</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground">
            Vehicle <span className="text-primary">Categories</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto text-lg">
            Find the perfect vehicle type for your lifestyle and needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((category, index) => {
            const carCount = getCarsByCategory(category.id).length
            
            return (
              <Link
                key={category.id}
                href={`/inventory?category=${category.id}`}
                className="group relative overflow-hidden rounded-2xl glass border-border/30 hover-lift card-glow animate-fade-in-up aspect-[3/4]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={categoryImages[category.id]}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative h-full flex flex-col justify-end p-5">
                  <div className="w-12 h-12 rounded-xl glass-red flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                    {categoryIcons[category.id] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
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
