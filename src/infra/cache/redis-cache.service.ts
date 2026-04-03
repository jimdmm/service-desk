import { EnvService } from '@/infra/env/env.service'
import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisCacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis

  constructor(private env: EnvService) {
    this.client = new Redis({
      host: this.env.get('REDIS_HOST'),
      port: this.env.get('REDIS_PORT'),
      db: this.env.get('REDIS_DB'),
    })
  }

  onModuleInit() {
    this.client.on('error', err => {
      console.error('Redis connection error:', err.message)
    })
  }

  async onModuleDestroy() {
    await this.client.quit()
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)

    if (!data) {
      return null
    }

    return JSON.parse(data) as T
  }

  async set(key: string, value: unknown, ttlInSeconds = 30): Promise<void> {
    await this.client.set(key, JSON.stringify(value), 'EX', ttlInSeconds)
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async delByPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern)

    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }
}
