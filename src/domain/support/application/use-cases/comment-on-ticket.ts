import {left, right} from '@/core/either'
import type {
  CommentOnTicketUseCaseRequestDTO,
  CommentOnTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/comment-on-ticket-dto'
import {ResourceNotFoundError} from '@/domain/support/application/errors/resource-not-found-error'
import {MakeCommentStrategy} from '@/domain/support/application/factories/make-comment-strategy'
import type {
  CommentRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'

export class CommentOnTicketUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private ticketRepository: TicketRepository
  ) {}

  async execute({
    ticketId,
    authorId,
    content,
    authorType,
  }: CommentOnTicketUseCaseRequestDTO): Promise<CommentOnTicketUseCaseResponseDTO> {
    const ticket = await this.ticketRepository.findById(ticketId)

    if (!ticket) {
      return left(new ResourceNotFoundError('Ticket'))
    }

    try {
      const strategy = MakeCommentStrategy.getStrategy(authorType)
      const ticketComment = strategy.execute(ticketId, authorId, content)

      await this.commentRepository.create(ticketComment)

      return right({
        comment: ticketComment,
      })
    } catch (error) {
      return left(error as Error)
    }
  }
}
