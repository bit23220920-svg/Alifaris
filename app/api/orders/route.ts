import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getTursoClient, isTursoConfigured } from '@/lib/turso'

interface OrderRequest {
  customerName?: unknown
  phone?: unknown
  email?: unknown
  fulfilment?: unknown
  items?: unknown
}

interface RequestedItem {
  spareId: string
  quantity: number
}

function isRequestedItems(value: unknown): value is RequestedItem[] {
  return Array.isArray(value) && value.length > 0 && value.length <= 50 && value.every((item) =>
    item !== null
    && typeof item === 'object'
    && 'spareId' in item && typeof item.spareId === 'string'
    && 'quantity' in item && typeof item.quantity === 'number'
    && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 100,
  )
}

export async function POST(request: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: 'Order storage is not configured; please submit the WhatsApp request.' }, { status: 503 })
  }

  let body: OrderRequest
  try {
    body = await request.json() as OrderRequest
  } catch {
    return NextResponse.json({ error: 'Order details must be valid JSON.' }, { status: 400 })
  }

  if (
    typeof body.customerName !== 'string' || body.customerName.trim().length < 2 || body.customerName.trim().length > 120
    || typeof body.phone !== 'string' || body.phone.trim().length < 5 || body.phone.trim().length > 40
    || typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    || (body.fulfilment !== 'Delivery' && body.fulfilment !== 'Pickup')
    || !isRequestedItems(body.items)
  ) {
    return NextResponse.json({ error: 'Please check the customer, fulfilment, and cart details.' }, { status: 400 })
  }

  const combinedItems = Array.from(body.items.reduce((map, item) => {
    map.set(item.spareId, (map.get(item.spareId) ?? 0) + item.quantity)
    return map
  }, new Map<string, number>()), ([spareId, quantity]) => ({ spareId, quantity }))
  const db = getTursoClient()
  const transaction = await db.transaction('write')
  const orderId = randomUUID()

  try {
    const orderItems: { id: string; name: string; partNumber: string; quantity: number; price: number }[] = []
    let total = 0

    for (const item of combinedItems) {
      const spareResult = await transaction.execute({
        sql: 'SELECT id, name, part_number, price, stock, condition, is_sample FROM spares WHERE id = ?',
        args: [item.spareId],
      })
      const spare = spareResult.rows[0]
      if (!spare) {
        await transaction.rollback()
        return NextResponse.json({ error: 'A cart item is no longer available. Refresh your cart and try again.' }, { status: 409 })
      }
      if (Number(spare.is_sample) === 1) {
        await transaction.rollback()
        return NextResponse.json({ error: `Details for ${String(spare.name)} are still being confirmed, so it cannot be ordered yet.` }, { status: 409 })
      }
      const availableStock = Number(spare.stock)
      const price = Number(spare.price)
      if (item.quantity > availableStock || (spare.condition === 'used' && item.quantity > 1)) {
        await transaction.rollback()
        return NextResponse.json({ error: `${String(spare.name)} does not have enough stock for the requested quantity.` }, { status: 409 })
      }
      const updateResult = await transaction.execute({
        sql: 'UPDATE spares SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND stock >= ?',
        args: [item.quantity, item.spareId, item.quantity],
      })
      if (Number(updateResult.rowsAffected) !== 1) {
        await transaction.rollback()
        return NextResponse.json({ error: `${String(spare.name)} stock changed. Refresh your cart and try again.` }, { status: 409 })
      }
      orderItems.push({
        id: item.spareId,
        name: String(spare.name),
        partNumber: String(spare.part_number),
        quantity: item.quantity,
        price,
      })
      total += price * item.quantity
    }

    await transaction.execute({
      sql: 'INSERT INTO orders (id, customer_name, phone, email, fulfilment, status, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [orderId, body.customerName.trim(), body.phone.trim(), body.email.trim(), body.fulfilment, 'requested', total],
    })
    for (const item of orderItems) {
      await transaction.execute({
        sql: 'INSERT INTO order_items (order_id, spare_id, spare_name, part_number, quantity, unit_price) VALUES (?, ?, ?, ?, ?, ?)',
        args: [orderId, item.id, item.name, item.partNumber, item.quantity, item.price],
      })
    }
    await transaction.commit()
    revalidatePath('/admin')
    revalidatePath('/spares')
    revalidatePath('/spares/[id]', 'page')
    return NextResponse.json({
      id: orderId,
      total,
      items: orderItems.map(({ name, partNumber, quantity, price }) => ({ name, partNumber, quantity, price })),
    }, { status: 201 })
  } catch (error) {
    await transaction.rollback()
    console.error('Unable to place customer order:', error)
    return NextResponse.json({ error: 'The order could not be saved. Please try again or contact ALIFARIS Auto.' }, { status: 500 })
  } finally {
    transaction.close()
  }
}
