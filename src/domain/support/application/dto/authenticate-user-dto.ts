import type { Either } from '@/core/either'
import type { WrongCredentialsError } from '@/domain/support/application/errors/wrong-credentials-error'

export interface AuthenticateUserUseCaseRequestDTO {
  email: string
  password: string
}

export type AuthenticateUserUseCaseResponseDTO = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>
