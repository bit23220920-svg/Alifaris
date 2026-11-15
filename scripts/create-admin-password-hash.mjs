import { randomBytes, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const readline = createInterface({ input: stdin, output: stdout })
const password = await readline.question('Enter a strong admin password (input is visible): ')
readline.close()
if (password.length < 12) {
  console.error('Use at least 12 characters.')
  process.exitCode = 1
} else {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}`)
}
