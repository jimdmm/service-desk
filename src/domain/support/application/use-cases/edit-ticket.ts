import { left, right } from "@/core/either"
import { UniqueEntityId } from "@/core/unique-entity-id"
import type { EditTicketUseCaseRequestDTO, EditTicketUseCaseResponseDTO } from "@/domain/support/application/dto/edit-ticket-dto"
import { NotAllowedError } from "@/domain/support/application/errors/not-allowed-error"
import { ResourceNotFoundError } from "@/domain/support/application/errors/resource-not-found-error"
import type { TicketRepository } from "@/domain/support/application/repositories/ticket-repository"

export class EditTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository
  ) { }

  async execute({
    ticketId,
    clientId,
    title,
    description,
    priority
  }: EditTicketUseCaseRequestDTO): Promise<EditTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (!ticket.openedBy?.equals(new UniqueEntityId(clientId))) {
      return left(new NotAllowedError())
    }

    if (title) {
      ticket.title = title
    }

    if (description) {
      ticket.description = description
    }

    if (priority) {
      ticket.priority = priority
    }

    await this.ticketRepository.save(ticket)

    return right({
      ticket
    })
  }
}