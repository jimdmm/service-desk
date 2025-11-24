import {left, right} from '@/core/either'
import type {
  UnassignTicketUseCaseRequestDTO,
  UnassignTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/unassign-ticket-dto'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import type {
  TechnicianRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import type {TicketAssignmentService} from '@/domain/support/enterprise/services/ticket-assignment-service'

export class UnassignTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private technicianRepository: TechnicianRepository,
    private assignmentService: TicketAssignmentService
  ) {}

  async execute({
    ticketId,
    technicianId,
  }: UnassignTicketUseCaseRequestDTO): Promise<UnassignTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    const technician = await this.technicianRepository.findById(technicianId)

    if (!technician) {
      return left(new ResourceNotFoundError('Technician'))
    }

    const unassignmentResult = this.assignmentService.unassign(
      ticket,
      technician
    )

    if (unassignmentResult.isLeft()) {
      return left(unassignmentResult.value)
    }

    await this.ticketRepository.save(ticket)
    await this.technicianRepository.save(technician)

    return right({})
  }
}
