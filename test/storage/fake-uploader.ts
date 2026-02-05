import { Uploader, type UploadParams } from '@/domain/support/application/storage/uploader'

export class FakeUploader implements Uploader {
  public uploads: UploadParams[] = []

  async upload(params: UploadParams): Promise<{ url: string }> {
    this.uploads.push(params)

    return {
      url: `https://uploadthing.com/${params.fileName}`,
    }
  }
}
