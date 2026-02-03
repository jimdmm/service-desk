import type {
  Technician as PrismaTechnician,
  Prisma,
  Ticket,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { Technician } from '@/domain/support/enterprise/entities/technician'

type PrismaTechnicianWithTickets = PrismaTechnician & {
  ticketsAssigned?: Ticket[]
}

export class PrismaTechnicianMapper {
  static toDomain(raw: PrismaTechnicianWithTickets): Technician {
    return Technician.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        maxConcurrentTickets: raw.maxConcurrentTickets,
        ticketsAssigned: raw.ticketsAssigned?.map(ticket => ticket.id) ?? [],
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    technician: Technician
  ): Prisma.TechnicianUncheckedCreateInput {
    return {
      id: technician.id.toString(),
      name: technician.name,
      email: technician.email,
      password: technician.password,
      maxConcurrentTickets: technician.maxConcurrentTickets,
      createdAt: technician.createdAt,
    }
  }
}
