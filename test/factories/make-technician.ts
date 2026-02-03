import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Technician,
  type TechnicianProps,
} from '@/domain/support/enterprise/entities/technician'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaTechnicianMapper } from '@/infra/database/prisma/mappers/prisma-technician-mapper'
import { faker } from '@faker-js/faker'

export function makeTechnician(
  override: Partial<TechnicianProps> = {},
  id?: UniqueEntityId
) {
  const technician = Technician.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      maxConcurrentTickets: 3,
      ...override,
    },
    id
  )

  return technician
}

@Injectable()
export class TechnicianFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTechnician(
    data: Partial<TechnicianProps> = {}
  ): Promise<Technician> {
    const technician = makeTechnician(data)

    await this.prisma.technician.create({
      data: PrismaTechnicianMapper.toPrisma(technician),
    })

    return technician
  }
}
