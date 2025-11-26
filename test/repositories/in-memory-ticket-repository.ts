import type {
  TicketAttachmentsRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import type { Ticket } from '@/domain/support/enterprise/entities/ticket'

export class InMemoryTicketRepository implements TicketRepository {
  constructor(
    private ticketAttachmentsRepository: TicketAttachmentsRepository
  ) {}

  public items: Map<string, Ticket> = new Map()

  async create(ticket: Ticket): Promise<void> {
    this.items.set(ticket.id.toString(), ticket)
  }

  async findById(id: string): Promise<Ticket | null> {
    return this.items.get(id) ?? null
  }

  async findAll(): Promise<Ticket[]> {
    return Array.from(this.items.values())
  }

  async save(ticket: Ticket): Promise<void> {
    this.items.set(ticket.id.toString(), ticket)
  }

  async delete(ticket: Ticket): Promise<void> {
    this.items.delete(ticket.id.toString())
    await this.ticketAttachmentsRepository.deleteManyByTicketId(
      ticket.id.toString()
    )
  }
}
