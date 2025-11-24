import {left, right} from '@/core/either'
import {UniqueEntityId} from '@/core/unique-entity-id'
import type {
  DeleteTicketUseCaseRequestDTO,
  DeleteTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/delete-ticket-dto'
import {NotAllowedError} from '@/domain/support/application/errors/not-allowed-error'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import type {TicketRepository} from '@/domain/support/application/repositories'

export class DeleteTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    ticketId,
    clientId,
  }: DeleteTicketUseCaseRequestDTO): Promise<DeleteTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (!ticket.openedBy?.equals(new UniqueEntityId(clientId))) {
      return left(new NotAllowedError())
    }

    await this.ticketRepository.delete(ticket)

    return right({})
  }
}
