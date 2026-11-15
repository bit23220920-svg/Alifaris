'use client'

import { useState } from 'react'
import { ArrowRight, Award, Car, Gauge, Headphones, Search, Shield, SlidersHorizontal, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { categories, getPriceRange, getYearRange, type Car as CarType } from '@/lib/cars-data'

const quickLinks = [
  'Toyota',
  'Mercedes-Benz',
  'Land Cruiser',
  'SUV',
  'Truck',
  'Under $60,000',
]

export function HeroSection({ cars }: { cars: CarType[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minYear, setMinYear] = useState('')

  const brands = Array.from(new Set(cars.map(car => car.brand))).sort()
  const { min: minPrice, max: topPrice } = getPriceRange(cars)
  const { min: oldestYear, max: newestYear } = getYearRange(cars)
  const popularCars = quickLinks.map(label => {
    const car =
      label === 'Toyota'
        ? cars.find(item => item.brand === 'Toyota')
        : label === 'Mercedes-Benz'
          ? cars.find(item => item.brand === 'Mercedes-Benz')
          : label === 'Land Cruiser'
            ? cars.find(item => item.name.toLowerCase().includes('land cruiser'))
            : label === 'SUV'
              ? cars.find(item => item.category === 'suv')
              : label === 'Truck'
                ? cars.find(item => item.category === 'truck')
                : cars.find(item => item.price <= 60000)

    return car ? { label, car } : null
  }).filter(Boolean) as { label: string; car: typeof cars[number] }[]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (category) params.set('category', category)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minYear) params.set('minYear', minYear)

    router.push(params.toString() ? `/inventory?${params.toString()}` : '/inventory')
  }

  const handleQuickSearch = (value: string) => {
    if (value === 'Under $60,000') {
      router.push('/inventory?maxPrice=60000')
      return
    }
    router.push(`/inventory?q=${encodeURIComponent(value)}`)
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0162-wwlxk8M12Vra3YuD5AnS5EaAGinc9a.jpg"
          alt="Premium car stock"
          fill
          className="object-cover object-center opacity-45"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/70" />
      </div>

      <div className="container mx-auto px-3 pt-24 pb-10 relative z-10 sm:px-4 sm:pt-32 lg:pt-36 lg:pb-16">
        <div className="mb-4 grid grid-cols-1 gap-2 rounded-lg border border-border/60 bg-card/95 px-3 py-3 text-xs shadow-2xl sm:px-4 sm:text-sm lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="grid gap-2 text-muted-foreground sm:flex sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-2">
            <span className="font-semibold text-foreground">Total Cars In Stock: {cars.length}</span>
            <span>Cars Added Today: 3</span>
            <span>Location: Lusaka, Zambia</span>
            <span>Currency: USD</span>
          </div>
          <div className="flex items-center gap-2 font-semibold text-primary sm:justify-end sm:text-right">
            <Star className="h-4 w-4 fill-primary" />
            Premium Auto Dealership
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
          <div className="min-w-0 rounded-lg border border-border/60 bg-card/95 shadow-2xl">
            <div className="border-b border-border/60 bg-primary px-4 py-3 text-primary-foreground sm:px-5">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-lg font-black tracking-wide sm:text-xl md:text-2xl">SEARCH FOR CARS</h1>
                <span className="hidden text-sm font-semibold sm:inline">{cars.length} items match</span>
              </div>
            </div>

            <form onSubmit={handleSearch} className="p-4 sm:p-5">
              <div className="mb-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by brand, model, color..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="h-11 w-full rounded-md border-border/70 bg-background pl-10"
                  />
                </div>

                <select
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="h-11 w-full rounded-md border border-border/70 bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Make</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>

                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="h-11 w-full rounded-md border border-border/70 bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Body Type</option>
                  {categories.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>

                <select
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="h-11 w-full rounded-md border border-border/70 bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Max Price</option>
                  {[60000, 80000, 100000, 150000, topPrice].map(price => (
                    <option key={price} value={price}>Up to ${price.toLocaleString()}</option>
                  ))}
                </select>

                <Button type="submit" className="h-11 w-full rounded-md bg-primary px-8 font-black uppercase hover:bg-primary/90 lg:w-auto">
                  Search
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-3 border-t border-border/50 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={minYear}
                  onChange={e => setMinYear(e.target.value)}
                  className="h-10 w-full rounded-md border border-border/70 bg-background px-3 text-sm text-foreground"
                >
                  <option value="">Year From</option>
                  {Array.from({ length: newestYear - oldestYear + 1 }, (_, index) => newestYear - index).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <div className="flex min-h-10 items-center rounded-md border border-border/70 bg-background px-3 py-2 text-sm text-muted-foreground">
                  Price range: ${minPrice.toLocaleString()} - ${topPrice.toLocaleString()}
                </div>
                <Link href="/inventory" className="flex min-h-10 w-full items-center justify-center rounded-md border border-border/70 bg-secondary px-3 py-2 text-sm font-semibold hover:border-primary/60">
                  Advanced Search
                  <SlidersHorizontal className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/contact" className="flex min-h-10 w-full items-center justify-center rounded-md border border-border/70 bg-secondary px-3 py-2 text-sm font-semibold hover:border-primary/60">
                  Get In Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 overflow-hidden rounded-lg border border-border/60 bg-background/70 p-3 sm:p-4">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span className="text-sm font-black uppercase tracking-wide text-foreground">Popular</span>
                  <span className="text-xs font-semibold text-muted-foreground">Tap a vehicle to view details</span>
                </div>

                <div className="popular-marquee">
                  {[...popularCars, ...popularCars].map(({ label, car }, index) => (
                    <div key={`${label}-${car.id}-${index}`} className="popular-marquee-item">
                      <button
                        type="button"
                        onClick={() => handleQuickSearch(label)}
                        className="mb-2 w-full rounded-md border border-border/60 bg-secondary px-3 py-1.5 text-xs font-bold text-foreground hover:border-primary/70 hover:text-primary"
                      >
                        {label}
                      </button>
                      <Link
                        href={`/car/${car.id}`}
                        className="group block overflow-hidden rounded-lg border border-border/60 bg-card hover:border-primary/70"
                      >
                        <div className="relative h-32 w-full overflow-hidden sm:h-28 sm:w-44">
                          <Image
                            src={car.image}
                            alt={`${car.brand} ${car.name}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 144px, 176px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="truncate text-xs font-bold text-foreground">{car.brand}</p>
                            <p className="truncate text-[11px] text-muted-foreground">{car.name}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg border border-primary/50 bg-primary p-4 sm:p-5 text-primary-foreground shadow-2xl overflow-hidden">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wide">Today Special Offer</p>
              <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black leading-tight">Drive Your DREAM Today</h2>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-primary-foreground/85">
                Welcome to ALIFARIS Auto. Discover premium vehicles from rugged Land Cruisers to luxurious Mercedes AMG.
              </p>
              <Button asChild className="mt-5 h-10 rounded-md bg-background px-5 font-bold text-foreground hover:bg-background/90">
                <Link href="/inventory">
                  View Inventory
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

              <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-border/60 bg-card/95 p-3">
                <p className="text-xl sm:text-2xl font-black text-primary">50+</p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Premium Cars</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card/95 p-3">
                <p className="text-xl sm:text-2xl font-black text-foreground">100%</p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Satisfaction</p>
              </div>
              <div className="rounded-lg border border-border/60 bg-card/95 p-3">
                <p className="text-xl sm:text-2xl font-black text-foreground">24/7</p>
                <p className="mt-1 text-[10px] sm:text-xs text-muted-foreground">Support</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            { icon: Shield, title: 'Certified Quality', text: 'Every vehicle thoroughly inspected' },
            { icon: Award, title: 'Best Prices', text: 'Competitive rates guaranteed' },
            { icon: Headphones, title: '24/7 Support', text: 'We are always here for you' },
            { icon: Gauge, title: 'Fast Inquiry', text: 'WhatsApp and email support ready' },
          ].map(item => (
            <div key={item.title} className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/90 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 -mx-3 overflow-x-auto scrollbar-none sm:mx-0">
          <div className="flex gap-3 px-3 pb-2 sm:grid sm:grid-cols-2 sm:px-0 lg:grid-cols-4 sm:pb-0">
            {categories.slice(0, 4).map(item => (
              <Link
                key={item.id}
                href={`/inventory?category=${item.id}`}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/90 px-4 py-3 text-sm font-bold hover:border-primary/70 hover:text-primary shrink-0 sm:shrink"
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Car className="h-4 w-4" />
                  {item.name}
                </span>
                <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}