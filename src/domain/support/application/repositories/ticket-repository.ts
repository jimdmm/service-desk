import type { Ticket } from '@/domain/support/enterprise/entities/ticket'

export abstract class TicketRepository {
  abstract create(ticket: Ticket): Promise<void>
  abstract findById(id: string): Promise<Ticket | null>
  abstract findAll(): Promise<Ticket[]>
  abstract save(ticket: Ticket): Promise<void>
  abstract delete(ticket: Ticket): Promise<void>
}
