import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'alifaris-admin-session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be set to at least 32 characters.')
  return secret
}

function validPassword(password: string): boolean {
  const encodedHash = process.env.ADMIN_PASSWORD_HASH
  if (!encodedHash) throw new Error('Set ADMIN_PASSWORD_HASH using the admin password setup instructions.')
  const [salt, expectedHex] = encodedHash.split(':')
  if (!salt || !expectedHex || !/^[a-f0-9]{128}$/i.test(expectedHex)) {
    throw new Error('ADMIN_PASSWORD_HASH has an invalid format.')
  }
  const expected = Buffer.from(expectedHex, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  return timingSafeEqual(actual, expected)
}

function signature(payload: string): Buffer {
  return createHmac('sha256', getSessionSecret()).update(payload).digest()
}

export async function signInAdmin(email: string, password: string): Promise<boolean> {
  const configuredEmail = process.env.ADMIN_EMAIL
  if (!configuredEmail || !email.trim() || !password) {
    throw new Error('Set ADMIN_EMAIL and enter the configured admin email and password.')
  }
  const emailMatches = Buffer.from(email.trim().toLowerCase()).equals(Buffer.from(configuredEmail.trim().toLowerCase()))
  const passwordMatches = validPassword(password)
  if (!emailMatches || !passwordMatches) return false

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS
  const payload = `${expiresAt}.${randomBytes(16).toString('base64url')}`
  const token = `${Buffer.from(payload).toString('base64url')}.${signature(payload).toString('base64url')}`
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
  return true
}

export async function isAdminSignedIn(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return false
  const [encodedPayload, encodedSignature] = token.split('.')
  if (!encodedPayload || !encodedSignature) return false
  try {
    const payload = Buffer.from(encodedPayload, 'base64url').toString()
    const [expiresAt, nonce] = payload.split('.')
    if (!nonce || Number(expiresAt) <= Math.floor(Date.now() / 1000)) return false
    const received = Buffer.from(encodedSignature, 'base64url')
    const expected = signature(payload)
    return received.length === expected.length && timingSafeEqual(received, expected)
  } catch {
    return false
  }
}

export async function signOutAdmin(): Promise<void> {
  ;(await cookies()).delete(COOKIE_NAME)
}
