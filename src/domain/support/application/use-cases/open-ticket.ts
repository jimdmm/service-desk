import {left, right} from '@/core/either'
import type {
  CreateTicketUseCaseRequestDTO,
  CreateTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/open-ticket-dto'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import type {
  ClientRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import {Ticket} from '@/domain/support/enterprise/entities/ticket'
import {Status} from '@/domain/support/enterprise/value-objects/status'

export class OpenTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private clientRepository: ClientRepository
  ) {}

  async execute({
    clientId,
    title,
    description,
    priority,
  }: CreateTicketUseCaseRequestDTO): Promise<CreateTicketUseCaseResponseDTO> {
    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      return left(new ResourceNotFoundError('Client'))
    }

    const ticket = Ticket.create({
      title: title,
      description: description,
      priority: priority,
      openedBy: client.id,
      status: Status.create('OPEN'),
    })

    await this.ticketRepository.create(ticket)

    return right({
      ticket,
    })
  }
}
