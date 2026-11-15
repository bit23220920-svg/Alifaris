import { NextResponse } from 'next/server'
import { listCars } from '@/lib/catalog-repository'

export async function GET() {
  try {
    return NextResponse.json(await listCars(), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    console.error('Unable to load public car catalog:', error)
    return NextResponse.json({ error: 'Car catalog is temporarily unavailable.' }, { status: 503 })
  }
}
