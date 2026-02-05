import type { Either } from '@/core/either'
import type { InvalidAttachmentTypeError } from '@/domain/support/application/errors/invalid-attachment-type-error'
import type { Attatchment } from '@/domain/support/enterprise/entities/attachment'

export interface UploadAndCreateAttachmentUseCaseRequestDTO {
  fileName: string
  fileType: string
  body: Buffer
}

export type UploadAndCreateAttachmentUseCaseResponseDTO = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attatchment
  }
>
