import type {UniqueEntityId} from '@/core/unique-entity-id'
import {Client} from '@/domain/support/enterprise/entities/client'
import {faker} from '@faker-js/faker'

interface MakeClientProps {
  name: string
  email: string
}

export function makeClient(
  override: Partial<MakeClientProps> = {},
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
