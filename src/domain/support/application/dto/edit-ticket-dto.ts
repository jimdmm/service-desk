import type {Either} from '@/core/either'
import type {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import type {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import type {Ticket} from '@/domain/support/enterprise/entities/ticket'
import type {Priority} from '@/domain/support/enterprise/value-objects/priority'

export interface EditTicketUseCaseRequestDTO {
  ticketId: string
  clientId: string
  title?: string
  description?: string
  priority?: Priority
}

export type EditTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    ticket: Ticket
  }
>
