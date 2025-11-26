import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  TicketAttachment,
  type TicketAttachmentProps,
} from '@/domain/support/enterprise/entities/ticket-attachment'

export function makeTicketAttachment(
  override: Partial<TicketAttachmentProps> = {},
  id?: UniqueEntityId
) {
  const ticketAttachment = TicketAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      ticketId: new UniqueEntityId(),
      ...override,
    },
    id
  )

  return ticketAttachment
}
