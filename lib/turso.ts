import { createClient, type Client } from '@libsql/client'

let client: Client | undefined

export function isTursoConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL && process.env.TURSO_AUTH_TOKEN)
}

export function getTursoClient(): Client {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url || !authToken) {
    throw new Error('Turso is not configured. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.')
  }
  if (!client) client = createClient({ url, authToken })
  return client
}
