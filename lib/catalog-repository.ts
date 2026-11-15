import { cars as sampleCars, type Car } from '@/lib/cars-data'
import { spares as sampleSpares, type Spare, type SpareCompatibility } from '@/lib/spares-data'
import { getTursoClient, isTursoConfigured } from '@/lib/turso'

type Row = Record<string, string | number | bigint | null | Uint8Array>

export type OrderStatus = 'requested' | 'confirmed' | 'fulfilled' | 'cancelled'

export interface AdminOrder {
  id: string
  customerName: string
  phone: string
  email: string
  fulfilment: string
  status: OrderStatus
  total: number
  createdAt: string
  items: { type: 'car' | 'spare'; name: string; partNumber?: string; quantity: number; unitPrice: number }[]
}

function text(value: Row[string], fallback = ''): string {
  return value == null ? fallback : String(value)
}

function number(value: Row[string], fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function stringArray(value: Row[string]): string[] {
  if (typeof value !== 'string') return []
  const parsed: unknown = JSON.parse(value)
  return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : []
}

function compatibilityFromRows(rows: Row[]): SpareCompatibility[] {
  return rows.map((row) => ({
    make: text(row.make),
    model: text(row.model),
    yearFrom: number(row.year_from),
    yearTo: number(row.year_to),
  }))
}

export async function listCars(): Promise<Car[]> {
  if (!isTursoConfigured()) return sampleCars
  const result = await getTursoClient().execute('SELECT * FROM cars ORDER BY year DESC, name')
  return result.rows.map((row) => {
    const data = row as Row
    return {
      id: text(data.id),
      name: text(data.name),
      brand: text(data.brand),
      category: text(data.category) as Car['category'],
      price: number(data.price),
      year: number(data.year),
      mileage: number(data.mileage),
      fuelType: text(data.fuel_type),
      transmission: text(data.transmission),
      engine: text(data.engine),
      horsepower: number(data.horsepower),
      color: text(data.color),
      features: stringArray(data.features_json),
      description: text(data.description),
      image: text(data.image),
      images: stringArray(data.images_json),
    }
  })
}

export async function getCar(id: string): Promise<Car | undefined> {
  if (!isTursoConfigured()) return sampleCars.find((car) => car.id === id)
  const result = await getTursoClient().execute({ sql: 'SELECT * FROM cars WHERE id = ?', args: [id] })
  const row = result.rows[0] as Row | undefined
  if (!row) return undefined
  const [car] = await Promise.all([
    Promise.resolve({
      id: text(row.id),
      name: text(row.name),
      brand: text(row.brand),
      category: text(row.category) as Car['category'],
      price: number(row.price),
      year: number(row.year),
      mileage: number(row.mileage),
      fuelType: text(row.fuel_type),
      transmission: text(row.transmission),
      engine: text(row.engine),
      horsepower: number(row.horsepower),
      color: text(row.color),
      features: stringArray(row.features_json),
      description: text(row.description),
      image: text(row.image),
      images: stringArray(row.images_json),
    }),
  ])
  return car
}

export async function listSpares(): Promise<Spare[]> {
  if (!isTursoConfigured()) return sampleSpares
  const db = getTursoClient()
  const result = await db.execute('SELECT * FROM spares ORDER BY name')
  const compatibility = await db.execute('SELECT spare_id, make, model, year_from, year_to FROM spare_compatibility ORDER BY make, model')
  const rowsBySpare = new Map<string, Row[]>()
  compatibility.rows.forEach((resultRow) => {
    const row = resultRow as Row
    const id = text(row.spare_id)
    rowsBySpare.set(id, [...(rowsBySpare.get(id) ?? []), row])
  })
  return result.rows.map((resultRow) => {
    const row = resultRow as Row
    return {
      id: text(row.id),
      name: text(row.name),
      partNumber: text(row.part_number),
      category: text(row.category) as Spare['category'],
      condition: text(row.condition) as Spare['condition'],
      grade: row.grade == null ? undefined : text(row.grade),
      price: number(row.price),
      stock: number(row.stock),
      description: text(row.description),
      image: text(row.image),
      images: stringArray(row.images_json),
      compatibility: compatibilityFromRows(rowsBySpare.get(text(row.id)) ?? []),
      isSample: number(row.is_sample) === 1,
    }
  })
}

export async function getSpare(id: string): Promise<Spare | undefined> {
  if (!isTursoConfigured()) return sampleSpares.find((spare) => spare.id === id)
  const db = getTursoClient()
  const [spareResult, fitmentResult] = await Promise.all([
    db.execute({ sql: 'SELECT * FROM spares WHERE id = ?', args: [id] }),
    db.execute({ sql: 'SELECT make, model, year_from, year_to FROM spare_compatibility WHERE spare_id = ? ORDER BY make, model', args: [id] }),
  ])
  const row = spareResult.rows[0] as Row | undefined
  if (!row) return undefined
  return {
    id: text(row.id),
    name: text(row.name),
    partNumber: text(row.part_number),
    category: text(row.category) as Spare['category'],
    condition: text(row.condition) as Spare['condition'],
    grade: row.grade == null ? undefined : text(row.grade),
    price: number(row.price),
    stock: number(row.stock),
    description: text(row.description),
    image: text(row.image),
    images: stringArray(row.images_json),
    compatibility: compatibilityFromRows(fitmentResult.rows as Row[]),
    isSample: number(row.is_sample) === 1,
  }
}

export async function listCategories(): Promise<{ id: string; name: string; description: string }[]> {
  if (!isTursoConfigured()) {
    const { categories } = await import('@/lib/cars-data')
    return categories
  }
  const result = await getTursoClient().execute('SELECT id, name, description FROM car_categories ORDER BY name')
  return result.rows.map((row) => {
    const data = row as Row
    return { id: text(data.id), name: text(data.name), description: text(data.description) }
  })
}

export async function listOrders(): Promise<AdminOrder[]> {
  if (!isTursoConfigured()) return []
  const db = getTursoClient()
  const [ordersResult, itemsResult, carItemsResult] = await Promise.all([
    db.execute('SELECT id, customer_name, phone, email, fulfilment, status, total, created_at FROM orders ORDER BY created_at DESC'),
    db.execute('SELECT order_id, spare_name, part_number, quantity, unit_price FROM order_items ORDER BY id'),
    db.execute('SELECT order_id, car_name, brand, model_year, quantity, unit_price FROM car_order_items ORDER BY id'),
  ])
  const itemsByOrder = new Map<string, AdminOrder['items']>()
  itemsResult.rows.forEach((resultRow) => {
    const row = resultRow as Row
    const orderId = text(row.order_id)
    itemsByOrder.set(orderId, [...(itemsByOrder.get(orderId) ?? []), {
      type: 'spare',
      name: text(row.spare_name),
      partNumber: text(row.part_number),
      quantity: number(row.quantity),
      unitPrice: number(row.unit_price),
    }])
  })
  carItemsResult.rows.forEach((resultRow) => {
    const row = resultRow as Row
    const orderId = text(row.order_id)
    itemsByOrder.set(orderId, [...(itemsByOrder.get(orderId) ?? []), {
      type: 'car',
      name: `${text(row.model_year)} ${text(row.brand)} ${text(row.car_name)}`,
      quantity: number(row.quantity),
      unitPrice: number(row.unit_price),
    }])
  })
  return ordersResult.rows.map((resultRow) => {
    const row = resultRow as Row
    const id = text(row.id)
    return {
      id,
      customerName: text(row.customer_name),
      phone: text(row.phone),
      email: text(row.email),
      fulfilment: text(row.fulfilment),
      status: text(row.status) as OrderStatus,
      total: number(row.total),
      createdAt: text(row.created_at),
      items: itemsByOrder.get(id) ?? [],
    }
  })
}
