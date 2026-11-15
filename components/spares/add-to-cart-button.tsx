'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/spares/cart-provider'
import type { Spare } from '@/lib/spares-data'

export function AddToCartButton({ spare }: { spare: Spare }) {
  const { addItem } = useCart()
  const [message, setMessage] = useState('')
  const disabled = spare.stock < 1 || spare.isSample

  function handleAdd() {
    const added = addItem(spare)
    setMessage(added ? 'Added to cart' : 'This item is already at its purchase limit.')
  }

  return (
    <div>
      <Button
        type="button"
        onClick={handleAdd}
        disabled={disabled}
        className="min-h-12 w-full bg-orange-500 text-black hover:bg-orange-400 disabled:opacity-50"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {spare.isSample ? 'Details pending' : spare.stock < 1 ? 'Out of stock' : 'Add to cart'}
      </Button>
      <p className="mt-2 min-h-5 text-sm text-orange-300" role="status" aria-live="polite">
        {message || (spare.isSample ? 'Please contact us to confirm the part details before ordering.' : spare.condition === 'used' ? 'Used items are limited to one per order.' : '')}
      </p>
    </div>
  )
}
