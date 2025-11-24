import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import {OpenTicketUseCase} from '@/domain/support/application/use-cases/open-ticket'
import {Priority} from '@/domain/support/enterprise/value-objects/priority'
import {makeClient} from '@test/factories/make-client'
import {
  InMemoryClientRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import {beforeEach, describe, expect, it} from 'vitest'

let inMemoryTicketRepository: InMemoryTicketRepository
let inMemoryClientRepository: InMemoryClientRepository
let sut: OpenTicketUseCase

describe('Open Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new OpenTicketUseCase(
      inMemoryTicketRepository,
      inMemoryClientRepository
    )
  })

  it('should be able open a ticket', async () => {
    const client = makeClient()

    await inMemoryClientRepository.create(client)

    const result = await sut.execute({
      clientId: client.id.toString(),
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
      priority: Priority.create('medium'),
    })

    if (result.isRight()) {
      expect(inMemoryTicketRepository.items.size).toBe(1)
      expect(
        inMemoryTicketRepository.items.has(result.value.ticket.id.toString())
      ).toBe(true)
      expect(result.value.ticket.title).toEqual('Computador dando tela azul')
      expect(result.value.ticket.description).toEqual(
        'O computador está apresentando tela azul ao iniciar o sistema operacional.'
      )
      expect(result.value.ticket.priority.value).toBe('medium')
    }
  })

  it('should not be able to open a ticket with non existing client', async () => {
    const result = await sut.execute({
      clientId: 'non-existing-client-id',
      title: 'Computador dando tela azul',
      description:
        'O computador está apresentando tela azul ao iniciar o sistema operacional.',
      priority: Priority.create('medium'),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
