import type { TicketAttachmentsRepository } from '@/domain/support/application/repositories'
import type { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'

export class InMemoryTicketAttachmentsRepository
  implements TicketAttachmentsRepository
{
  public items: Map<string, TicketAttachment> = new Map()

  async findManyByTicketId(ticketId: string): Promise<TicketAttachment[]> {
    const ticketAttachments = Array.from(this.items.values()).filter(
      attachment => attachment.ticketId.toString() === ticketId
    )

    return ticketAttachments
  }

  async deleteManyByTicketId(ticketId: string): Promise<void> {
    for (const [id, attachment] of this.items.entries()) {
      if (attachment.ticketId.toString() === ticketId) {
        this.items.delete(id)
      }
    }
  }
}
