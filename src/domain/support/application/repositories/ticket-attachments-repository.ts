import type { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'

export interface TicketAttachmentsRepository {
  findManyByTicketId(ticketId: string): Promise<TicketAttachment[]>
  deleteManyByTicketId(ticketId: string): Promise<void>
}
