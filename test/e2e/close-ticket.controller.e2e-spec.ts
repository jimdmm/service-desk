import { Status } from '@/domain/support/enterprise/value-objects/status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { TicketFactory } from 'test/factories/make-ticket'

describe('Close Ticket (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let ticketFactory: TicketFactory
  let jwt: JwtService

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
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /tickets/:ticketId/close/client/:clientId', async () => {
    const client = await clientFactory.makePrismaClient()
    const accessToken = jwt.sign({ sub: client.id.toString(), role: 'CLIENT' })

    const ticket = await ticketFactory.makePrismaTicket({
      openedBy: client.id,
      status: Status.create('RESOLVED'),
    })

    const ticketId = ticket.id.toString()
    const clientId = client.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/tickets/${ticketId}/close/client/${clientId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const ticketOnDatabase = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    })

    expect(ticketOnDatabase?.status).toBe('CLOSED')
    expect(ticketOnDatabase?.closedAt).toBeTruthy()
  })
})
