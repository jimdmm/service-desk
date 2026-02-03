import { UniqueEntityId } from '@/core/unique-entity-id'
import { FetchCommentsTicketUseCase } from '@/domain/support/application/use-cases/fetch-comments-ticket'
import { makeComment } from '@test/factories/make-comment'
import { makeTicket } from '@test/factories/make-ticket'
import {
  InMemoryCommentRepository,
  InMemoryTicketAttachmentsRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import { beforeEach, describe, expect, it } from 'vitest'

describe('Fetch Comments Ticket UseCase', () => {
  let inMemoryTicketAttachmentsRepository: InMemoryTicketAttachmentsRepository
  let inMemoryTicketRepository: InMemoryTicketRepository
  let inMemoryCommentRepository: InMemoryCommentRepository
  let sut: FetchCommentsTicketUseCase

  beforeEach(() => {
    inMemoryTicketAttachmentsRepository =
      new InMemoryTicketAttachmentsRepository()
    inMemoryTicketRepository = new InMemoryTicketRepository(
      inMemoryTicketAttachmentsRepository
    )
    inMemoryCommentRepository = new InMemoryCommentRepository()
    sut = new FetchCommentsTicketUseCase(inMemoryCommentRepository)
  })

  it('should be able to fetch comments from a ticket', async () => {
    const ticket = makeTicket({}, new UniqueEntityId('ticket-1'))

    await inMemoryTicketRepository.create(ticket)

    for (let i = 0; i < 3; i++) {
      await inMemoryCommentRepository.create(
        makeComment({ ticketId: ticket.id })
      )
    }

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
  })

  it('should be able to fetch paginated comments', async () => {
    const ticket = makeTicket({}, new UniqueEntityId('ticket-1'))

    for (let i = 0; i < 22; i++) {
      await inMemoryCommentRepository.create(
        makeComment({ ticketId: ticket.id })
      )
    }

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
