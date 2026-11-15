import { InventoryPageClient } from '@/components/inventory-page-client'
import { listCars } from '@/lib/catalog-repository'

export const dynamic = 'force-dynamic'

export default async function InventoryPage() {
  const cars = await listCars()
  return <InventoryPageClient initialCars={cars} />
}
