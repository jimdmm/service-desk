import { CommentOnTicketUseCase } from '@/domain/support/application/use-cases/comment-on-ticket'
import { Roles } from '@/infra/auth/roles'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const commentOnTicketBodySchema = z.object({
  authorId: z.string().uuid(),
  content: z.string(),
  authorType: z.enum(['CLIENT', 'TECHNICIAN']),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnTicketBodySchema)

type CommentOnTicketBodySchema = z.infer<typeof commentOnTicketBodySchema>

@Roles('CLIENT', 'TECHNICIAN')
@Controller('/tickets/:ticketId/comments')
export class CommentOnTicketController {
  constructor(
    private commentOnTicket: CommentOnTicketUseCase,
    private cache: RedisCacheService
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Param('ticketId') ticketId: string,
    @Body(bodyValidationPipe) body: CommentOnTicketBodySchema
  ) {
    const { authorId, content, authorType } = body

    const result = await this.commentOnTicket.execute({
      ticketId,
      authorId,
      content,
      authorType,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    await this.cache.delByPattern(`comments:${ticketId}:*`)

    return {
      commentId: result.value.comment.id.toString(),
    }
  }
}
