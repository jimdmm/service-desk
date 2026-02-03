import type { Comment } from '@/domain/support/enterprise/entities/comment'

export abstract class CommentRepository {
  abstract create(comment: Comment): Promise<void>
  abstract findById(id: string): Promise<Comment | null>
  abstract findManyByTicketId(
    ticketId: string,
    page: number
  ): Promise<Comment[]>
  abstract save(comment: Comment): Promise<void>
  abstract delete(comment: Comment): Promise<void>
}
