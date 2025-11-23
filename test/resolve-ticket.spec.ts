import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { Status } from '@/domain/support/enterprise/value-objects/status'
import { makeTicket } from 'test/factories/make-ticket'
import { InMemoryTicketRepository } from 'test/repositories/in-memory-ticket-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResolveTicketUseCase } from '../src/domain/support/application/use-cases/resolve-ticket'

let inMemoryTicketRepository: InMemoryTicketRepository
let sut: ResolveTicketUseCase

describe('Resolve Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    sut = new ResolveTicketUseCase(inMemoryTicketRepository)
  })

  it('should be able to resolve a ticket', async () => {
    const technicianId = 'technician-1'
    const ticket = makeTicket({
      assignedBy: new UniqueEntityId(technicianId),
      status: Status.create('IN_PROGRESS')
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId
    })

    expect(result.isRight()).toBe(true)
    expect(Array.from(inMemoryTicketRepository.items.values())[0].status.value).toEqual('RESOLVED')
  })

  it('should not be able to resolve a non-existent ticket', async () => {
    const result = await sut.execute({
      ticketId: 'non-existent-ticket',
      technicianId: 'technician-1'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to resolve a ticket assigned to another technician', async () => {
    const ticket = makeTicket({
      assignedBy: new UniqueEntityId('technician-1'),
      status: Status.create('IN_PROGRESS')
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: 'technician-2'
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to resolve a ticket with invalid status transition', async () => {
    const technicianId = 'technician-1'
    const ticket = makeTicket({
      assignedBy: new UniqueEntityId(technicianId),
      status: Status.create('CLOSED')
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})