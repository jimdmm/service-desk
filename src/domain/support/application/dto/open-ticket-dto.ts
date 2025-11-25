import type { Either } from '@/core/either'
import type { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type { Ticket } from '@/domain/support/enterprise/entities/ticket'
import type { Priority } from '@/domain/support/enterprise/value-objects/priority'

export interface CreateTicketUseCaseRequestDTO {
  clientId: string
  title: string
  description: string
  priority: Priority
}

export type CreateTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError,
  {
    ticket: Ticket
  }
>
