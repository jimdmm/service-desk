import type {
  TicketAttachment as PrismaTicketAttachment,
  Prisma,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'

export class PrismaTicketAttachmentMapper {
  static toDomain(raw: PrismaTicketAttachment): TicketAttachment {
    return TicketAttachment.create(
      {
        ticketId: new UniqueEntityId(raw.ticketId),
        attachmentId: new UniqueEntityId(raw.attachmentId),
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    ticketAttachment: TicketAttachment
  ): Prisma.TicketAttachmentUncheckedCreateInput {
    return {
      id: ticketAttachment.id.toString(),
      ticketId: ticketAttachment.ticketId.toString(),
      attachmentId: ticketAttachment.attachmentId.toString(),
    }
  }
}
