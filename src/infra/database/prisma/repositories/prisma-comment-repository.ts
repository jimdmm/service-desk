import { Injectable } from '@nestjs/common'
import type { CommentRepository } from '@/domain/support/application/repositories/comment-repository'
import type { Comment } from '@/domain/support/enterprise/entities/comment'
import { PrismaService } from '../prisma.service'
import { PrismaCommentMapper } from '../mappers/prisma-comment-mapper'

@Injectable()
export class PrismaCommentRepository implements CommentRepository {
  constructor(private prisma: PrismaService) {}

  async create(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await this.prisma.comment.create({
      data,
    })
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    })

    if (!comment) {
      return null
    }

    return PrismaCommentMapper.toDomain(comment)
  }

  async findManyByTicketId(ticketId: string, page: number): Promise<Comment[]> {
    const comments = await this.prisma.comment.findMany({
      where: {
        ticketId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map(PrismaCommentMapper.toDomain)
  }

  async save(comment: Comment): Promise<void> {
    const data = PrismaCommentMapper.toPrisma(comment)

    await this.prisma.comment.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(comment: Comment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: comment.id.toString(),
      },
    })
  }
}
