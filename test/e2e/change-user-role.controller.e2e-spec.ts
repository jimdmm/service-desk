import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { TechnicianFactory } from 'test/factories/make-technician'

describe('ChangeUserRoleController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let clientFactory: ClientFactory
  let technicianFactory: TechnicianFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile()

    app = moduleFixture.createNestApplication()
    prisma = moduleFixture.get(PrismaService)
    clientFactory = moduleFixture.get(ClientFactory)
    technicianFactory = moduleFixture.get(TechnicianFactory)
    jwt = moduleFixture.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('PATCH /admin/users/:userId/role - should promote client to technician', async () => {
    const adminTech = await technicianFactory.makePrismaTechnician()
    const accessToken = jwt.sign({
      sub: adminTech.id.toString(),
      role: 'ADMIN',
    })

    const client = await clientFactory.makePrismaClient({
      name: 'John Doe',
      email: 'john.promote@doe.com',
    })

    const response = await request(app.getHttpServer())
      .patch(`/admin/users/${client.id.toString()}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentRole: 'CLIENT',
        newRole: 'TECHNICIAN',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      email: 'john.promote@doe.com',
      role: 'TECHNICIAN',
      maxConcurrentTickets: 3,
      createdAt: expect.any(String),
    })

    const technicianOnDatabase = await prisma.technician.findFirst({
      where: { email: 'john.promote@doe.com' },
    })

    expect(technicianOnDatabase).toBeTruthy()
    expect(technicianOnDatabase?.name).toBe('John Doe')
  })

  it('PATCH /admin/users/:userId/role - should demote technician to client', async () => {
    const adminTech = await technicianFactory.makePrismaTechnician()
    const accessToken = jwt.sign({
      sub: adminTech.id.toString(),
      role: 'ADMIN',
    })

    const technician = await technicianFactory.makePrismaTechnician({
      name: 'Jane Tech',
      email: 'jane.demote@tech.com',
    })

    const response = await request(app.getHttpServer())
      .patch(`/admin/users/${technician.id.toString()}/role`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentRole: 'TECHNICIAN',
        newRole: 'CLIENT',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.user).toEqual({
      id: expect.any(String),
      name: 'Jane Tech',
      email: 'jane.demote@tech.com',
      role: 'CLIENT',
      createdAt: expect.any(String),
    })

    const clientOnDatabase = await prisma.client.findFirst({
      where: { email: 'jane.demote@tech.com' },
    })

    expect(clientOnDatabase).toBeTruthy()
    expect(clientOnDatabase?.name).toBe('Jane Tech')
  })

  it('PATCH /admin/users/:userId/role - should return error for non-existent user', async () => {
    const adminTech = await technicianFactory.makePrismaTechnician()
    const accessToken = jwt.sign({
      sub: adminTech.id.toString(),
      role: 'ADMIN',
    })

    const response = await request(app.getHttpServer())
      .patch('/admin/users/non-existent-id/role')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        currentRole: 'CLIENT',
        newRole: 'TECHNICIAN',
      })

    expect(response.statusCode).toBe(500) // Or whatever error status you expect
  })
})
