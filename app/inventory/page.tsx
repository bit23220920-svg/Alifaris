'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Search, SlidersHorizontal, X, ChevronDown, Car } from 'lucide-react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { CarCard } from '@/components/car-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cars, categories, type CarCategory } from '@/lib/cars-data'

function InventoryContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as CarCategory | null

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CarCategory | null>(categoryParam)
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'year-desc' | 'name'>('year-desc')

  const filteredCars = useMemo(() => {
    let result = [...cars]

    // Filter by category
    if (selectedCategory) {
      result = result.filter(car => car.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(car => 
        car.name.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'year-desc':
        result.sort((a, b) => b.year - a.year)
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [selectedCategory, searchQuery, sortBy])

  const clearFilters = () => {
    setSelectedCategory(null)
    setSearchQuery('')
    setSortBy('year-desc')
  }

  const hasActiveFilters = selectedCategory || searchQuery

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0160-Lz9QlGITJxlKotyq194vsjY3vqE0OB.jpg"
            alt="Vehicle Inventory"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-background/95" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>
        
        {/* Decorative */}
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-6">
              <Car className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">Premium Collection</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-gradient">Inventory</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Browse our complete collection of premium vehicles. Find your perfect match today.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 border-y border-border/30 glass sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-secondary/50 border-border/50 rounded-full h-12"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              {/* Category Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border/50 gap-2 rounded-full px-6 h-11">
                    <SlidersHorizontal className="w-4 h-4" />
                    {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Categories'}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-border/50">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category.id} 
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border/50 gap-2 rounded-full px-6 h-11">
                    Sort By
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-border/50">
                  <DropdownMenuItem onClick={() => setSortBy('year-desc')}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-asc')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-desc')}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('name')}>
                    Name: A to Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20 bg-primary/10 text-primary border-primary/20 rounded-full px-4"
                  onClick={() => setSelectedCategory(null)}
                >
                  {categories.find(c => c.id === selectedCategory)?.name}
                  <X className="w-3 h-3 ml-2" />
                </Badge>
              )}
              {searchQuery && (
                <Badge 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20 bg-primary/10 text-primary border-primary/20 rounded-full px-4"
                  onClick={() => setSearchQuery('')}
                >
                  Search: {searchQuery}
                  <X className="w-3 h-3 ml-2" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <p className="text-muted-foreground mb-10">
            Showing <span className="text-primary font-bold">{filteredCars.length}</span> vehicles
          </p>

          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-8 rounded-2xl glass-red flex items-center justify-center">
                <Search className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No vehicles found</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you are looking for
              </p>
              <Button onClick={clearFilters} className="bg-primary hover:bg-primary/90 rounded-full px-8">
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

export default function InventoryPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        </div>
      </main>
    }>
      <InventoryContent />
    </Suspense>
  )
}
