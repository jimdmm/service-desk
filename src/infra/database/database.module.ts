import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ClientRepository } from '@/domain/support/application/repositories/client-repository'
import { TechnicianRepository } from '@/domain/support/application/repositories/technician-repository'
import { TicketRepository } from '@/domain/support/application/repositories/ticket-repository'
import { CommentRepository } from '@/domain/support/application/repositories/comment-repository'
import { TicketAttachmentsRepository } from '@/domain/support/application/repositories/ticket-attachments-repository'
import { PrismaClientRepository } from './prisma/repositories/prisma-client-repository'
import { PrismaTechnicianRepository } from './prisma/repositories/prisma-technician-repository'
import { PrismaTicketRepository } from './prisma/repositories/prisma-ticket-repository'
import { PrismaCommentRepository } from './prisma/repositories/prisma-comment-repository'
import { PrismaTicketAttachmentsRepository } from './prisma/repositories/prisma-ticket-attachments-repository'
import { EnvModule } from '@/infra/env/env.module'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: ClientRepository,
      useClass: PrismaClientRepository,
    },
    {
      provide: TechnicianRepository,
      useClass: PrismaTechnicianRepository,
    },
    {
      provide: TicketRepository,
      useClass: PrismaTicketRepository,
    },
    {
      provide: CommentRepository,
      useClass: PrismaCommentRepository,
    },
    {
      provide: TicketAttachmentsRepository,
      useClass: PrismaTicketAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    ClientRepository,
    TechnicianRepository,
    TicketRepository,
    CommentRepository,
    TicketAttachmentsRepository,
  ],
})
export class DatabaseModule {}
