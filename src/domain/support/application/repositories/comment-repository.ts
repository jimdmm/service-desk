import type { Comment } from '@/domain/support/enterprise/entities/comment'

export interface CommentRepository {
  create(comment: Comment): Promise<void>
  findById(id: string): Promise<Comment | null>
  findManyByTicketId(ticketId: string): Promise<Comment[]>
  save(comment: Comment): Promise<void>
  delete(comment: Comment): Promise<void>
}
