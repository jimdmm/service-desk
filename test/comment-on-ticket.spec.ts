import { UniqueEntityId } from '@/core/unique-entity-id'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { CommentOnTicketUseCase } from '@/domain/support/application/use-cases/comment-on-ticket'
import { makeTicket } from '@test/factories/make-ticket'
import {
  InMemoryCommentRepository,
  InMemoryTicketAttachmentsRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import { expect, it } from 'vitest'

let inMemoryCommentRepository: InMemoryCommentRepository
let inMemoryTicketAttachmentsRepository: InMemoryTicketAttachmentsRepository
let inMemoryTicketRepository: InMemoryTicketRepository
let sut: CommentOnTicketUseCase

describe('Create Comment on Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryCommentRepository = new InMemoryCommentRepository()
    inMemoryTicketAttachmentsRepository =
      new InMemoryTicketAttachmentsRepository()
    inMemoryTicketRepository = new InMemoryTicketRepository(
      inMemoryTicketAttachmentsRepository
    )
    sut = new CommentOnTicketUseCase(
      inMemoryCommentRepository,
      inMemoryTicketRepository
    )
  })

  it('should be able to create a comment on ticket with client', async () => {
    const ticket = makeTicket({ openedBy: new UniqueEntityId('client-1') })
    inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      authorId: 'author-1',
      content: 'This is a client comment',
      authorType: 'CLIENT',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        content: 'This is a client comment',
        authorType: 'CLIENT',
      }),
    })
    expect(inMemoryCommentRepository.items).toHaveLength(1)
    expect(
      Array.from(inMemoryCommentRepository.items.values())[0].authorType
    ).toBe('CLIENT')
  })

  it('should be able to create a comment on ticket with technician', async () => {
    const ticket = makeTicket()
    inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      authorId: 'author-1',
      content: 'This is a technician comment',
      authorType: 'TECHNICIAN',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      comment: expect.objectContaining({
        content: 'This is a technician comment',
        authorType: 'TECHNICIAN',
      }),
    })
    expect(inMemoryCommentRepository.items).toHaveLength(1)
    expect(
      Array.from(inMemoryCommentRepository.items.values())[0].authorType
    ).toBe('TECHNICIAN')
  })

  it('should not be able to create a comment on non-existent ticket', async () => {
    const result = await sut.execute({
      ticketId: 'non-existent-ticket-id',
      authorId: 'author-1',
      content: 'This comment should fail',
      authorType: 'CLIENT',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
