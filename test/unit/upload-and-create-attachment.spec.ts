import { UploadAndCreateAttachmentUseCase } from '@/domain/support/application/use-cases/upload-and-create-attachment'
import { InvalidAttachmentTypeError } from '@/domain/support/application/errors/invalid-attachment-type-error'
import { InMemoryAttachmentRepository } from '@test/repositories/in-memory-attachment-repository'
import { FakeUploader } from '@test/storage/fake-uploader'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryAttachmentRepository: InMemoryAttachmentRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentRepository = new InMemoryAttachmentRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should be able to upload a jpeg image', async () => {
    const result = await sut.execute({
      fileName: 'photo.jpg',
      fileType: 'image/jpeg',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should be able to upload a pdf file', async () => {
    const result = await sut.execute({
      fileName: 'document.pdf',
      fileType: 'application/pdf',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
