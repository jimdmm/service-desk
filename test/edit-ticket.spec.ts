import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { EditTicketUseCase } from '@/domain/support/application/use-cases/edit-ticket'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'
import { makeTicket } from '@test/factories/make-ticket'
import { InMemoryTicketRepository } from '@test/repositories'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryTicketRepository: InMemoryTicketRepository
let sut: EditTicketUseCase

describe('Edit Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    sut = new EditTicketUseCase(inMemoryTicketRepository)
  })

  it('should be able edit a ticket', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'client-1',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
      priority: Priority.create('medium'),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.ticket.title).toEqual('Computador dando tela azul')
      expect(result.value.ticket.description).toEqual(
        'O computador está apresentando tela azul ao iniciar o sistema operacional.'
      )
      expect(result.value.ticket.priority.value).toBe('medium')
    }
  })

  it('should not be able to edit a non existing ticket.', async () => {
    const result = await sut.execute({
      ticketId: 'non-existing-ticket-id',
      clientId: 'client-1',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to edit a ticket for another client.', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
    })

    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'client-2',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
