import { CheckoutPageClient } from '@/components/spares/checkout-page-client'
import { listSpares } from '@/lib/catalog-repository'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
  const spares = await listSpares()
  return <CheckoutPageClient allSpares={spares} />
}
