import type { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Technician,
  type TechnicianProps,
} from '@/domain/support/enterprise/entities/technician'
import { faker } from '@faker-js/faker'

export function makeTechnician(
  override: Partial<TechnicianProps> = {},
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
