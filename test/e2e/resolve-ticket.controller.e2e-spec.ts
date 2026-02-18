import { Status } from '@/domain/support/enterprise/value-objects/status'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { TechnicianFactory } from 'test/factories/make-technician'
import { TicketFactory } from 'test/factories/make-ticket'

describe('Resolve Ticket (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let technicianFactory: TechnicianFactory
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
          provide: TechnicianFactory,
          useFactory: (prisma: PrismaService) => new TechnicianFactory(prisma),
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
    technicianFactory = moduleRef.get(TechnicianFactory)
    ticketFactory = moduleRef.get(TicketFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[PATCH] /tickets/:ticketId/resolve/technician/:technicianId', async () => {
    const client = await clientFactory.makePrismaClient()
    const technician = await technicianFactory.makePrismaTechnician()
    const accessToken = jwt.sign({
      sub: technician.id.toString(),
      role: 'TECHNICIAN',
    })

    const ticket = await ticketFactory.makePrismaTicket({
      openedBy: client.id,
      assignedTo: technician.id,
      status: Status.create('IN_PROGRESS'),
    })

    const ticketId = ticket.id.toString()
    const technicianId = technician.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/tickets/${ticketId}/resolve/technician/${technicianId}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(204)

    const ticketOnDatabase = await prisma.ticket.findUnique({
      where: {
        id: ticketId,
      },
    })

    expect(ticketOnDatabase?.status).toBe('RESOLVED')
    expect(ticketOnDatabase?.resolvedAt).toBeTruthy()
  })
})
