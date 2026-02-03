import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Client,
  type ClientProps,
} from '@/domain/support/enterprise/entities/client'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaClientMapper } from '@/infra/database/prisma/mappers/prisma-client-mapper'
import { faker } from '@faker-js/faker'

export function makeClient(
  override: Partial<ClientProps> = {},
  id?: UniqueEntityId
) {
  const client = Client.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return client
}

@Injectable()
export class ClientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaClient(data: Partial<ClientProps> = {}): Promise<Client> {
    const client = makeClient(data)

    await this.prisma.client.create({
      data: PrismaClientMapper.toPrisma(client),
    })

    return client
  }
}
