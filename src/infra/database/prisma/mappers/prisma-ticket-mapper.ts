import type {
  Ticket as PrismaTicket,
  TicketStatus,
  TicketPriority,
  Prisma,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { Ticket } from '@/domain/support/enterprise/entities/ticket'
import {
  Status,
  type StatusLevel,
} from '@/domain/support/enterprise/value-objects/status'
import {
  Priority,
  type PriorityLevel,
} from '@/domain/support/enterprise/value-objects/priority'

export class PrismaTicketMapper {
  static toDomain(raw: PrismaTicket): Ticket {
    return Ticket.create(
      {
        title: raw.title,
        description: raw.description,
        status: Status.create(raw.status as StatusLevel),
        priority: Priority.create(raw.priority.toLowerCase() as PriorityLevel),
        openedBy: new UniqueEntityId(raw.openedBy),
        assignedTo: raw.assignedTo ? new UniqueEntityId(raw.assignedTo) : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
        resolvedAt: raw.resolvedAt,
        closedAt: raw.closedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(ticket: Ticket): Prisma.TicketUncheckedCreateInput {
    return {
      id: ticket.id.toString(),
      title: ticket.title,
      description: ticket.description,
      status: ticket.status.value as TicketStatus,
      priority: ticket.priority.value.toUpperCase() as TicketPriority,
      openedBy: ticket.openedBy.toString(),
      assignedTo: ticket.assignedTo?.toString() ?? null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolvedAt: ticket.resolvedAt,
      closedAt: ticket.closedAt,
    }
  }
}
