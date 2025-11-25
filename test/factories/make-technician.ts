import type { UniqueEntityId } from '@/core/unique-entity-id'
import { Technician } from '@/domain/support/enterprise/entities/technician'
import { faker } from '@faker-js/faker'

interface MakeTechnicianProps {
  name: string
  email: string
  maxConcurrentTickets: number
  ticketsAssigned: UniqueEntityId[]
}

export function makeTechnician(
  override: Partial<MakeTechnicianProps> = {},
  id?: UniqueEntityId
) {
  const technician = Technician.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      maxConcurrentTickets: 3,
      ticketsAssigned: [],
      ...override,
    },
    id
  )

  return technician
}
