import { left, right } from '@/core/either'
import type {
  PromoteClientToTechnicianUseCaseRequestDTO,
  PromoteClientToTechnicianUseCaseResponseDTO,
} from '@/domain/support/application/dto/promote-client-to-technician-dto'
import { ClientNotFoundError } from '@/domain/support/application/errors/client-not-found-error'
import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import {
  ClientRepository,
  TechnicianRepository,
} from '@/domain/support/application/repositories'
import { Technician } from '@/domain/support/enterprise/entities/technician'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PromoteClientToTechnicianUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private technicianRepository: TechnicianRepository
  ) {}

  async execute({
    clientId,
  }: PromoteClientToTechnicianUseCaseRequestDTO): Promise<PromoteClientToTechnicianUseCaseResponseDTO> {
    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      return left(new ClientNotFoundError(clientId))
    }

    const existingTechnician = await this.technicianRepository.findByEmail(
      client.email
    )

    if (existingTechnician) {
      return left(new UserAlreadyExistsError(client.email))
    }

    const technician = Technician.create({
      name: client.name,
      email: client.email,
      password: client.password,
    })

    await this.technicianRepository.create(technician)

    return right({ technician })
  }
}
