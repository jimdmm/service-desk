import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/unique-entity-id'
import type {
  CreateTicketUseCaseRequestDTO,
  CreateTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/open-ticket-dto'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type {
  ClientRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import { Ticket } from '@/domain/support/enterprise/entities/ticket'
import { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'
import { TicketAttachmentList } from '@/domain/support/enterprise/entities/ticket-attachment-list'
import { Status } from '@/domain/support/enterprise/value-objects/status'

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
    attachmentsIds,
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

    const ticketAttachments = attachmentsIds.map(attachmentId => {
      return TicketAttachment.create({
        ticketId: ticket.id,
        attachmentId: new UniqueEntityId(attachmentId),
      })
    })

    ticket.attachments = new TicketAttachmentList(ticketAttachments)

    await this.ticketRepository.create(ticket)

    return right({
      ticket,
    })
  }
}
