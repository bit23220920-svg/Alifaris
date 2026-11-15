import { randomUUID } from 'node:crypto'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getTursoClient, isTursoConfigured } from '@/lib/turso'

interface CarOrderRequest {
  carId?: unknown
  customerName?: unknown
  phone?: unknown
  email?: unknown
  fulfilment?: unknown
}

export async function POST(request: Request) {
  if (!isTursoConfigured()) {
    return NextResponse.json({ error: 'Order storage is not configured; please submit the WhatsApp request.' }, { status: 503 })
  }

  let body: CarOrderRequest
  try {
    body = await request.json() as CarOrderRequest
  } catch {
    return NextResponse.json({ error: 'Order details must be valid JSON.' }, { status: 400 })
  }

  if (
    typeof body.carId !== 'string' || body.carId.trim().length < 1 || body.carId.length > 120
    || typeof body.customerName !== 'string' || body.customerName.trim().length < 2 || body.customerName.trim().length > 120
    || typeof body.phone !== 'string' || body.phone.trim().length < 5 || body.phone.trim().length > 40
    || typeof body.email !== 'string' || body.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)
    || (body.fulfilment !== 'Delivery' && body.fulfilment !== 'Pickup')
  ) {
    return NextResponse.json({ error: 'Please check the vehicle, customer, and fulfilment details.' }, { status: 400 })
  }

  const db = getTursoClient()
  const transaction = await db.transaction('write')
  const orderId = randomUUID()

  try {
    const carResult = await transaction.execute({
      sql: 'SELECT id, name, brand, year, price FROM cars WHERE id = ?',
      args: [body.carId],
    })
    const car = carResult.rows[0]
    if (!car) {
      await transaction.rollback()
      return NextResponse.json({ error: 'This vehicle is no longer available. Refresh the page and try again.' }, { status: 409 })
    }

    const price = Number(car.price)
    if (!Number.isFinite(price) || price < 0) {
      await transaction.rollback()
      return NextResponse.json({ error: 'The vehicle price is invalid. Please contact ALIFARIS Auto.' }, { status: 409 })
    }

    await transaction.execute({
      sql: 'INSERT INTO orders (id, customer_name, phone, email, fulfilment, status, total) VALUES (?, ?, ?, ?, ?, ?, ?)',
      args: [orderId, body.customerName.trim(), body.phone.trim(), body.email.trim(), body.fulfilment, 'requested', price],
    })
    await transaction.execute({
      sql: 'INSERT INTO car_order_items (order_id, car_id, car_name, brand, model_year, quantity, unit_price) VALUES (?, ?, ?, ?, ?, 1, ?)',
      args: [orderId, String(car.id), String(car.name), String(car.brand), Number(car.year), price],
    })
    await transaction.commit()
    revalidatePath('/admin')
    revalidatePath('/inventory')
    revalidatePath(`/car/${body.carId}`)

    return NextResponse.json({
      id: orderId,
      total: price,
      carName: `${String(car.year)} ${String(car.brand)} ${String(car.name)}`,
    }, { status: 201 })
  } catch (error) {
    await transaction.rollback()
    console.error('Unable to place car order request:', error)
    return NextResponse.json({ error: 'The order request could not be saved. Please try again or contact ALIFARIS Auto.' }, { status: 500 })
  } finally {
    transaction.close()
  }
}
