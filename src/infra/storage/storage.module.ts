import { Module } from '@nestjs/common'
import { Uploader } from '@/domain/support/application/storage/uploader'
import { LocalStorage } from './local-storage'
// import { R2Storage } from './r2-storage'

@Module({
  providers: [
    {
      provide: Uploader,
    //   useClass: R2Storage,
      useClass: LocalStorage,
    },
  ],
  exports: [Uploader],
})
export class StorageModule {}
