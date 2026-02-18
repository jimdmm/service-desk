import { left, right } from '@/core/either'
import type {
  ChangeUserRoleUseCaseRequestDTO,
  ChangeUserRoleUseCaseResponseDTO,
} from '@/domain/support/application/dto/change-user-role-dto'
import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import { UserNotFoundError } from '@/domain/support/application/errors/user-not-found-error'
import {
  ClientRepository,
  TechnicianRepository,
} from '@/domain/support/application/repositories'
import { Client } from '@/domain/support/enterprise/entities/client'
import { Technician } from '@/domain/support/enterprise/entities/technician'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChangeUserRoleUseCase {
  constructor(
    private clientRepository: ClientRepository,
    private technicianRepository: TechnicianRepository
  ) {}

  async execute({
    userId,
    currentRole,
    newRole,
  }: ChangeUserRoleUseCaseRequestDTO): Promise<ChangeUserRoleUseCaseResponseDTO> {
    if (currentRole === newRole) {
      const user = await this.findUserByRole(userId, currentRole)
      if (!user) {
        return left(new UserNotFoundError(userId))
      }
      return right({ user })
    }

    const currentUser = await this.findUserByRole(userId, currentRole)
    if (!currentUser) {
      return left(new UserNotFoundError(userId))
    }

    const existingUserInNewRole = await this.findUserByEmailInRole(
      currentUser.email,
      newRole
    )
    if (existingUserInNewRole) {
      return left(new UserAlreadyExistsError(currentUser.email))
    }

    const newUser = await this.createUserInRole(currentUser, newRole)

    return right({ user: newUser })
  }

  private async findUserByRole(
    userId: string,
    role: 'CLIENT' | 'TECHNICIAN'
  ): Promise<Client | Technician | null> {
    if (role === 'CLIENT') {
      return await this.clientRepository.findById(userId)
    }
    return await this.technicianRepository.findById(userId)
  }

  private async findUserByEmailInRole(
    email: string,
    role: 'CLIENT' | 'TECHNICIAN'
  ): Promise<Client | Technician | null> {
    if (role === 'CLIENT') {
      return await this.clientRepository.findByEmail(email)
    }
    return await this.technicianRepository.findByEmail(email)
  }

  private async createUserInRole(
    userData: Client | Technician,
    role: 'CLIENT' | 'TECHNICIAN'
  ): Promise<Client | Technician> {
    if (role === 'CLIENT') {
      const client = Client.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      })
      await this.clientRepository.create(client)
      return client
    }

    const technician = Technician.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
    })
    await this.technicianRepository.create(technician)
    return technician
  }
}
