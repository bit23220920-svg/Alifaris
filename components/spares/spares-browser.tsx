'use client'

import { useMemo, useState } from 'react'
import { CarFront, Search } from 'lucide-react'
import { spareCategories, searchSpares, type Spare, type SpareCompatibility, type SpareCategory } from '@/lib/spares-data'
import { SpareCard } from '@/components/spares/spare-card'

export function SparesBrowser({ allSpares }: { allSpares: Spare[] }) {
  const hasPendingDetails = allSpares.some((spare) => spare.isSample)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<SpareCategory | ''>('')
  const [condition, setCondition] = useState<'new' | 'used' | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name' | ''>('')
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [selectedFitment, setSelectedFitment] = useState<SpareCompatibility | null>(null)

  const uniqueFitments = useMemo(() => Array.from(
    new Map(allSpares.filter((spare) => !spare.isSample).flatMap((spare) => spare.compatibility).map((fit) => [`${fit.make}|${fit.model}`, fit])).values(),
  ), [allSpares])
  const makes = useMemo(() => Array.from(new Set(uniqueFitments.map((fit) => fit.make))).sort(), [uniqueFitments])
  const getModelFitments = (selectedMake: string) => uniqueFitments.filter((fit) => fit.make === selectedMake)

  const results = useMemo(() => {
    const filtered = searchSpares({
      query,
      category,
      condition,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sortBy || undefined,
    }, allSpares)
    if (!selectedFitment || !year) return filtered
    const selectedYear = Number(year)
    return filtered.filter((spare) => spare.compatibility.some((fit) =>
      fit.make === selectedFitment.make
      && fit.model === selectedFitment.model
      && selectedYear >= fit.yearFrom
      && selectedYear <= fit.yearTo,
    ))
  }, [query, category, condition, minPrice, maxPrice, sortBy, selectedFitment, year, allSpares])

  function handleMakeChange(value: string) {
    setMake(value)
    setModel('')
    setYear('')
    setSelectedFitment(null)
  }

  function handleModelChange(value: string) {
    setModel(value)
    setYear('')
    setSelectedFitment(getModelFitments(make).find((fit) => fit.model === value) ?? null)
  }

  const modelOptions = getModelFitments(make)
  const yearOptions = selectedFitment
    ? Array.from({ length: selectedFitment.yearTo - selectedFitment.yearFrom + 1 }, (_, index) => selectedFitment.yearFrom + index)
    : []

  return (
    <>
      <section className="container mx-auto px-4 pb-10">
        <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-card p-5 sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-xl bg-orange-500/15 p-3 text-orange-400"><CarFront aria-hidden="true" /></div>
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">Shop by my car</h2>
              <p className="text-sm text-muted-foreground">Choose your vehicle to see compatible parts.</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="space-y-1.5 text-sm font-medium">
              Make
              <select value={make} onChange={(event) => handleMakeChange(event.target.value)} className="h-12 w-full rounded-lg border border-border bg-background px-3" aria-label="Choose car make">
                <option value="">Select make</option>
                {makes.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Model
              <select value={model} onChange={(event) => handleModelChange(event.target.value)} disabled={!make} className="h-12 w-full rounded-lg border border-border bg-background px-3 disabled:opacity-50" aria-label="Choose car model">
                <option value="">Select model</option>
                {modelOptions.map((option) => <option key={option.model} value={option.model}>{option.model}</option>)}
              </select>
            </label>
            <label className="space-y-1.5 text-sm font-medium">
              Year
              <select value={year} onChange={(event) => setYear(event.target.value)} disabled={!model} className="h-12 w-full rounded-lg border border-border bg-background px-3 disabled:opacity-50" aria-label="Choose car year">
                <option value="">Select year</option>
                {yearOptions.map((option) => <option key={option} value={option}>{option}</option>)}
              </select>
            </label>
          </div>
          {year && <p className="mt-3 text-sm text-orange-300" role="status">Showing parts that match {year} {make} {model}.</p>}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Shop by category</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {spareCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(category === item ? '' : item)}
                aria-pressed={category === item}
                className={`min-h-12 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${category === item ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-border bg-card/60 hover:border-orange-500/50'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 border-b border-border/60 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">All parts</h2>
            {hasPendingDetails && <p className="mt-1 text-sm text-muted-foreground">Some part details, prices, and vehicle fitments are still being confirmed. Contact us before ordering.</p>}
          </div>
          <p className="text-sm text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? 'part' : 'parts'}</p>
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <label className="relative sm:col-span-2 lg:col-span-2">
            <span className="sr-only">Search parts</span>
            <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parts..." className="h-12 w-full rounded-lg border border-border bg-card pl-10 pr-3" />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Condition
            <select value={condition} onChange={(event) => setCondition(event.target.value as 'new' | 'used' | '')} className="h-12 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground">
              <option value="">Any condition</option><option value="new">New</option><option value="used">Used</option>
            </select>
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Category
            <select value={category} onChange={(event) => setCategory(event.target.value as SpareCategory | '')} className="h-12 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground">
              <option value="">All categories</option>{spareCategories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Min price
            <input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} className="h-12 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground" />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground">
            Max price
            <input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="h-12 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground" />
          </label>
          <label className="space-y-1 text-xs text-muted-foreground sm:col-span-2 lg:col-span-1">
            Sort
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="h-12 w-full rounded-lg border border-border bg-card px-3 text-sm text-foreground">
              <option value="">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option>
            </select>
          </label>
        </div>

        {results.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {results.map((spare) => <SpareCard key={spare.id} spare={spare} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No parts match those filters. Try another vehicle or clear a filter.
          </div>
        )}
      </section>
    </>
  )
}
