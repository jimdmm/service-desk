import type { Attatchment } from '@/domain/support/enterprise/entities/attachment'

export abstract class AttachmentRepository {
  abstract create(attachment: Attatchment): Promise<void>
  abstract findById(id: string): Promise<Attatchment | null>
}
