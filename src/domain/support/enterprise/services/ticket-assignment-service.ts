import { type Either, left, right } from '@/core/either'
import type { Technician } from '@/domain/support/enterprise/entities/technician'
import type { Ticket } from '@/domain/support/enterprise/entities/ticket'
import { InvalidTicketStatusTransitionError } from '@/domain/support/enterprise/errors/invalid-ticket-status-transition-error'
import { TechnicianCapacityExceededError } from '@/domain/support/enterprise/errors/tecnician-capacity-exceeded-error'
import { TicketAlreadyAssignedError } from '@/domain/support/enterprise/errors/ticket-already-assigned-error'
import { TicketNotAssignedError } from '@/domain/support/enterprise/errors/ticket-not-assigned-error'
import { Status } from '@/domain/support/enterprise/value-objects/status'

type AssignmentError =
  | TicketAlreadyAssignedError
  | InvalidTicketStatusTransitionError
  | TechnicianCapacityExceededError

type UnassignmentError =
  | TicketNotAssignedError
  | InvalidTicketStatusTransitionError

export class TicketAssignmentService {
  assign(
    ticket: Ticket,
    technician: Technician
  ): Either<AssignmentError, boolean> {
    if (ticket.assignedBy) {
      return left(new TicketAlreadyAssignedError())
    }

    const assignedStatus = Status.create('ASSIGNED')

    if (!ticket.status.canTransitionTo(assignedStatus)) {
      return left(new InvalidTicketStatusTransitionError(
        ticket.status.value,
        assignedStatus.value
      ))
    }

    if (!technician.canAssignNewTicket()) {
      return left(new TechnicianCapacityExceededError())
    }

    technician.assignToTicket(ticket.id.toString())
    ticket.assignTo(technician.id)

    return right(true)
  }

  unassign(
    ticket: Ticket,
    technician: Technician
  ): Either<UnassignmentError, boolean> {
    if (!ticket.assignedBy) {
      return left(new TicketNotAssignedError())
    }

    const openStatus = Status.create('OPEN')

    if (!ticket.status.canTransitionTo(openStatus)) {
      return left(new InvalidTicketStatusTransitionError(
        ticket.status.value,
        openStatus.value
      ))
    }

    technician.unassignToTicket(ticket.id.toString())
    ticket.unassign(openStatus)

    return right(true)
  }
}
