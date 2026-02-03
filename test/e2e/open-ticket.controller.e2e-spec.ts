import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'

describe('Open Ticket (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        {
          provide: ClientFactory,
          useFactory: (prisma: PrismaService) => new ClientFactory(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /tickets', async () => {
    const client = await clientFactory.makePrismaClient()

    const response = await request(app.getHttpServer()).post('/tickets').send({
      clientId: client.id.toString(),
      title: 'Problema no computador',
      description: 'Meu computador não liga',
      priority: 'high',
      attachmentsIds: [],
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toHaveProperty('ticketId')

    const ticketOnDatabase = await prisma.ticket.findFirst({
      where: {
        title: 'Problema no computador',
      },
    })

    expect(ticketOnDatabase).toBeTruthy()
    expect(ticketOnDatabase?.status).toBe('OPEN')
    expect(ticketOnDatabase?.priority).toBe('HIGH')
  })
})
