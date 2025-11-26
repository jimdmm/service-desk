import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/unique-entity-id'
import type {
  EditTicketUseCaseRequestDTO,
  EditTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/edit-ticket-dto'
import { NotAllowedError } from '@/domain/support/application/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type {
  TicketAttachmentsRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import { TicketAttachment } from '@/domain/support/enterprise/entities/ticket-attachment'
import { TicketAttachmentList } from '@/domain/support/enterprise/entities/ticket-attachment-list'

export class EditTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private ticketAttachmentsRepository: TicketAttachmentsRepository
  ) {}

  async execute({
    ticketId,
    clientId,
    title,
    description,
    priority,
    attachmentsIds,
  }: EditTicketUseCaseRequestDTO): Promise<EditTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    if (!ticket.openedBy?.equals(new UniqueEntityId(clientId))) {
      return left(new NotAllowedError())
    }

    const currentTicketAttachments =
      await this.ticketAttachmentsRepository.findManyByTicketId(ticketId)

    const ticketAttachmentList = new TicketAttachmentList(
      currentTicketAttachments
    )

    const ticketAttachments = attachmentsIds.map(attachmentId => {
      return TicketAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        ticketId: ticket.id,
      })
    })

    ticketAttachmentList.update(ticketAttachments)

    ticket.title = title
    ticket.priority = priority
    ticket.description = description
    ticket.attachments = ticketAttachmentList

    await this.ticketRepository.save(ticket)

    return right({
      ticket,
    })
  }
}
