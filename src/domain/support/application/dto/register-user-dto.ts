import type { Either } from '@/core/either'
import type { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import type { Client } from '@/domain/support/enterprise/entities/client'

export interface RegisterUserUseCaseRequestDTO {
  name: string
  email: string
  password: string
}

export type RegisterUserUseCaseResponseDTO = Either<
  UserAlreadyExistsError,
  {
    user: Client
  }
>
