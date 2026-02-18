import { left, right } from '@/core/either'
import { Encrypter } from '@/domain/support/application/cryptography/encrypter'
import { HashComparer } from '@/domain/support/application/cryptography/hash-comparer'
import type {
  AuthenticateUserUseCaseRequestDTO,
  AuthenticateUserUseCaseResponseDTO,
} from '@/domain/support/application/dto/authenticate-user-dto'
import { WrongCredentialsError } from '@/domain/support/application/errors/wrong-credentials-error'
import {
  ClientRepository,
  TechnicianRepository,
} from '@/domain/support/application/repositories'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private technicianRepository: TechnicianRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequestDTO): Promise<AuthenticateUserUseCaseResponseDTO> {
    const client = await this.clientRepository.findByEmail(email)
    const technician = await this.technicianRepository.findByEmail(email)

    const user = client ?? technician

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const role = client ? 'CLIENT' : 'TECHNICIAN'

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role,
    })

    return right({ accessToken })
  }
}
