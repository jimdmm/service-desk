import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Ticket,
  type TicketProps,
} from '@/domain/support/enterprise/entities/ticket'
import { TicketAttachmentList } from '@/domain/support/enterprise/entities/ticket-attachment-list'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'
import { Status } from '@/domain/support/enterprise/value-objects/status'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaTicketMapper } from '@/infra/database/prisma/mappers/prisma-ticket-mapper'
import { faker } from '@faker-js/faker'

export function makeTicket(
  override: Partial<TicketProps> = {},
  id?: UniqueEntityId
) {
  const defaultPriority = Priority.create('low')
  const defaultStatus = Status.create('OPEN')

  const ticket = Ticket.create(
    {
      title: faker.lorem.sentence(3),
      description: faker.lorem.paragraph(),
      priority: defaultPriority,
      status: defaultStatus,
      openedBy: new UniqueEntityId(),
      assignedTo: null,
      attachments: new TicketAttachmentList(),
      ...override,
    },
    id
  )

  return ticket
}

@Injectable()
export class TicketFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTicket(data: Partial<TicketProps> = {}): Promise<Ticket> {
    const ticket = makeTicket(data)

    await this.prisma.ticket.create({
      data: PrismaTicketMapper.toPrisma(ticket),
    })

    return ticket
  }
}
