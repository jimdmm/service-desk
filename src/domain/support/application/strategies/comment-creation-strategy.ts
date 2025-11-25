import type { Comment } from '@/domain/support/enterprise/entities/comment'

export type CommentStrategyType = 'client' | 'technician'

export interface CommentCreationStrategy {
  execute(ticketId: string, authorId: string, content: string): Comment
}
