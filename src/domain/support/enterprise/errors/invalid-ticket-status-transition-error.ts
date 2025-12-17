import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidTicketStatusTransitionError extends UseCaseError {
  constructor(fromStatus: string, toStatus: string) {
    super(`Cannot transition ticket from '${fromStatus}' to '${toStatus}'`)
  }
}