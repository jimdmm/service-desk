import { left, right } from '@/core/either'
import { UniqueEntityId } from '@/core/unique-entity-id'
import type {
  CommentOnTicketUseCaseRequestDTO,
  CommentOnTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/comment-on-ticket-dto'
import { ResourceNotFoundError } from '@/domain/support/application/errors/resource-not-found-error'
import type {
  CommentRepository,
  TicketRepository,
} from '@/domain/support/application/repositories'
import { Comment } from '@/domain/support/enterprise/entities/comment'

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

    const ticketComment = Comment.create({
      ticketId: new UniqueEntityId(ticketId),
      authorId: new UniqueEntityId(authorId),
      content,
      authorType,
    })

    await this.commentRepository.create(ticketComment)

    return right({
      comment: ticketComment,
    })
  }
}
