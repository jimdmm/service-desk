import {UniqueEntityId} from '@/core/unique-entity-id'
import {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import {UnassignTicketUseCase} from '@/domain/support/application/use-cases/unassign-ticket'
import {TicketAssignmentService} from '@/domain/support/enterprise/services/ticket-assignment-service'
import {Status} from '@/domain/support/enterprise/value-objects/status'
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
let sut: UnassignTicketUseCase

describe('Unassign Ticket Use Case', () => {
  beforeEach(() => {
    inMemoryTicketRepository = new InMemoryTicketRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()
    assignmentService = new TicketAssignmentService()
    sut = new UnassignTicketUseCase(
      inMemoryTicketRepository,
      inMemoryTechnicianRepository,
      assignmentService
    )
  })

  it('should be able unassign a ticket', async () => {
    const ticket = makeTicket(
      {
        title: 'Support needed',
        description: 'Help me please',
        status: Status.create('OPEN'),
      },
      new UniqueEntityId('ticket-1')
    )
    await inMemoryTicketRepository.create(ticket)

    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))

    await inMemoryTechnicianRepository.create(technician)

    assignmentService.assign(ticket, technician)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: technician.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(
        inMemoryTechnicianRepository.items.get(technician.id.toString())
          ?.ticketsAssigned
      ).toHaveLength(0)
      expect(
        inMemoryTicketRepository.items.get(ticket.id.toString())?.status.value
      ).toEqual('OPEN')
    }
  })

  it('should not be able to assign a ticket to a non existing technician', async () => {
    const ticket = makeTicket(
      {
        title: 'Support needed',
        description: 'Help me please',
        status: Status.create('OPEN'),
      },
      new UniqueEntityId('ticket-1')
    )
    await inMemoryTicketRepository.create(ticket)

    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))

    await inMemoryTechnicianRepository.create(technician)

    assignmentService.assign(ticket, technician)

    const result = await sut.execute({
      ticketId: ticket.id.toString(),
      technicianId: 'non-existing-technician-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to unassign a non existing ticket', async () => {
    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))
    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      ticketId: 'non-existing-ticket-id',
      technicianId: technician.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('should not be able to unassign a ticket if technician does not have it assigned', async () => {
    const ticket = makeTicket(
      {
        title: 'Support needed',
        description: 'Help me please',
        status: Status.create('OPEN'),
      },
      new UniqueEntityId('ticket-1')
    )
    await inMemoryTicketRepository.create(ticket)

    const technician = makeTechnician({}, new UniqueEntityId('technician-1'))
    await inMemoryTechnicianRepository.create(technician)

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
