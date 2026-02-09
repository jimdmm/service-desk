import type { Either } from '@/core/either'
import type { ClientNotFoundError } from '@/domain/support/application/errors/client-not-found-error'
import type { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import type { Technician } from '@/domain/support/enterprise/entities/technician'

export interface PromoteClientToTechnicianUseCaseRequestDTO {
  clientId: string
}

export type PromoteClientToTechnicianUseCaseResponseDTO = Either<
  ClientNotFoundError | UserAlreadyExistsError,
  {
    technician: Technician
  }
>