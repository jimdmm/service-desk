import { Injectable } from '@nestjs/common'
import type { TicketAttachmentsRepository } from '@/domain/support/application/repositories/ticket-attachments-repository'
import type { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'
import { PrismaService } from '../prisma.service'
import { PrismaTicketAttachmentMapper } from '../mappers/prisma-ticket-attachment-mapper'

@Injectable()
export class PrismaTicketAttachmentsRepository
  implements TicketAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByTicketId(ticketId: string): Promise<TicketAttachment[]> {
    const ticketAttachments = await this.prisma.ticketAttachment.findMany({
      where: {
        ticketId,
      },
    })

    return ticketAttachments.map(PrismaTicketAttachmentMapper.toDomain)
  }

  async createMany(attachments: TicketAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const data = attachments.map(PrismaTicketAttachmentMapper.toPrisma)

    await this.prisma.ticketAttachment.createMany({
      data,
    })
  }

  async deleteMany(attachments: TicketAttachment[]): Promise<void> {
    if (attachments.length === 0) {
      return
    }

    const attachmentIds = attachments.map(attachment =>
      attachment.id.toString()
    )

    await this.prisma.ticketAttachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    })
  }

  async deleteManyByTicketId(ticketId: string): Promise<void> {
    await this.prisma.ticketAttachment.deleteMany({
      where: {
        ticketId,
      },
    })
  }
}
