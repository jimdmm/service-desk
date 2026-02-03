import { Injectable } from '@nestjs/common'
import { left, right } from '@/core/either'
import type {
  StartTicketUseCaseRequestDTO,
  StartTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/start-ticket-dto'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import { TicketRepository } from '@/domain/support/application/repositories/'
import { Status } from '@/domain/support/enterprise/value-objects/status'

@Injectable()
export class StartTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    ticketId,
    technicianId,
  }: StartTicketUseCaseRequestDTO): Promise<StartTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (ticket.assignedTo?.toString() !== technicianId) {
      return left(new NotAllowedError())
    }

    const inProgressStatus = Status.create('IN_PROGRESS')

    if (!ticket.status?.canTransitionTo(inProgressStatus)) {
      return left(new NotAllowedError())
    }

    ticket.status = inProgressStatus

    await this.ticketRepository.save(ticket)

    return right({})
  }
}
