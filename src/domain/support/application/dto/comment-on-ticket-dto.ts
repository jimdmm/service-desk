import type { Either } from '@/core/either'
import type { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type { Comment } from '@/domain/support/enterprise/entities/comment'

type AuthorType = 'CLIENT' | 'TECHNICIAN'

export type CommentOnTicketUseCaseRequestDTO = {
  ticketId: string
  authorId: string
  content: string
  authorType: AuthorType
}

export type CommentOnTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError | Error,
  {
    comment: Comment
  }
>
