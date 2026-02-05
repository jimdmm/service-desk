import { Injectable } from '@nestjs/common'
import type { AttachmentRepository } from '@/domain/support/application/repositories/attachment-repository'
import type { Attatchment } from '@/domain/support/enterprise/entities/attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentRepository implements AttachmentRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attatchment): Promise<void> {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }

  async findById(id: string): Promise<Attatchment | null> {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        id,
      },
    })

    if (!attachment) {
      return null
    }

    return PrismaAttachmentMapper.toDomain(attachment)
  }
}
