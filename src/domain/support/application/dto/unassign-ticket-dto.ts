import type { Either } from '@/core/either'
import type { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'

export interface UnassignTicketUseCaseRequestDTO {
  ticketId: string
  technicianId: string
}

export type UnassignTicketUseCaseResponseDTO = Either<ResourceNotFoundError, {}>
