import type { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Client,
  type ClientProps,
} from '@/domain/support/enterprise/entities/client'
import { faker } from '@faker-js/faker'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityId
) {
  const client = Client.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      ...override,
    },
    id
  )

  return client
}
