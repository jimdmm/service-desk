import { EnvModule } from '@/infra/env/env.module'
import { Module } from '@nestjs/common'
import { RedisCacheService } from './redis-cache.service'

@Module({
  imports: [EnvModule],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class CacheModule {}
