import { Injectable } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  Uploader,
  type UploadParams,
} from '@/domain/support/application/storage/uploader'

@Injectable()
export class LocalStorage implements Uploader {
  async upload({
    fileName,
    body,
  }: UploadParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`
    
    const uploadPath = join(process.cwd(), 'uploads', uniqueFileName)

    await writeFile(uploadPath, body)

    return {
      url: uniqueFileName,
    }
  }
}
