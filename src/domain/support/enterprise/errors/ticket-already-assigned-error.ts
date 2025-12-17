import { UseCaseError } from '@/core/errors/use-case-error'

export class TicketAlreadyAssignedError extends UseCaseError {
  constructor() {
    super('Ticket is already assigned to another technician')
  }
}