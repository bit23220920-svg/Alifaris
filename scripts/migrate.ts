import { loadEnvConfig } from '@next/env'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { getTursoClient } from '../lib/turso'

loadEnvConfig(process.cwd())

async function main(): Promise<void> {
  const client = getTursoClient()
  for (const migrationName of ['0001_catalog.sql', '0002_car_order_items.sql', '0003_spare_images_and_pending_details.sql']) {
    const migrationPath = resolve(process.cwd(), 'db/migrations', migrationName)
    const migration = await readFile(migrationPath, 'utf8')
    await client.executeMultiple(migration)
  }
  console.log('Catalog schema migrations applied.')
}

main().catch((error: unknown) => {
  console.error('Unable to apply catalog schema migration:', error)
  process.exitCode = 1
})
