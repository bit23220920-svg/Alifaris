import { notFound } from 'next/navigation'
import { CarCheckoutPageClient } from '@/components/car-checkout-page-client'
import { getCar } from '@/lib/catalog-repository'

export const dynamic = 'force-dynamic'

interface CarCheckoutPageProps {
  params: Promise<{ id: string }>
}

export default async function CarCheckoutPage({ params }: CarCheckoutPageProps) {
  const { id } = await params
  const car = await getCar(id)
  if (!car) notFound()
  return <CarCheckoutPageClient car={car} />
}
