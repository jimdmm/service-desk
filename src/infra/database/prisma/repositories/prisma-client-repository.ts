import { Injectable } from '@nestjs/common'
import type { ClientRepository } from '@/domain/support/application/repositories/client-repository'
import type { Client } from '@/domain/support/enterprise/entities/client'
import { PrismaService } from '../prisma.service'
import { PrismaClientMapper } from '../mappers/prisma-client-mapper'

@Injectable()
export class PrismaClientRepository implements ClientRepository {
  constructor(private prisma: PrismaService) {}

  async create(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.client.create({
      data,
    })
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        id,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: {
        email,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientMapper.toDomain(client)
  }

  async save(client: Client): Promise<void> {
    const data = PrismaClientMapper.toPrisma(client)

    await this.prisma.client.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
