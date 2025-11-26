import { Entity } from '@/core/entity'
import type { UniqueEntityId } from '@/core/unique-entity-id'

export interface TicketAttachmentProps {
  ticketId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class TicketAttachment extends Entity<TicketAttachmentProps> {
  get ticketId() {
    return this.props.ticketId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: TicketAttachmentProps, id?: UniqueEntityId) {
    const answerAttachment = new TicketAttachment(props, id)

    return answerAttachment
  }
}
