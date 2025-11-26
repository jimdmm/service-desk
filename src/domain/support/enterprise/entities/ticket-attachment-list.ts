import { WatchedList } from '@/core/watched-list'
import type { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'

export class TicketAttachmentList extends WatchedList<TicketAttachment> {
  compareItems(a: TicketAttachment, b: TicketAttachment): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}
