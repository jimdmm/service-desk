import {type Either, left, right} from '@/core/either'
import {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import type {Technician} from '@/domain/support/enterprise/entities/technician'
import type {Ticket} from '@/domain/support/enterprise/entities/ticket'
import {Status} from '@/domain/support/enterprise/value-objects/status'

export class TicketAssignmentService {
  assign(
    ticket: Ticket,
    technician: Technician
  ): Either<NotAllowedError, boolean> {
    const assignedStatus = Status.create('ASSIGNED')

    if (!ticket.status.canTransitionTo(assignedStatus)) {
      return left(new NotAllowedError())
    }

    if (!technician.canAssignNewTicket()) {
      return left(new NotAllowedError())
    }

    technician.assignToTicket(ticket.id.toString())
    ticket.assignTo(technician.id)

    return right(true)
  }

  unassign(
    ticket: Ticket,
    technician: Technician
  ): Either<NotAllowedError, boolean> {
    const openStatus = Status.create('OPEN')

    if (!ticket.status.canTransitionTo(openStatus)) {
      return left(new NotAllowedError())
    }

    technician.unassignToTicket(ticket.id.toString())
    ticket.unassign(openStatus)

    return right(true)
  }
}
