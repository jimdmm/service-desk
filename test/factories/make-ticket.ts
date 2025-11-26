import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Ticket,
  type TicketProps,
} from '@/domain/support/enterprise/entities/ticket'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'
import { Status } from '@/domain/support/enterprise/value-objects/status'
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
      assignedBy: null,
      ...override,
    },
    id
  )

  return ticket
}
