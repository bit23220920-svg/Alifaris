'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { isAdminSignedIn, signInAdmin, signOutAdmin } from '@/lib/admin-auth'
import type { OrderStatus } from '@/lib/catalog-repository'
import { getTursoClient, isTursoConfigured } from '@/lib/turso'
import { spareCategories, type Spare } from '@/lib/spares-data'

function value(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim()
}

function numberField(formData: FormData, key: string): number {
  const parsed = Number(value(formData, key))
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function lines(input: string): string[] {
  return input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
}

function isValidImageUrl(image: string): boolean {
  if (image.startsWith('/')) return !image.startsWith('//')
  try {
    const url = new URL(image)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

function makeId(prefix: string, title: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 40)
  return `${prefix}-${slug || 'item'}-${randomUUID().slice(0, 8)}`
}

function ensureAdminDatabase(): void {
  if (!isTursoConfigured()) throw new Error('Turso is not configured.')
}

function refreshCatalogPages(): void {
  revalidatePath('/')
  revalidatePath('/inventory')
  revalidatePath('/spares')
  revalidatePath('/admin')
  revalidatePath('/car/[id]', 'page')
  revalidatePath('/spares/[id]', 'page')
}

export async function loginAdminAction(formData: FormData): Promise<void> {
  try {
    const signedIn = await signInAdmin(value(formData, 'email'), value(formData, 'password'))
    if (signedIn) redirect('/admin?notice=signed-in')
    redirect('/admin?error=invalid-login')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Admin login configuration error:', error)
    redirect('/admin?error=login-not-configured')
  }
}

export async function logoutAdminAction(): Promise<void> {
  await signOutAdmin()
  redirect('/admin?notice=signed-out')
}

export async function saveCarAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const id = value(formData, 'id') || makeId('car', value(formData, 'name'))
    const name = value(formData, 'name')
    const brand = value(formData, 'brand')
    const category = value(formData, 'category')
    const price = numberField(formData, 'price')
    const year = numberField(formData, 'year')
    const mileage = numberField(formData, 'mileage')
    const horsepower = numberField(formData, 'horsepower')
    const imageUrls = lines(value(formData, 'images'))
    const image = imageUrls[0] ?? ''
    const features = lines(value(formData, 'features'))
    const allowedCategories = ['suv', 'coupe', 'truck', 'electric', 'sedan', 'luxury']

    if (!name || !brand || !allowedCategories.includes(category) || !Number.isFinite(price) || price < 0
      || !Number.isInteger(year) || !Number.isInteger(mileage) || mileage < 0
      || !Number.isInteger(horsepower) || !image || imageUrls.some((url) => !isValidImageUrl(url))) {
      redirect('/admin?error=car-fields')
    }

    await getTursoClient().execute({
      sql: `INSERT INTO cars (id, name, brand, category, price, year, mileage, fuel_type, transmission, engine, horsepower, color, features_json, description, image, images_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name, brand=excluded.brand, category=excluded.category, price=excluded.price, year=excluded.year, mileage=excluded.mileage, fuel_type=excluded.fuel_type, transmission=excluded.transmission, engine=excluded.engine, horsepower=excluded.horsepower, color=excluded.color, features_json=excluded.features_json, description=excluded.description, image=excluded.image, images_json=excluded.images_json, updated_at=CURRENT_TIMESTAMP`,
      args: [id, name, brand, category, price, year, mileage, value(formData, 'fuelType'), value(formData, 'transmission'), value(formData, 'engine'), horsepower, value(formData, 'color'), JSON.stringify(features), value(formData, 'description'), image, JSON.stringify(imageUrls)],
    })
    refreshCatalogPages()
    redirect('/admin?section=cars&notice=car-saved')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to save car:', error)
    redirect('/admin?section=cars&error=save-failed')
  }
}

function parseCompatibility(input: string): Spare['compatibility'] | null {
  const fitments: Spare['compatibility'] = []
  for (const line of lines(input)) {
    const [make, model, fromValue, toValue] = line.split('|').map((field) => field.trim())
    const yearFrom = Number(fromValue)
    const yearTo = Number(toValue)
    if (!make || !model || !Number.isInteger(yearFrom) || !Number.isInteger(yearTo) || yearFrom > yearTo) return null
    fitments.push({ make, model, yearFrom, yearTo })
  }
  return fitments
}

function containsSampleDetails(name: string, partNumber: string, images: string[], compatibility: Spare['compatibility']): boolean {
  return name.toLowerCase().includes('[sample]')
    || partNumber.toLowerCase().startsWith('sample-')
    || partNumber.toLowerCase().startsWith('pending-')
    || images.some((image) => image.includes('spares-placeholder.svg'))
    || compatibility.some((fitment) => `${fitment.make} ${fitment.model}`.toLowerCase().includes('example'))
}

function parseCsv(input: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false
  for (let index = 0; index < input.length; index += 1) {
    const character = input[index]
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        field += character
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true
    } else if (character === ',') {
      row.push(field.trim())
      field = ''
    } else if (character === '\n' || character === '\r') {
      if (character === '\r' && input[index + 1] === '\n') index += 1
      row.push(field.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      field = ''
    } else {
      field += character
    }
  }
  if (quoted) throw new Error('CSV contains an unclosed quoted field.')
  if (field || row.length) {
    row.push(field.trim())
    if (row.some(Boolean)) rows.push(row)
  }
  return rows
}

export async function importSparesCsvAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0 || file.size > 1_000_000) {
      redirect('/admin?section=spares&error=csv-file')
    }
    const rows = parseCsv(await file.text())
    const headers = rows.shift()?.map((header) => header.trim().toLowerCase()) ?? []
    const requiredHeaders = ['name', 'partnumber', 'category', 'condition', 'grade', 'price', 'stock', 'description', 'images', 'compatibility']
    if (requiredHeaders.some((header) => !headers.includes(header)) || rows.length < 1 || rows.length > 500) {
      redirect('/admin?section=spares&error=csv-format')
    }
    const headerIndex = new Map(headers.map((header, index) => [header, index]))
    const imported = rows.map((row) => {
      const get = (header: string) => row[headerIndex.get(header) ?? -1]?.trim() ?? ''
      const category = get('category') as typeof spareCategories[number]
      const condition = get('condition')
      const price = Number(get('price'))
      const stock = Number(get('stock'))
      const images = get('images').split('|').map((url) => url.trim()).filter(Boolean)
      const compatibility = parseCompatibility(get('compatibility').replace(/;/g, '\n'))
      if (!get('name') || !get('partnumber') || !spareCategories.includes(category)
        || !['new', 'used'].includes(condition) || (condition === 'used' && !get('grade'))
        || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0
        || !images.length || images.some((url) => !isValidImageUrl(url)) || compatibility === null
        || containsSampleDetails(get('name'), get('partnumber'), images, compatibility)) {
        throw new Error('One or more CSV rows contain invalid part data.')
      }
      return {
        id: makeId('spare', get('name')),
        name: get('name'),
        partNumber: get('partnumber'),
        category,
        condition,
        grade: get('grade'),
        price,
        stock,
        description: get('description'),
        images,
        compatibility,
      }
    })
    if (new Set(imported.map((spare) => spare.partNumber.toLowerCase())).size !== imported.length) {
      redirect('/admin?section=spares&error=csv-duplicates')
    }

    const transaction = await getTursoClient().transaction('write')
    try {
      for (const spare of imported) {
        const categoryId = spare.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        await transaction.execute({
          sql: `INSERT INTO spares (id, name, part_number, category, condition, grade, price, stock, description, image, images_json, is_sample)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT(part_number) DO UPDATE SET name=excluded.name, category=excluded.category, condition=excluded.condition, grade=excluded.grade, price=excluded.price, stock=excluded.stock, description=excluded.description, image=excluded.image, images_json=excluded.images_json, is_sample=0, updated_at=CURRENT_TIMESTAMP`,
          args: [spare.id, spare.name, spare.partNumber, categoryId, spare.condition, spare.condition === 'used' ? spare.grade : null, spare.price, spare.stock, spare.description, spare.images[0], JSON.stringify(spare.images)],
        })
        const saved = await transaction.execute({ sql: 'SELECT id FROM spares WHERE part_number = ?', args: [spare.partNumber] })
        const savedId = String(saved.rows[0]?.id ?? spare.id)
        await transaction.execute({ sql: 'DELETE FROM spare_compatibility WHERE spare_id = ?', args: [savedId] })
        for (const fitment of spare.compatibility) {
          await transaction.execute({
            sql: 'INSERT INTO spare_compatibility (spare_id, make, model, year_from, year_to) VALUES (?, ?, ?, ?, ?)',
            args: [savedId, fitment.make, fitment.model, fitment.yearFrom, fitment.yearTo],
          })
        }
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    } finally {
      transaction.close()
    }
    refreshCatalogPages()
    redirect(`/admin?section=spares&notice=csv-imported-${imported.length}`)
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to import spares CSV:', error)
    redirect('/admin?section=spares&error=csv-import-failed')
  }
}

export async function saveSpareAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const id = value(formData, 'id') || makeId('spare', value(formData, 'name'))
    const editorQuery = id ? `&editSpare=${encodeURIComponent(id)}` : ''
    const name = value(formData, 'name')
    const partNumber = value(formData, 'partNumber')
    const category = value(formData, 'category') as typeof spareCategories[number]
    const condition = value(formData, 'condition')
    const grade = value(formData, 'grade')
    const price = numberField(formData, 'price')
    const stock = numberField(formData, 'stock')
    const imageUrls = lines(value(formData, 'images'))
    const compatibility = parseCompatibility(value(formData, 'compatibility'))
    if (value(formData, 'confirmRealData') !== 'on') redirect(`/admin?section=spares${editorQuery}&error=spare-confirmation`)
    if (!name || !partNumber || !spareCategories.includes(category) || !['new', 'used'].includes(condition)
      || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0
      || !imageUrls.length || imageUrls.some((url) => !isValidImageUrl(url)) || compatibility === null) {
      redirect(`/admin?section=spares${editorQuery}&error=spare-fields`)
    }
    if (containsSampleDetails(name, partNumber, imageUrls, compatibility)) {
      redirect(`/admin?section=spares${editorQuery}&error=spare-sample-details`)
    }
    if (condition === 'used' && !grade) redirect(`/admin?section=spares${editorQuery}&error=spare-grade`)
    const categoryId = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const db = getTursoClient()
    const transaction = await db.transaction('write')
    try {
      await transaction.execute({
          sql: `INSERT INTO spares (id, name, part_number, category, condition, grade, price, stock, description, image, images_json, is_sample)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
            ON CONFLICT(id) DO UPDATE SET name=excluded.name, part_number=excluded.part_number, category=excluded.category, condition=excluded.condition, grade=excluded.grade, price=excluded.price, stock=excluded.stock, description=excluded.description, image=excluded.image, images_json=excluded.images_json, is_sample=0, updated_at=CURRENT_TIMESTAMP`,
        args: [id, name, partNumber, categoryId, condition, condition === 'used' ? grade : null, price, stock, value(formData, 'description'), imageUrls[0], JSON.stringify(imageUrls)],
      })
      await transaction.execute({ sql: 'DELETE FROM spare_compatibility WHERE spare_id = ?', args: [id] })
      for (const fitment of compatibility) {
        await transaction.execute({
          sql: 'INSERT INTO spare_compatibility (spare_id, make, model, year_from, year_to) VALUES (?, ?, ?, ?, ?)',
          args: [id, fitment.make, fitment.model, fitment.yearFrom, fitment.yearTo],
        })
      }
      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    } finally {
      transaction.close()
    }
    refreshCatalogPages()
    redirect('/admin?section=spares&notice=spare-saved')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to save spare:', error)
    redirect('/admin?section=spares&error=save-failed')
  }
}

export async function deleteCarAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const id = value(formData, 'id')
    if (!id) redirect('/admin?section=cars&error=invalid-id')
    await getTursoClient().execute({ sql: 'DELETE FROM cars WHERE id = ?', args: [id] })
    refreshCatalogPages()
    redirect('/admin?section=cars&notice=car-deleted')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to delete car:', error)
    redirect('/admin?section=cars&error=delete-failed')
  }
}

export async function deleteSpareAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const id = value(formData, 'id')
    if (!id) redirect('/admin?section=spares&error=invalid-id')
    await getTursoClient().execute({ sql: 'DELETE FROM spares WHERE id = ?', args: [id] })
    refreshCatalogPages()
    redirect('/admin?section=spares&notice=spare-deleted')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to delete spare:', error)
    redirect('/admin?section=spares&error=delete-failed')
  }
}

export async function updateOrderStatusAction(formData: FormData): Promise<void> {
  if (!(await isAdminSignedIn())) redirect('/admin?error=sign-in-required')
  try {
    ensureAdminDatabase()
    const id = value(formData, 'id')
    const status = value(formData, 'status')
    const allowedStatuses: OrderStatus[] = ['requested', 'confirmed', 'fulfilled', 'cancelled']
    if (!id || !allowedStatuses.includes(status as OrderStatus)) {
      redirect('/admin?section=orders&error=invalid-order')
    }
    await getTursoClient().execute({
      sql: 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: [status, id],
    })
    revalidatePath('/admin')
    redirect('/admin?section=orders&notice=order-updated')
  } catch (error) {
    if (error && typeof error === 'object' && 'digest' in error) throw error
    console.error('Unable to update order status:', error)
    redirect('/admin?section=orders&error=order-update-failed')
  }
}
