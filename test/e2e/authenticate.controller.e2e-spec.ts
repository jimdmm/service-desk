import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
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
    clientFactory = moduleRef.get(ClientFactory)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[POST] /sessions', async () => {
    await clientFactory.makePrismaClient({
      email: 'john@doe.com',
      password: await hash('password123', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john@doe.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })

  test('[POST] /sessions - wrong credentials', async () => {
    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    expect(response.statusCode).toBe(401)
  })
})
