import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Module-level pool to avoid issues with super() call
let _pool: Pool | null = null

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }
    _pool = new Pool({ connectionString })
  }
  return _pool
}

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const pool = getPool()
    const adapter = new PrismaPg(pool)

    super({
      log: ['warn', 'error'],
      adapter,
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
    if (_pool) {
      await _pool.end()
      _pool = null
    }
  }
}
