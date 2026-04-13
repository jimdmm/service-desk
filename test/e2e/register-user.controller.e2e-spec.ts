import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'

describe('RegisterUserController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = moduleFixture.get(PrismaService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /users/register - should register a new client', async () => {
    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'John Doe',
        email: 'john@doe.com',
        password: 'password123',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.user).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john@doe.com',
      createdAt: expect.any(String),
    })

    const clientOnDatabase = await prisma.client.findFirst({
      where: { email: 'john@doe.com' },
    })

    expect(clientOnDatabase).toBeTruthy()
    expect(clientOnDatabase?.name).toBe('John Doe')
  })

  it('POST /users/register - should not allow duplicate email', async () => {
    await request(app.getHttpServer()).post('/users/register').send({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123',
    })

    const response = await request(app.getHttpServer())
      .post('/users/register')
      .send({
        name: 'Jane Doe',
        email: 'john@doe.com',
        password: 'password456',
      })

    expect(response.statusCode).toBe(409)
  })
})
