import { Injectable } from '@nestjs/common'
import type { TicketRepository } from '@/domain/support/application/repositories/ticket-repository'
import type { Ticket } from '@/domain/support/enterprise/entities/ticket'
import { PrismaService } from '../prisma.service'
import { PrismaTicketMapper } from '../mappers/prisma-ticket-mapper'
import { TicketAttachmentsRepository } from '@/domain/support/application/repositories/ticket-attachments-repository'

@Injectable()
export class PrismaTicketRepository implements TicketRepository {
  constructor(
    private prisma: PrismaService,
    private ticketAttachmentsRepository: TicketAttachmentsRepository
  ) {}

  async create(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    await this.prisma.ticket.create({
      data,
    })

    await this.ticketAttachmentsRepository.createMany(
      ticket.attachments.getItems()
    )
  }

  async findById(id: string): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: {
        id,
      },
    })

    if (!ticket) {
      return null
    }

    return PrismaTicketMapper.toDomain(ticket)
  }

  async findAll(): Promise<Ticket[]> {
    const tickets = await this.prisma.ticket.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tickets.map(PrismaTicketMapper.toDomain)
  }

  async save(ticket: Ticket): Promise<void> {
    const data = PrismaTicketMapper.toPrisma(ticket)

    await Promise.all([
      this.prisma.ticket.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.ticketAttachmentsRepository.createMany(
        ticket.attachments.getNewItems()
      ),
      this.ticketAttachmentsRepository.deleteMany(
        ticket.attachments.getRemovedItems()
      ),
    ])
  }

  async delete(ticket: Ticket): Promise<void> {
    await this.prisma.ticket.delete({
      where: {
        id: ticket.id.toString(),
      },
    })
  }
}
