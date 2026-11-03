export type CarCategory = 'suv' | 'coupe' | 'truck' | 'electric' | 'sedan' | 'luxury'

export interface Car {
  id: string
  name: string
  brand: string
  category: CarCategory
  price: number
  year: number
  mileage: number
  fuelType: string
  transmission: string
  engine: string
  horsepower: number
  color: string
  features: string[]
  description: string
  image: string
  images: string[]
}

export const categories: { id: CarCategory; name: string; description: string }[] = [
  { id: 'suv', name: 'SUV', description: 'Powerful and spacious' },
  { id: 'coupe', name: 'Coupe', description: 'Sporty and sleek' },
  { id: 'truck', name: 'Truck', description: 'Built for adventure' },
  { id: 'electric', name: 'Electric', description: 'Future of driving' },
  { id: 'sedan', name: 'Sedan', description: 'Classic elegance' },
  { id: 'luxury', name: 'Luxury', description: 'Premium experience' },
]

export const cars: Car[] = [
  // SUVs
  {
    id: 'suv-001',
    name: 'Range Rover Sport SVR',
    brand: 'Land Rover',
    category: 'suv',
    price: 125000,
    year: 2024,
    mileage: 5200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '5.0L V8 Supercharged',
    horsepower: 575,
    color: 'Fuji White',
    features: ['Panoramic Roof', 'Air Suspension', 'Meridian Sound', 'Heated Seats', 'Navigation', 'SVR Performance'],
    description: 'Experience unparalleled luxury and performance with the Range Rover Sport SVR. This vehicle combines sophisticated design with advanced technology and raw power.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0164-auWE2yaxGb8qSKprlVDN8J4Tmp9CW7.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0164-auWE2yaxGb8qSKprlVDN8J4Tmp9CW7.jpg'
    ]
  },
  {
    id: 'suv-002',
    name: 'BMW X5 M Sport',
    brand: 'BMW',
    category: 'suv',
    price: 85000,
    year: 2024,
    mileage: 3100,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.4L V8 Twin-Turbo',
    horsepower: 523,
    color: 'Alpine White',
    features: ['M Sport Package', 'Laser Headlights', 'Harman Kardon', 'Gesture Control', 'Adaptive Cruise', 'M Brakes'],
    description: 'The BMW X5 M delivers exhilarating performance with everyday practicality. A true driver\'s SUV with premium features.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0174-eeGeCRlCzoKjVLCbVcquaUUsgelIUh.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0174-eeGeCRlCzoKjVLCbVcquaUUsgelIUh.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0169-IeQK8A8ADCU1q8e5Tc2iL2FGpfKf9I.jpg'
    ]
  },
  {
    id: 'suv-003',
    name: 'Mercedes GLE 53 AMG',
    brand: 'Mercedes-Benz',
    category: 'suv',
    price: 95000,
    year: 2024,
    mileage: 8000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.0L I6 Turbo + EQ Boost',
    horsepower: 429,
    color: 'Obsidian Black',
    features: ['MBUX System', 'Burmester Audio', 'Air Body Control', '360 Camera', 'AMG Performance Exhaust'],
    description: 'The Mercedes GLE AMG combines cutting-edge technology with unmatched comfort and AMG performance.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0166-cXC9TwfIprO7kzMA0hQsyPagMhcSo3.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0166-cXC9TwfIprO7kzMA0hQsyPagMhcSo3.jpg'
    ]
  },
  {
    id: 'suv-004',
    name: 'Porsche Cayenne',
    brand: 'Porsche',
    category: 'suv',
    price: 115000,
    year: 2024,
    mileage: 4500,
    fuelType: 'Petrol',
    transmission: 'PDK',
    engine: '3.0L V6 Twin-Turbo',
    horsepower: 348,
    color: 'Volcano Grey',
    features: ['Sport Chrono', 'PASM', 'Bose Surround', 'Panoramic Roof', 'Matrix LED'],
    description: 'The Porsche Cayenne delivers sports car performance in an SUV package. Pure Porsche DNA.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0172-kR5Yh21QnJpyaO4UoXVsBz2HCCICoO.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0172-kR5Yh21QnJpyaO4UoXVsBz2HCCICoO.jpg'
    ]
  },
  {
    id: 'suv-005',
    name: 'Toyota Land Cruiser 300',
    brand: 'Toyota',
    category: 'suv',
    price: 98000,
    year: 2024,
    mileage: 2500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.5L V6 Twin-Turbo',
    horsepower: 409,
    color: 'Platinum Pearl',
    features: ['Multi-Terrain Select', 'Crawl Control', 'JBL Premium Audio', 'Heated/Cooled Seats', 'Adaptive Suspension'],
    description: 'The legendary Land Cruiser 300 combines legendary off-road capability with modern luxury.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0160-Lz9QlGITJxlKotyq194vsjY3vqE0OB.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0160-Lz9QlGITJxlKotyq194vsjY3vqE0OB.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0161-Szc7GM0V4DDfQfDya0Knr1WeEo8Dde.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0152-uWPGGFrEed7uVAomZuRexFYUEW6zWw.jpg'
    ]
  },
  // Luxury
  {
    id: 'luxury-001',
    name: 'Mercedes G63 AMG',
    brand: 'Mercedes-Benz',
    category: 'luxury',
    price: 185000,
    year: 2024,
    mileage: 1200,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.0L V8 Biturbo',
    horsepower: 577,
    color: 'Polar White',
    features: ['AMG Performance Exhaust', 'Designo Interior', 'Burmester 3D', 'Night Package', 'AMG Carbon Fiber'],
    description: 'The iconic G63 AMG represents the pinnacle of luxury SUVs. Unmistakable presence and raw AMG power.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0162-wwlxk8M12Vra3YuD5AnS5EaAGinc9a.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0162-wwlxk8M12Vra3YuD5AnS5EaAGinc9a.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0158-HYGH9UfzZDokg0Rh3Uhoh4f9p0oNjo.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0159-GrTB0lXb3yh72q4o3rZttHRLSJ5cfv.jpg'
    ]
  },
  // Trucks
  {
    id: 'truck-001',
    name: 'Ford Ranger Wildtrak',
    brand: 'Ford',
    category: 'truck',
    price: 58000,
    year: 2024,
    mileage: 4800,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engine: '3.0L V6 Turbo Diesel',
    horsepower: 250,
    color: 'Agate Black',
    features: ['Terrain Management', 'B&O Sound', 'Pro Trailer Backup', 'SYNC 4', 'Zone Lighting'],
    description: 'The Ford Ranger Wildtrak is built for both work and play. Premium features with rugged capability.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0168-JOi7Cu2YjnydrjsOMxfYy6LFm13cCz.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0168-JOi7Cu2YjnydrjsOMxfYy6LFm13cCz.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0151-xLzqKIHsw34UDtumEQtIISwmXn2O1G.jpg'
    ]
  },
  {
    id: 'truck-002',
    name: 'Nissan Navara PRO-4X',
    brand: 'Nissan',
    category: 'truck',
    price: 52000,
    year: 2024,
    mileage: 7200,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    engine: '2.5L Twin-Turbo Diesel',
    horsepower: 190,
    color: 'Stealth Grey',
    features: ['Intelligent 4x4', 'Off-Road Mode', 'Bose Audio', 'Around View Monitor', 'Steel Bull Bar'],
    description: 'The Nissan Navara PRO-4X is the ultimate off-road pickup with rugged styling and advanced tech.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0155-XHYFdze0UW2ZaFLCvbZEQw4QxVc8zy.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0155-XHYFdze0UW2ZaFLCvbZEQw4QxVc8zy.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0154-2yRa1Vt0AvNQGQVjKzaCeLgO4C6yqs.jpg'
    ]
  },
  {
    id: 'truck-003',
    name: 'Toyota Land Cruiser 79 V8',
    brand: 'Toyota',
    category: 'truck',
    price: 78000,
    year: 2024,
    mileage: 3500,
    fuelType: 'Diesel',
    transmission: 'Manual',
    engine: '4.5L V8 Turbo Diesel',
    horsepower: 202,
    color: 'French Vanilla',
    features: ['Roof Rack System', 'Roof Top Tent', 'Bull Bar', 'Snorkel', 'Off-Road Tires', 'LED Light Bars'],
    description: 'The legendary Land Cruiser 79 - built for the toughest terrains. Full expedition ready with camping setup.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260410-WA0086-6Zm6qb0XORutJijiMXgqHXgB95ISuS.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260410-WA0086-6Zm6qb0XORutJijiMXgqHXgB95ISuS.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0176-Dj8tGnOXmyqKholxY2PLnX2dMNs1l6.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0175-5iN5dB5bNP4KpI7QoaAa2uIgP3XKaN.jpg'
    ]
  },
  // Coupe/Sports
  {
    id: 'coupe-001',
    name: 'BMW X5 xDrive40i',
    brand: 'BMW',
    category: 'coupe',
    price: 78000,
    year: 2024,
    mileage: 5500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.0L I6 Twin-Turbo',
    horsepower: 335,
    color: 'Mineral White',
    features: ['M Sport Package', 'Live Cockpit Pro', 'Panoramic Sky Lounge', 'Driving Assistant Pro', 'Air Suspension'],
    description: 'The BMW X5 xDrive40i offers the perfect blend of sportiness and luxury with coupe-like dynamics.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0169-IeQK8A8ADCU1q8e5Tc2iL2FGpfKf9I.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0169-IeQK8A8ADCU1q8e5Tc2iL2FGpfKf9I.jpg'
    ]
  },
  // Sedan
  {
    id: 'sedan-001',
    name: 'Toyota Land Cruiser ZX',
    brand: 'Toyota',
    category: 'sedan',
    price: 105000,
    year: 2024,
    mileage: 1800,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '3.5L V6 Twin-Turbo',
    horsepower: 409,
    color: 'Platinum Pearl',
    features: ['Premium Interior', 'JBL Sound System', 'Advanced Safety', 'Multi-Terrain Select', 'Executive Seating'],
    description: 'The top-spec Land Cruiser ZX offers executive comfort with legendary Toyota reliability.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0161-Szc7GM0V4DDfQfDya0Knr1WeEo8Dde.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0161-Szc7GM0V4DDfQfDya0Knr1WeEo8Dde.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0152-uWPGGFrEed7uVAomZuRexFYUEW6zWw.jpg'
    ]
  },
  // Electric - using the G-Wagon (placeholder category)
  {
    id: 'electric-001',
    name: 'Mercedes G63 AMG Night',
    brand: 'Mercedes-Benz',
    category: 'electric',
    price: 195000,
    year: 2024,
    mileage: 800,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    engine: '4.0L V8 Biturbo',
    horsepower: 577,
    color: 'Designo Night Black',
    features: ['Full Night Package', 'AMG Carbon Fiber', 'Burmester 3D Surround', 'Designo Leather', 'AMG Track Package'],
    description: 'The ultimate G63 AMG with exclusive Night Package. Blacked out styling with maximum performance.',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg',
    images: [
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0157-7Z1UPo6lcY6Eqebgt79XtFbbUWHqR9.jpg',
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG-20260313-WA0159-GrTB0lXb3yh72q4o3rZttHRLSJ5cfv.jpg'
    ]
  },
]

export function getCarById(id: string): Car | undefined {
  return cars.find(car => car.id === id)
}

export function getCarsByCategory(category: CarCategory): Car[] {
  return cars.filter(car => car.category === category)
}

export function getFeaturedCars(): Car[] {
  return cars.slice(0, 6)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
