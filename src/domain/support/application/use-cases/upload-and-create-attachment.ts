import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import { InvalidAttachmentTypeError } from '@/domain/support/application/errors/invalid-attachment-type-error'
import { Uploader } from '@/domain/support/application/storage/uploader'
import type {
  UploadAndCreateAttachmentUseCaseRequestDTO,
  UploadAndCreateAttachmentUseCaseResponseDTO,
} from '@/domain/support/application/dto/upload-and-create-attachment-dto'
import { Attatchment } from '@/domain/support/enterprise/entities/attachment'
import { AttachmentRepository } from '@/domain/support/application/repositories/attachment-repository'

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private attachmentRepository: AttachmentRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndCreateAttachmentUseCaseRequestDTO): Promise<UploadAndCreateAttachmentUseCaseResponseDTO> {
    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const attachment = Attatchment.create({
      title: fileName,
      link: url,
    })

    await this.attachmentRepository.create(attachment)

    return right({
      attachment,
    })
  }
}
