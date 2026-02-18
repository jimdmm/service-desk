import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool

  constructor() {
    const connectionString = process.env.DATABASE_URL

    if (!connectionString) {
      throw new Error('DATABASE_URL is not set')
    }

    const url = new URL(connectionString)
    const schema = url.searchParams.get('schema')

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool, {
      schema: schema ?? undefined,
    })

    super({
      log: ['warn', 'error'],
      adapter,
    })

    this.pool = pool
  }

  onModuleInit() {
    return this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
  }
}
