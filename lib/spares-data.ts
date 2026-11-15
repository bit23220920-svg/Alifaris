import { formatPrice } from '@/lib/cars-data'

export { formatPrice }

export const spareCategories = [
  'Engine',
  'Brakes',
  'Suspension',
  'Body parts',
  'Electrical',
  'Tyres & wheels',
  'Filters & fluids',
] as const

export type SpareCategory = (typeof spareCategories)[number]

export interface SpareCompatibility {
  make: string
  model: string
  yearFrom: number
  yearTo: number
}

export interface Spare {
  id: string
  name: string
  partNumber: string
  category: SpareCategory
  condition: 'new' | 'used'
  grade?: string
  price: number
  stock: number
  description: string
  image: string
  images: string[]
  compatibility: SpareCompatibility[]
  isSample?: boolean
}

export const spares: Spare[] = [
  {
    id: 'sample-engine-filter',
    name: 'Engine air filter',
    partNumber: 'PENDING-001',
    category: 'Filters & fluids',
    condition: 'new',
    price: 0,
    stock: 0,
    description: 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/engineairfilter.jpeg',
    images: ['/assets/engineairfilter.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-brake-pads',
    name: 'Front brake pad set',
    partNumber: 'PENDING-002',
    category: 'Brakes',
    condition: 'new',
    price: 0,
    stock: 0,
    description: 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/frontbreakpads.jpeg',
    images: ['/assets/frontbreakpads.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-shock-absorber',
    name: 'Rear shock absorber',
    partNumber: 'PENDING-003',
    category: 'Suspension',
    condition: 'used',
    price: 0,
    stock: 0,
    description: 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/shockabosorber.jpeg',
    images: ['/assets/shockabosorber.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-side-mirror',
    name: 'Side mirror assembly',
    partNumber: 'PENDING-004',
    category: 'Body parts',
    condition: 'used',
    price: 0,
    stock: 0,
    description: 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/sidemirror.jpeg',
    images: ['/assets/sidemirror.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-alternator',
    name: 'Alternator',
    partNumber: 'PENDING-005',
    category: 'Electrical',
    condition: 'new',
    price: 0,
    stock: 0,
    description: 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/Alternator.jpeg',
    images: ['/assets/Alternator.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-wheel',
    name: 'Alloy wheel',
    partNumber: 'PENDING-006',
    category: 'Tyres & wheels',
    condition: 'used',
    price: 0,
    stock: 0,
    description: 'Product details, condition, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/alloywheel.jpg',
    images: ['/assets/alloywheel.jpg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-oil-filter',
    name: 'Oil filter',
    partNumber: 'PENDING-007',
    category: 'Filters & fluids',
    condition: 'new',
    price: 0,
    stock: 0,
    description: 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/oilfilter.jpeg',
    images: ['/assets/oilfilter.jpeg'],
    compatibility: [],
    isSample: true,
  },
  {
    id: 'sample-headlamp',
    name: 'Headlamp assembly',
    partNumber: 'PENDING-008',
    category: 'Electrical',
    condition: 'new',
    price: 0,
    stock: 0,
    description: 'Product details, price, availability, and vehicle fitment are being confirmed.',
    image: '/assets/headlamp.jpeg',
    images: ['/assets/headlamp.jpeg'],
    compatibility: [],
    isSample: true,
  },
]

export interface SpareSearchFilters {
  query?: string
  category?: SpareCategory | ''
  condition?: Spare['condition'] | ''
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price-asc' | 'price-desc' | 'name'
}

export function getSpareById(id: string): Spare | undefined {
  return spares.find((spare) => spare.id === id)
}

export function searchSpares(filters: SpareSearchFilters = {}, sourceSpares: Spare[] = spares): Spare[] {
  let result = [...sourceSpares]
  if (filters.query) {
    const query = filters.query.trim().toLowerCase()
    result = result.filter((spare) =>
      [spare.name, spare.partNumber, spare.category, spare.description]
        .some((value) => value.toLowerCase().includes(query)),
    )
  }
  if (filters.category) result = result.filter((spare) => spare.category === filters.category)
  if (filters.condition) result = result.filter((spare) => spare.isSample || spare.condition === filters.condition)
  if (filters.minPrice !== undefined) result = result.filter((spare) => spare.isSample || spare.price >= filters.minPrice!)
  if (filters.maxPrice !== undefined) result = result.filter((spare) => spare.isSample || spare.price <= filters.maxPrice!)

  switch (filters.sortBy) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
  }
  return result
}

export function getCompatibleSpares(make: string, model: string, year: number): Spare[] {
  return spares.filter((spare) =>
    spare.compatibility.some((fit) =>
      fit.make.toLowerCase() === make.toLowerCase()
      && fit.model.toLowerCase() === model.toLowerCase()
      && year >= fit.yearFrom
      && year <= fit.yearTo,
    ),
  )
}
