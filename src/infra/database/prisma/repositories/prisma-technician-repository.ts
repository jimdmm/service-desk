import { Injectable } from '@nestjs/common'
import type { TechnicianRepository } from '@/domain/support/application/repositories/technician-repository'
import type { Technician } from '@/domain/support/enterprise/entities/technician'
import { PrismaService } from '../prisma.service'
import { PrismaTechnicianMapper } from '../mappers/prisma-technician-mapper'

@Injectable()
export class PrismaTechnicianRepository implements TechnicianRepository {
  constructor(private prisma: PrismaService) {}

  async create(technician: Technician): Promise<void> {
    const data = PrismaTechnicianMapper.toPrisma(technician)

    await this.prisma.technician.create({
      data,
    })
  }

  async findById(id: string): Promise<Technician | null> {
    const technician = await this.prisma.technician.findUnique({
      where: {
        id,
      },
      include: {
        ticketsAssigned: true,
      },
    })

    if (!technician) {
      return null
    }

    return PrismaTechnicianMapper.toDomain(technician)
  }

  async findByEmail(email: string): Promise<Technician | null> {
    const technician = await this.prisma.technician.findUnique({
      where: {
        email,
      },
      include: {
        ticketsAssigned: true,
      },
    })

    if (!technician) {
      return null
    }

    return PrismaTechnicianMapper.toDomain(technician)
  }

  async save(technician: Technician): Promise<void> {
    const data = PrismaTechnicianMapper.toPrisma(technician)

    await this.prisma.technician.update({
      where: {
        id: data.id,
      },
      data,
    })
  }
}
