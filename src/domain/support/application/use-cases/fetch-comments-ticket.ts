import { Injectable } from '@nestjs/common'
import { right } from '@/core/either'
import type {
  FetchCommentsTicketUseCaseRequestDTO,
  FetchCommentsTicketUseCaseResponseDTO,
} from '@/domain/support/application/dto/fetch-comments-ticket'
import { CommentRepository } from '@/domain/support/application/repositories'

@Injectable()
export class FetchCommentsTicketUseCase {
  constructor(private commentRepository: CommentRepository) {}

  async execute({
    ticketId,
    page,
  }: FetchCommentsTicketUseCaseRequestDTO): Promise<FetchCommentsTicketUseCaseResponseDTO> {
    const comments = await this.commentRepository.findManyByTicketId(
      ticketId,
      page
    )

    return right({
      comments,
    })
  }
}
