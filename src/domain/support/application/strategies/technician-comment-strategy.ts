import {UniqueEntityId} from '@/core/unique-entity-id'
import {Comment} from '@/domain/support/enterprise/entities/comment'
import type {CommentCreationStrategy} from './comment-creation-strategy'

export class TechnicianCommentStrategy implements CommentCreationStrategy {
  execute(ticketId: string, authorId: string, content: string): Comment {
    return Comment.create({
      ticketId: new UniqueEntityId(ticketId),
      authorId: new UniqueEntityId(authorId),
      content,
      authorType: 'TECHNICIAN',
    })
  }
}
