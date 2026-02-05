import type { Attachment as PrismaAttachment, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { Attatchment } from '@/domain/support/enterprise/entities/attachment'

export class PrismaAttachmentMapper {
  static toDomain(raw: PrismaAttachment): Attatchment {
    return Attatchment.create(
      {
        title: raw.title,
        link: raw.link,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(attachment: Attatchment): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toString(),
      title: attachment.title,
      link: attachment.link,
    }
  }
}
