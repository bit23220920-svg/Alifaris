import { loadEnvConfig } from '@next/env'
import { cars, categories } from '../lib/cars-data'
import { spareCategories, spares } from '../lib/spares-data'
import { getTursoClient } from '../lib/turso'

loadEnvConfig(process.cwd())

async function main(): Promise<void> {
  const db = getTursoClient()
  const transaction = await db.transaction('write')

  try {
    for (const category of categories) {
      await transaction.execute({
        sql: 'INSERT INTO car_categories (id, name, description) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name, description = excluded.description',
        args: [category.id, category.name, category.description],
      })
    }

    for (const car of cars) {
      await transaction.execute({
        sql: `INSERT INTO cars (id, name, brand, category, price, year, mileage, fuel_type, transmission, engine, horsepower, color, features_json, description, image, images_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name, brand=excluded.brand, category=excluded.category, price=excluded.price, year=excluded.year, mileage=excluded.mileage, fuel_type=excluded.fuel_type, transmission=excluded.transmission, engine=excluded.engine, horsepower=excluded.horsepower, color=excluded.color, features_json=excluded.features_json, description=excluded.description, image=excluded.image, images_json=excluded.images_json, updated_at=CURRENT_TIMESTAMP`,
        args: [car.id, car.name, car.brand, car.category, car.price, car.year, car.mileage, car.fuelType, car.transmission, car.engine, car.horsepower, car.color, JSON.stringify(car.features), car.description, car.image, JSON.stringify(car.images)],
      })
    }

    for (const category of spareCategories) {
      await transaction.execute({
        sql: 'INSERT INTO spare_categories (id, name) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET name = excluded.name',
        args: [category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), category],
      })
    }

    for (const spare of spares) {
      const categoryId = spare.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      await transaction.execute({
        sql: `INSERT INTO spares (id, name, part_number, category, condition, grade, price, stock, description, image, images_json, is_sample)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ON CONFLICT(id) DO UPDATE SET name=excluded.name, part_number=excluded.part_number, category=excluded.category, condition=excluded.condition, grade=excluded.grade, price=excluded.price, stock=excluded.stock, description=excluded.description, image=excluded.image, images_json=excluded.images_json, is_sample=1, updated_at=CURRENT_TIMESTAMP
        WHERE spares.is_sample = 1`,
        args: [spare.id, spare.name, spare.partNumber, categoryId, spare.condition, spare.grade ?? null, spare.price, spare.stock, spare.description, spare.image, JSON.stringify(spare.images)],
      })
      const saved = await transaction.execute({ sql: 'SELECT is_sample FROM spares WHERE id = ?', args: [spare.id] })
      if (Number(saved.rows[0]?.is_sample) !== 1) continue
      await transaction.execute({ sql: 'DELETE FROM spare_compatibility WHERE spare_id = ?', args: [spare.id] })
      for (const fitment of spare.compatibility) {
        await transaction.execute({
          sql: 'INSERT INTO spare_compatibility (spare_id, make, model, year_from, year_to) VALUES (?, ?, ?, ?, ?)',
          args: [spare.id, fitment.make, fitment.model, fitment.yearFrom, fitment.yearTo],
        })
      }
    }

    await transaction.commit()
    console.log(`Seeded ${cars.length} cars and ${spares.length} spares.`)
  } catch (error) {
    await transaction.rollback()
    throw error
  } finally {
    transaction.close()
  }
}

main().catch((error: unknown) => {
  console.error('Unable to seed sample catalog:', error)
  process.exitCode = 1
})
