import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { TicketFactory } from 'test/factories/make-ticket'

describe('Delete Ticket (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let ticketFactory: TicketFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        {
          provide: ClientFactory,
          useFactory: (prisma: PrismaService) => new ClientFactory(prisma),
          inject: [PrismaService],
        },
        {
          provide: TicketFactory,
          useFactory: (prisma: PrismaService) => new TicketFactory(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)
    ticketFactory = moduleRef.get(TicketFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[DELETE] /tickets/:ticketId/client/:clientId', async () => {
    const client = await clientFactory.makePrismaClient()

    const ticket = await ticketFactory.makePrismaTicket({
      openedBy: client.id,
    })

    const ticketId = ticket.id.toString()
    const clientId = client.id.toString()

    const response = await request(app.getHttpServer()).delete(
      `/tickets/${ticketId}/client/${clientId}`
    )

    expect(response.statusCode).toBe(204)

    const ticketOnDatabase = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    })

    expect(ticketOnDatabase).toBeNull()
  })
})
