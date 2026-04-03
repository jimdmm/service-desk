import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { envSchema } from '@/infra/env/env'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { Pool } from 'pg'

config({ path: '.env', override: true })
config({ path: '.env.test', override: true })

const env = envSchema.parse(process.env)

function generateUniqueDatabaseURL(schemaId: string) {
  if (!env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  const url = new URL(env.DATABASE_URL)

  url.searchParams.set('schema', schemaId)

  return url.toString()
}

let schemaId: string
let prisma: PrismaClient
let pool: Pool

beforeAll(async () => {
  schemaId = randomUUID()

  const databaseURL = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseURL

  pool = new Pool({ connectionString: databaseURL })
  const adapter = new PrismaPg(pool, { schema: schemaId })

  prisma = new PrismaClient({
    log: ['warn', 'error'],
    adapter,
  })

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
  await prisma.$disconnect()
  await pool.end()
})
