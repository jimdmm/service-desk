import { left, right } from '@/core/either'
import { HashGenerator } from '@/domain/support/application/cryptography/hash-generator'
import type {
  RegisterUserUseCaseRequestDTO,
  RegisterUserUseCaseResponseDTO,
} from '@/domain/support/application/dto/register-user-dto'
import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import {
  ClientRepository,
  TechnicianRepository,
} from '@/domain/support/application/repositories'
import { Client } from '@/domain/support/enterprise/entities/client'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private technicianRepository: TechnicianRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUserUseCaseRequestDTO): Promise<RegisterUserUseCaseResponseDTO> {
    const userWithSameEmailInClients =
      await this.clientRepository.findByEmail(email)

    const userWithSameEmailInTechnicians =
      await this.technicianRepository.findByEmail(email)

    if (userWithSameEmailInClients || userWithSameEmailInTechnicians) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = Client.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.clientRepository.create(user)

    return right({ user })
  }
}
