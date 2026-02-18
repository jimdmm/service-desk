import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { CommentFactory } from 'test/factories/make-comment'
import { TicketFactory } from 'test/factories/make-ticket'

describe('Fetch Comments Ticket (E2E)', () => {
  let app: INestApplication
  let clientFactory: ClientFactory
  let ticketFactory: TicketFactory
  let commentFactory: CommentFactory
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
        {
          provide: CommentFactory,
          useFactory: (prisma: PrismaService) => new CommentFactory(prisma),
          inject: [PrismaService],
        },
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    clientFactory = moduleRef.get(ClientFactory)
    ticketFactory = moduleRef.get(TicketFactory)
    commentFactory = moduleRef.get(CommentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  test('[GET] /tickets/:ticketId/comments', async () => {
    const client = await clientFactory.makePrismaClient()
    const accessToken = jwt.sign({ sub: client.id.toString(), role: 'CLIENT' })

    const ticket = await ticketFactory.makePrismaTicket({
      openedBy: client.id,
    })

    await commentFactory.makePrismaComment({
      ticketId: ticket.id,
      authorId: client.id,
      content: 'Comentário 1',
      authorType: 'CLIENT',
    })

    await commentFactory.makePrismaComment({
      ticketId: ticket.id,
      authorId: client.id,
      content: 'Comentário 2',
      authorType: 'CLIENT',
    })

    const ticketId = ticket.id.toString()

    const response = await request(app.getHttpServer())
      .get(`/tickets/${ticketId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.comments).toHaveLength(2)
    expect(response.body.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ content: 'Comentário 1' }),
        expect.objectContaining({ content: 'Comentário 2' }),
      ])
    )
  })
})
