import type { CommentRepository } from '@/domain/support/application/repositories/comment-repository'
import type { Comment } from '@/domain/support/enterprise/entities/comment'

export class InMemoryCommentRepository implements CommentRepository {
  public items: Map<string, Comment> = new Map()

  async create(comment: Comment): Promise<void> {
    this.items.set(comment.id.toString(), comment)
  }

  async findById(id: string): Promise<Comment | null> {
    return this.items.get(id) ?? null
  }

  async findManyByTicketId(ticketId: string, page: number): Promise<Comment[]> {
    const startIndex = (page - 1) * 20
    const endIndex = page * 20

    const comments = Array.from(this.items.values()).filter(
      comment => comment.ticketId.toString() === ticketId
    )

    return comments.slice(startIndex, endIndex)
  }

  async save(comment: Comment): Promise<void> {
    this.items.set(comment.id.toString(), comment)
  }

  async delete(comment: Comment): Promise<void> {
    this.items.delete(comment.id.toString())
  }
}
