import type { Either } from '@/core/either'
import type { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type { CommentStrategyType } from '@/domain/support/application/strategies/comment-creation-strategy'
import type { Comment } from '@/domain/support/enterprise/entities/comment'

export type CommentOnTicketUseCaseRequestDTO = {
  ticketId: string
  authorId: string
  content: string
  authorType: CommentStrategyType
}

export type CommentOnTicketUseCaseResponseDTO = Either<
  ResourceNotFoundError | Error,
  {
    comment: Comment
  }
>
