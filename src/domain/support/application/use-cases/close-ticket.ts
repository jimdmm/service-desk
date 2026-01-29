import { left, right } from '@/core/either'
import type {
  CloseTicketUseCaseRequestDTO,
  CloseTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/close-ticket-dto'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type { TicketRepository } from '@/domain/support/application/repositories'
import { Status } from '@/domain/support/enterprise/value-objects/status'

export class CloseTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    ticketId,
    clientId,
  }: CloseTicketUseCaseRequestDTO): Promise<CloseTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (ticket.openedBy.toString() !== clientId) {
      return left(new NotAllowedError())
    }

    const closedStatus = Status.create('CLOSED')

    if (!ticket.status.canTransitionTo(closedStatus)) {
      return left(new NotAllowedError())
    }

    ticket.close()

    await this.ticketRepository.save(ticket)

    return right({})
  }
}
