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
import { CommentOnTicketUseCase } from '@/domain/support/application/use-cases/comment-on-ticket'

const commentOnTicketBodySchema = z.object({
  authorId: z.string().uuid(),
  content: z.string(),
  authorType: z.enum(['CLIENT', 'TECHNICIAN']),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnTicketBodySchema)

type CommentOnTicketBodySchema = z.infer<typeof commentOnTicketBodySchema>

@Controller('/tickets/:ticketId/comments')
export class CommentOnTicketController {
  constructor(private commentOnTicket: CommentOnTicketUseCase) {}

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

    return {
      commentId: result.value.comment.id.toString(),
    }
  }
}
