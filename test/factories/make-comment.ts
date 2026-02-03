import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Comment,
  type CommentProps,
} from '@/domain/support/enterprise/entities/comment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCommentMapper } from '@/infra/database/prisma/mappers/prisma-comment-mapper'
import { faker } from '@faker-js/faker'

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityId
) {
  const comment = Comment.create(
    {
      ticketId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.lines(2),
      authorType: 'CLIENT',
      ...override,
    },
    id
  )

  return comment
}

@Injectable()
export class CommentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaComment(data: Partial<CommentProps> = {}): Promise<Comment> {
    const comment = makeComment(data)

    await this.prisma.comment.create({
      data: PrismaCommentMapper.toPrisma(comment),
    })

    return comment
  }
}
