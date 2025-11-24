import type {Either} from '@/core/either'
import type {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import type {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'

export interface DeleteTicketUseCaseRequestDTO {
  ticketId: string
  clientId: string
}

export type DeleteTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>
