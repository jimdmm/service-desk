import { left, right } from '@/core/either'
import type {
  AssignTicketUseCaseRequestDTO,
  AssignTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/assign-ticket-dto'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type {
  TechnicianRepository,
  TicketAssignmentService,
  TicketRepository,
} from '@/domain/support/application/repositories'

export class AssignTicketUseCase {
  constructor(
    private ticketRepository: TicketRepository,
    private technicianRepository: TechnicianRepository,
    private assignmentService: TicketAssignmentService
  ) {}

  async execute({
    ticketId,
    technicianId,
  }: AssignTicketUseCaseRequestDTO): Promise<AssignTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    const technician = await this.technicianRepository.findById(technicianId)

    if (!technician) {
      return left(new ResourceNotFoundError('Technician'))
    }

    const assignmentResult = this.assignmentService.assign(ticket, technician)

    if (assignmentResult.isLeft()) {
      return left(assignmentResult.value)
    }

    await this.ticketRepository.save(ticket)
    await this.technicianRepository.save(technician)

    return right({})
  }
}
