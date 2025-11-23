import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { StartTicketUseCase } from '@/domain/support/application/use-cases/start-ticket'
import { Status } from '@/domain/support/enterprise/value-objects/status'
import { makeTicket } from '@test/factories/make-ticket'
import { InMemoryTicketRepository } from '@test/repositories/in-memory-ticket-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryTicketRepository: InMemoryTicketRepository
let sut: StartTicketUseCase

describe('Start Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    sut = new StartTicketUseCase(inMemoryTicketRepository)
  })

  it('should be able start a ticket', async () => {
    const ticket = makeTicket({ status: Status.create('ASSIGNED') }, new UniqueEntityId('ticket-1'))

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString()
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(inMemoryTicketRepository.items.get(ticket.id.toString())?.status?.value).toEqual('IN_PROGRESS')
    }
  })

  it('should not be able to start a non existing ticket', async () => {
    const result = await sut.execute({
      ticketId: 'non-existing-ticket-id'
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to start a ticket if not going assigned', async () => {
    const ticket = makeTicket({}, new UniqueEntityId('ticket-1'))

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString()
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
