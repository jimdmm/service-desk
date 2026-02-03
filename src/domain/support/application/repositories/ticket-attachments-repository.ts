import type { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'

export abstract class TicketAttachmentsRepository {
  abstract findManyByTicketId(ticketId: string): Promise<TicketAttachment[]>
  abstract createMany(attachments: TicketAttachment[]): Promise<void>
  abstract deleteMany(attachments: TicketAttachment[]): Promise<void>
  abstract deleteManyByTicketId(ticketId: string): Promise<void>
}
