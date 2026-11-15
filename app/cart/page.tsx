import { CartPageClient } from '@/components/spares/cart-page-client'
import { listSpares } from '@/lib/catalog-repository'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const spares = await listSpares()
  return <CartPageClient allSpares={spares} />
}
