import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { CommentOnTicketUseCase } from '@/domain/support/application/use-cases/comment-on-ticket'
import { makeTicket } from '@test/factories/make-ticket'
import {
  InMemoryCommentRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import { expect, it } from 'vitest'

let inMemoryAnswerCommentRepository: InMemoryCommentRepository
let inMemoryTicketRepository: InMemoryTicketRepository
let sut: CommentOnTicketUseCase

describe('Create Comment on Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryAnswerCommentRepository = new InMemoryCommentRepository()
    inMemoryTicketRepository = new InMemoryTicketRepository()
    sut = new CommentOnTicketUseCase(
      inMemoryAnswerCommentRepository,
      inMemoryTicketRepository
    )
  })

  it('should be able to create a comment on ticket with client', async () => {
    const ticket = makeTicket()
    inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      authorId: 'author-1',
      content: 'This is a client comment',
      authorType: 'client',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        content: 'This is a client comment',
        authorType: 'CLIENT',
      }),
    })
    expect(inMemoryAnswerCommentRepository.items).toHaveLength(1)
    expect(
      Array.from(inMemoryAnswerCommentRepository.items.values())[0].authorType
    ).toBe('CLIENT')
  })

  it('should be able to create a comment on ticket with technician', async () => {
    const ticket = makeTicket()
    inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      authorId: 'author-1',
      content: 'This is a technician comment',
      authorType: 'technician',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        content: 'This is a technician comment',
        authorType: 'TECHNICIAN',
      }),
    })
    expect(inMemoryAnswerCommentRepository.items).toHaveLength(1)
    expect(
      Array.from(inMemoryAnswerCommentRepository.items.values())[0].authorType
    ).toBe('TECHNICIAN')
  })

  it('should not be able to create a comment on non-existent ticket', async () => {
    const result = await sut.execute({
      ticketId: 'non-existent-ticket-id',
      authorId: 'author-1',
      content: 'This comment should fail',
      authorType: 'client',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
