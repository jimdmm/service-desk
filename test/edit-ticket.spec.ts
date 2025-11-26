import { UniqueEntityId } from '@/core/unique-entity-id'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { EditTicketUseCase } from '@/domain/support/application/use-cases/edit-ticket'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'
import { makeTicket } from '@test/factories/make-ticket'
import { makeTicketAttachment } from '@test/factories/make-ticket-attachment'
import { InMemoryTicketRepository } from '@test/repositories'
import { InMemoryTicketAttachmentsRepository } from '@test/repositories/in-memory-ticket-attachments-repository'
import { beforeEach, describe, expect, it } from 'vitest'

let inMemoryTicketRepository: InMemoryTicketRepository
let inMemoryTicketAttachmentsRepository: InMemoryTicketAttachmentsRepository
let sut: EditTicketUseCase

describe('Edit Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    inMemoryTicketAttachmentsRepository =
      new InMemoryTicketAttachmentsRepository()
    sut = new EditTicketUseCase(
      inMemoryTicketRepository,
      inMemoryTicketAttachmentsRepository
    )
  })

  it('should be able edit a ticket', async () => {
    const ticket = makeTicket({
      openedBy: new UniqueEntityId('client-1'),
    })

    await inMemoryTicketRepository.create(ticket)

    const attachment1 = makeTicketAttachment({
      ticketId: ticket.id,
      attachmentId: new UniqueEntityId('att-1'),
    })

    const attachment2 = makeTicketAttachment({
      ticketId: ticket.id,
      attachmentId: new UniqueEntityId('att-2'),
    })

    inMemoryTicketAttachmentsRepository.items.set('att-1', attachment1)
    inMemoryTicketAttachmentsRepository.items.set('att-2', attachment2)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      clientId: 'client-1',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
      priority: Priority.create('medium'),
      attachmentsIds: ['att-1', 'att-3'],
    })

    const inMemoryTicketRepositoryItems = inMemoryTicketRepository.items
      .values()
      .next().value

    expect(result.isRight()).toBe(true)
    expect(inMemoryTicketRepositoryItems?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityId('att-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityId('att-3'),
      }),
    ])
  })

  it('should not be able to edit a non existing ticket.', async () => {
    const result = await sut.execute({
      ticketId: 'non-existing-ticket-id',
      clientId: 'client-1',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
      priority: Priority.create('medium'),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
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
      priority: Priority.create('medium'),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
