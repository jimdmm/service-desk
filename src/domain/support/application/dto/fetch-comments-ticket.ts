import type { Either } from '@/core/either'
import type { Comment } from '@/domain/support/enterprise/entities/comment'

export interface FetchCommentsTicketUseCaseRequestDTO {
  ticketId: string
  page: number
}

export type FetchCommentsTicketUseCaseResponseDTO = Either<
  null,
  {
    comments: Comment[]
  }
>
