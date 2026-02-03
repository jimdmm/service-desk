import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { DeleteTicketUseCase } from '@/domain/support/application/use-cases/delete-ticket'
import { makeTicket } from '@test/factories/make-ticket'
import {
  InMemoryTicketAttachmentsRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryTicketAttachmentsRepository: InMemoryTicketAttachmentsRepository
let inMemoryTicketRepository: InMemoryTicketRepository
let sut: DeleteTicketUseCase

describe('Delete Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketAttachmentsRepository =
      new InMemoryTicketAttachmentsRepository()
    inMemoryTicketRepository = new InMemoryTicketRepository(
      inMemoryTicketAttachmentsRepository
    )
    sut = new DeleteTicketUseCase(inMemoryTicketRepository)
  })

  it('should be able delete a ticket', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'client-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTicketRepository.items.size).toBe(0)
  })

  it('should not be able to delete a non existing ticket.', async () => {
    const result = await sut.execute({
      ticketId: 'non-existing-ticket-id',
      clientId: 'client-1',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to delete a ticket for another client.', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'client-2',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
