import { left, right } from '@/core/either'
import type {
  ResolveTicketUseCaseRequestDTO,
  ResolveTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/resolve-ticket-dto'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type { TicketRepository } from '@/domain/support/application/repositories'
import { Status } from '@/domain/support/enterprise/value-objects/status'

export class ResolveTicketUseCase {
  constructor(private ticketRepository: TicketRepository) {}

  async execute({
    ticketId,
    technicianId,
  }: ResolveTicketUseCaseRequestDTO): Promise<ResolveTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (ticket.assignedBy?.toString() !== technicianId) {
      return left(new NotAllowedError())
    }

    const resolvedStatus = Status.create('RESOLVED')

    if (!ticket.status.canTransitionTo(resolvedStatus)) {
      return left(new NotAllowedError())
    }

    ticket.status = resolvedStatus

    await this.ticketRepository.save(ticket)

    return right({})
  }
}
