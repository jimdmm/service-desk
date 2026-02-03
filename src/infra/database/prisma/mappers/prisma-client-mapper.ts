import type { Client as PrismaClient, Prisma } from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { Client } from '@/domain/support/enterprise/entities/client'

export class PrismaClientMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(client: Client): Prisma.ClientUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      email: client.email,
      password: client.password,
      createdAt: client.createdAt,
    }
  }
}
