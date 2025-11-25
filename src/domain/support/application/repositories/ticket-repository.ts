import type { Ticket } from '@/domain/support/enterprise/entities/ticket'

export interface TicketRepository {
  create(ticket: Ticket): Promise<void>
  findById(id: string): Promise<Ticket | null>
  findAll(): Promise<Ticket[]>
  save(ticket: Ticket): Promise<void>
  delete(ticket: Ticket): Promise<void>
}
