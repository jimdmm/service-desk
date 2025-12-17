import { UseCaseError } from '@/core/errors/use-case-error'

export class TicketNotAssignedError extends UseCaseError {
  constructor() {
    super('Ticket is not currently assigned to any technician')
  }
}