import {UniqueEntityId} from '@/core/unique-entity-id'
import {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import {AssignTicketUseCase} from '@/domain/support/application/use-cases/assign-ticket'
import {TicketAssignmentService} from '@/domain/support/enterprise/services/ticket-assignment-service'
import {makeTechnician} from '@test/factories/make-technician'
import {makeTicket} from '@test/factories/make-ticket'
import {
  InMemoryTechnicianRepository,
  InMemoryTicketRepository,
} from '@test/repositories'
import {beforeEach, describe, expect, it} from 'vitest'

let inMemoryTicketRepository: InMemoryTicketRepository
let inMemoryTechnicianRepository: InMemoryTechnicianRepository
let assignmentService: TicketAssignmentService
let sut: AssignTicketUseCase

describe('Assign Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()
    assignmentService = new TicketAssignmentService()
    sut = new AssignTicketUseCase(
      inMemoryTicketRepository,
      inMemoryTechnicianRepository,
      assignmentService
    )
  })

  it('should be able assign a ticket', async () => {
    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))
    await inMemoryTechnicianRepository.create(technician)

    const ticket = makeTicket(
      {title: 'Support needed', description: 'Help me please'},
      new UniqueEntityId('ticket-1')
    )
    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: technician.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(
        inMemoryTechnicianRepository.items.get(technician.id.toString())
          ?.ticketsAssigned
      ).toHaveLength(1)
      expect(
        inMemoryTicketRepository.items
          .get(ticket.id.toString())
          ?.assignedBy?.toString()
      ).toEqual(technician.id.toString())
      expect(
        inMemoryTicketRepository.items.get(ticket.id.toString())?.status.value
      ).toEqual('ASSIGNED')
    }
  })

  it('should not be able to assign a ticket to a non existing technician', async () => {
    const ticket = makeTicket(
      {title: 'Support needed', description: 'Help me please'},
      new UniqueEntityId('ticket-1')
    )
    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: 'non-existing-technician',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to assign a non existing ticket', async () => {
    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))
    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      ticketId: 'non-existing-ticket',
      technicianId: technician.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to assign a ticket if technician reached max concurrent tickets', async () => {
    const technician = makeTechnician(
      {
        maxConcurrentTickets: 1,
        ticketsAssigned: [new UniqueEntityId('ticket-1')],
      },
      new UniqueEntityId('technician-1')
    )

    await inMemoryTechnicianRepository.create(technician)

    const ticket = makeTicket(
      {title: 'Support needed', description: 'Help me please'},
      new UniqueEntityId('ticket-2')
    )
    await inMemoryTicketRepository.create(ticket)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: technician.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
