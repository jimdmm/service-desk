import type { Either } from '@/core/either'
import type { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import type { UserNotFoundError } from '@/domain/support/application/errors/user-not-found-error'
import type { Client } from '@/domain/support/enterprise/entities/client'
import type { Technician } from '@/domain/support/enterprise/entities/technician'

export type UserRole = 'CLIENT' | 'TECHNICIAN'

export interface ChangeUserRoleUseCaseRequestDTO {
  userId: string
  currentRole: UserRole
  newRole: UserRole
}

export type ChangeUserRoleUseCaseResponseDTO = Either<
  UserNotFoundError | UserAlreadyExistsError,
  {
    user: Client | Technician
  }
>
