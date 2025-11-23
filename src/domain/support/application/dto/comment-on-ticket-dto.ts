import type { Either } from "@/core/either"
import type { ResourceNotFoundError } from "@/domain/support/application/errors/resource-not-found-error"
import type { CommentStrategyType } from "@/domain/support/application/strategies/comment-creation-strategy"

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
