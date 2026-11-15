'use client'
import { useState, useMemo, Suspense, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
  Search, X, ChevronDown, Car as CarIcon,
  Filter, RotateCcw
} from 'lucide-react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  categories,
  searchCars,
  getUniqueFuelTypes,
  getUniqueTransmissions,
  getPriceRange,
  getYearRange,
  formatPrice,
  type CarCategory,
  type Car,
  type SearchFilters,
} from '@/lib/cars-data'
import InquiryForm from '@/components/inquiry-form'

const SORT_LABELS: Record<string, string> = {
  'year-desc': 'Newest First',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  'name': 'Name: A to Z',
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
        active
          ? 'bg-primary text-primary-foreground border-primary'
          : 'border-border/50 text-muted-foreground hover:border-primary/50 hover:text-primary'
      }`}
    >
      {children}
    </button>
  )
}

function DualRangeSlider({
  label,
  min,
  max,
  valueMin,
  valueMax,
  step,
  format,
  onChange,
}: {
  label: string
  min: number
  max: number
  valueMin: number
  valueMax: number
  step: number
  format: (v: number) => string
  onChange: (min: number, max: number) => void
}) {
  const minPercent = ((valueMin - min) / (max - min)) * 100
  const maxPercent = ((valueMax - min) / (max - min)) * 100

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</span>
        <span className="text-xs text-primary font-semibold">
          {format(valueMin)} – {format(valueMax)}
        </span>
      </div>
      <div className="relative h-6 flex items-center">
        <div className="absolute w-full h-1.5 bg-secondary rounded-full" />
        <div
          className="absolute h-1.5 bg-primary rounded-full pointer-events-none"
          style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMin}
          onChange={e => {
            const v = Number(e.target.value)
            if (v <= valueMax) onChange(v, valueMax)
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={valueMax}
          onChange={e => {
            const v = Number(e.target.value)
            if (v >= valueMin) onChange(valueMin, v)
          }}
          className="absolute w-full h-full opacity-0 cursor-pointer z-20"
        />
        {/* Thumb indicators */}
        <div
          className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md pointer-events-none z-5"
          style={{ left: `calc(${minPercent}% - 8px)` }}
        />
        <div
          className="absolute w-4 h-4 bg-primary rounded-full border-2 border-background shadow-md pointer-events-none z-5"
          style={{ left: `calc(${maxPercent}% - 8px)` }}
        />
      </div>
    </div>
  )
}

function FilterPanel({
  filters,
  onFiltersChange,
  onReset,
  activeFilterCount,
  availableCars,
}: {
  filters: SearchFilters
  onFiltersChange: (f: Partial<SearchFilters>) => void
  onReset: () => void
  activeFilterCount: number
  availableCars: Car[]
}) {
  const priceRange = getPriceRange(availableCars)
  const yearRange = getYearRange(availableCars)
  const fuelTypes = getUniqueFuelTypes(availableCars)
  const transmissions = getUniqueTransmissions(availableCars)
  return (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="w-full rounded-full border-primary/40 text-primary hover:bg-primary/10 gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset filters ({activeFilterCount})
        </Button>
      )}

      {/* Category */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Category</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={!filters.category} onClick={() => onFiltersChange({ category: null })}>
            All
          </FilterPill>
          {categories.map(cat => (
            <FilterPill
              key={cat.id}
              active={filters.category === cat.id}
              onClick={() => onFiltersChange({ category: cat.id })}
            >
              {cat.name}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Price */}
      <DualRangeSlider
        label="Price"
        min={priceRange.min}
        max={priceRange.max}
        step={5000}
        valueMin={filters.minPrice ?? priceRange.min}
        valueMax={filters.maxPrice ?? priceRange.max}
        format={v => formatPrice(v)}
        onChange={(min, max) => onFiltersChange({ minPrice: min, maxPrice: max })}
      />

      {/* Year */}
      <DualRangeSlider
        label="Year"
        min={yearRange.min}
        max={yearRange.max}
        step={1}
        valueMin={filters.minYear ?? yearRange.min}
        valueMax={filters.maxYear ?? yearRange.max}
        format={v => String(v)}
        onChange={(min, max) => onFiltersChange({ minYear: min, maxYear: max })}
      />

      {/* Fuel Type */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Fuel Type</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={!filters.fuelType} onClick={() => onFiltersChange({ fuelType: '' })}>
            Any
          </FilterPill>
          {fuelTypes.map(ft => (
            <FilterPill
              key={ft}
              active={filters.fuelType === ft}
              onClick={() => onFiltersChange({ fuelType: ft })}
            >
              {ft}
            </FilterPill>
          ))}
        </div>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Transmission</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill active={!filters.transmission} onClick={() => onFiltersChange({ transmission: '' })}>
            Any
          </FilterPill>
          {transmissions.map(tr => (
            <FilterPill
              key={tr}
              active={filters.transmission === tr}
              onClick={() => onFiltersChange({ transmission: tr })}
            >
              {tr}
            </FilterPill>
          ))}
        </div>
      </div>
    </div>
  )
}

function ActiveFilterBadges({
  filters,
  onFiltersChange,
  availableCars,
}: {
  filters: SearchFilters
  onFiltersChange: (f: Partial<SearchFilters>) => void
  availableCars: Car[]
}) {
  const priceRange = getPriceRange(availableCars)
  const yearRange = getYearRange(availableCars)
  const badges: { label: string; onRemove: () => void }[] = []

  if (filters.category) {
    const cat = categories.find(c => c.id === filters.category)
    badges.push({ label: cat?.name ?? filters.category, onRemove: () => onFiltersChange({ category: null }) })
  }
  if (filters.query) {
    badges.push({ label: `"${filters.query}"`, onRemove: () => onFiltersChange({ query: '' }) })
  }
  if (filters.fuelType) {
    badges.push({ label: filters.fuelType, onRemove: () => onFiltersChange({ fuelType: '' }) })
  }
  if (filters.transmission) {
    badges.push({ label: filters.transmission, onRemove: () => onFiltersChange({ transmission: '' }) })
  }
  if ((filters.minPrice ?? priceRange.min) > priceRange.min) {
    badges.push({ label: `From ${formatPrice(filters.minPrice!)}`, onRemove: () => onFiltersChange({ minPrice: priceRange.min }) })
  }
  if ((filters.maxPrice ?? priceRange.max) < priceRange.max) {
    badges.push({ label: `Up to ${formatPrice(filters.maxPrice!)}`, onRemove: () => onFiltersChange({ maxPrice: priceRange.max }) })
  }
  if ((filters.minYear ?? yearRange.min) > yearRange.min) {
    badges.push({ label: `From ${filters.minYear}`, onRemove: () => onFiltersChange({ minYear: yearRange.min }) })
  }
  if ((filters.maxYear ?? yearRange.max) < yearRange.max) {
    badges.push({ label: `Until ${filters.maxYear}`, onRemove: () => onFiltersChange({ maxYear: yearRange.max }) })
  }

  if (badges.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {badges.map((b, i) => (
        <Badge
          key={i}
          variant="secondary"
          className="cursor-pointer bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-full px-3 gap-1.5 text-xs"
          onClick={b.onRemove}
        >
          {b.label}
          <X className="w-3 h-3" />
        </Badge>
      ))}
    </div>
  )
}

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  category: null,
  fuelType: '',
  transmission: '',
  sortBy: 'year-desc',
}

function InventoryContent({ initialCars }: { initialCars: Car[] }) {
  const searchParams = useSearchParams()
  const [inventoryCars, setInventoryCars] = useState(initialCars)
  const categoryParam = searchParams.get('category') as CarCategory | null
  const queryParam = searchParams.get('q') ?? ''

  const [filters, setFilters] = useState<SearchFilters>({
    ...DEFAULT_FILTERS,
    category: categoryParam,
    query: queryParam,
  })
  const [selectedCar, setSelectedCar] = useState<Car | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/cars', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Car catalog request failed with status ${response.status}`)
        return response.json() as Promise<Car[]>
      })
      .then((updatedCars) => {
        if (active) setInventoryCars(updatedCars)
      })
      .catch((error: unknown) => console.error('Unable to refresh the vehicle inventory:', error))
    return () => { active = false }
  }, [])

  const priceRange = useMemo(() => getPriceRange(inventoryCars), [inventoryCars])
  const yearRange = useMemo(() => getYearRange(inventoryCars), [inventoryCars])

  const updateFilters = useCallback((patch: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...patch }))
    setSelectedCar(null)
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    setSelectedCar(null)
  }, [])

  const filteredCars = useMemo(() => searchCars(filters, inventoryCars), [filters, inventoryCars])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.category) count++
    if (filters.query) count++
    if (filters.fuelType) count++
    if (filters.transmission) count++
    if ((filters.minPrice ?? priceRange.min) > priceRange.min) count++
    if ((filters.maxPrice ?? priceRange.max) < priceRange.max) count++
    if ((filters.minYear ?? yearRange.min) > yearRange.min) count++
    if ((filters.maxYear ?? yearRange.max) < yearRange.max) count++
    return count
  }, [filters, priceRange, yearRange])

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Hero with search bar */}
      <section className="pt-24 pb-10 relative overflow-hidden sm:pt-28 sm:pb-12">
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
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="container mx-auto px-3 sm:px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-red mb-5 sm:mb-6">
              <CarIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground/80">Premium Collection</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4 sm:text-5xl lg:text-6xl sm:mb-6">
              Our <span className="text-gradient">Inventory</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-6 sm:mb-8">
              Browse our complete collection of premium vehicles. Find your perfect match today.
            </p>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
              <Input
                placeholder="Search by name, brand, color, feature..."
                value={filters.query ?? ''}
                onChange={e => updateFilters({ query: e.target.value })}
                className="pl-14 pr-14 bg-secondary/60 border-border/50 rounded-full h-14 text-base backdrop-blur-sm focus:border-primary/50"
              />
              {filters.query && (
                <button
                  onClick={() => updateFilters({ query: '' })}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <section className="py-3 border-y border-border/30 glass sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile filter trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-border/50 gap-2 rounded-full h-9 px-4 relative">
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 glass overflow-y-auto">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={updateFilters}
                    onReset={resetFilters}
                    activeFilterCount={activeFilterCount}
                    availableCars={inventoryCars}
                  />
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-bold">{filteredCars.length}</span>{' '}
                {filteredCars.length === 1 ? 'vehicle' : 'vehicles'} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="hidden sm:flex text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full gap-1 h-9"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-border/50 gap-2 rounded-full h-9 px-4 text-sm">
                    {SORT_LABELS[filters.sortBy ?? 'year-desc']}
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass border-border/50">
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <DropdownMenuItem
                      key={value}
                      onClick={() => updateFilters({ sortBy: value as SearchFilters['sortBy'] })}
                      className={filters.sortBy === value ? 'text-primary font-medium' : ''}
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <ActiveFilterBadges filters={filters} onFiltersChange={updateFilters} availableCars={inventoryCars} />
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="glass rounded-2xl p-5 sticky top-36">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-foreground flex items-center gap-2 text-sm">
                    <Filter className="w-4 h-4 text-primary" />
                    Filters
                  </h2>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2">
                      {activeFilterCount} active
                    </Badge>
                  )}
                </div>
                <FilterPanel
                  filters={filters}
                  onFiltersChange={updateFilters}
                  onReset={resetFilters}
                  activeFilterCount={activeFilterCount}
                  availableCars={inventoryCars}
                />
              </div>
            </aside>

            {/* Car grid */}
            <div className="flex-1 min-w-0">
              {filteredCars.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
                    {filteredCars.map((car, index) => (
                      <div
                        key={car.id}
                        onClick={() => setSelectedCar(selectedCar?.id === car.id ? null : car)}
                        className="cursor-pointer"
                      >
                        <CarCard car={car} index={index} />
                      </div>
                    ))}
                  </div>

                  {selectedCar && (
                    <div className="mt-12 glass rounded-2xl p-8 max-w-2xl mx-auto scroll-mt-24" id="inquiry">
                      <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                        Interested in the <span className="text-primary">{selectedCar.name}</span>?
                      </h2>
                      <p className="text-muted-foreground text-center mb-8">
                        Fill out the form and we'll reach out via WhatsApp or Email.
                      </p>
                      <InquiryForm car={selectedCar} />
                      <div className="text-center mt-6">
                        <Button
                          onClick={() => setSelectedCar(null)}
                          variant="outline"
                          className="rounded-full"
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24">
                  <div className="w-24 h-24 mx-auto mb-8 rounded-2xl glass-red flex items-center justify-center">
                    <Search className="w-12 h-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No vehicles found</h3>
                  <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button onClick={resetFilters} className="bg-primary hover:bg-primary/90 rounded-full px-8">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

export function InventoryPageClient({ initialCars }: { initialCars: Car[] }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading inventory...</p>
      </div>
    }>
      <InventoryContent initialCars={initialCars} />
    </Suspense>
  )
}
