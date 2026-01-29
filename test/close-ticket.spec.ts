import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { CloseTicketUseCase } from '@/domain/support/application/use-cases/close-ticket'
import { Status } from '@/domain/support/enterprise/value-objects/status'
import { makeTicket } from '@test/factories/make-ticket'
import {
  InMemoryTicketAttachmentsRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryTicketAttachmentsRepository: InMemoryTicketAttachmentsRepository
let inMemoryTicketRepository: InMemoryTicketRepository
let sut: CloseTicketUseCase

describe('Close Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketAttachmentsRepository =
      new InMemoryTicketAttachmentsRepository()
    inMemoryTicketRepository = new InMemoryTicketRepository(
      inMemoryTicketAttachmentsRepository
    )
    sut = new CloseTicketUseCase(inMemoryTicketRepository)
  })

  it('should be able to close a ticket', async () => {
    const clientId = 'client-1'
    const ticket = makeTicket({
      openedBy: new UniqueEntityId(clientId),
      status: Status.create('RESOLVED'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId,
    })

    expect(result.isRight()).toBe(true)
    expect(
      inMemoryTicketRepository.items.get(ticket.id.toString())?.status.value
    ).toEqual('CLOSED')
    expect(
      inMemoryTicketRepository.items.get(ticket.id.toString())?.closedAt
    ).toBeInstanceOf(Date)
  })

  it('should not be able to close a non-existent ticket', async () => {
    const result = await sut.execute({
      ticketId: 'non-existent-ticket',
      clientId: 'client-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to close a ticket if not the client who opened it', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
      status: Status.create('RESOLVED'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'another-client',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to close a ticket that is not resolved', async () => {
    const clientId = 'client-1'
    const ticket = makeTicket({
      openedBy: new UniqueEntityId(clientId),
      status: Status.create('IN_PROGRESS'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
