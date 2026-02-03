import type {
  Comment as PrismaComment,
  AuthorType,
  Prisma,
} from '@prisma/client'
import { UniqueEntityId } from '@/core/unique-entity-id'
import { Comment } from '@/domain/support/enterprise/entities/comment'

export class PrismaCommentMapper {
  static toDomain(raw: PrismaComment): Comment {
    const authorId =
      raw.authorType === 'CLIENT' ? raw.clientId : raw.technicianId

    if (!authorId) {
      throw new Error('Comment must have an author')
    }

    return Comment.create(
      {
        ticketId: new UniqueEntityId(raw.ticketId),
        authorId: new UniqueEntityId(authorId),
        content: raw.content,
        authorType: raw.authorType,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt ?? undefined,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(comment: Comment): Prisma.CommentUncheckedCreateInput {
    return {
      id: comment.id.toString(),
      ticketId: comment.ticketId.toString(),
      content: comment.content,
      authorType: comment.authorType as AuthorType,
      clientId:
        comment.authorType === 'CLIENT' ? comment.authorId.toString() : null,
      technicianId:
        comment.authorType === 'TECHNICIAN'
          ? comment.authorId.toString()
          : null,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    }
  }
}
