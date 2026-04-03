import { FetchCommentsTicketUseCase } from '@/domain/support/application/use-cases/fetch-comments-ticket'
import { Public } from '@/infra/auth/public'
import { RedisCacheService } from '@/infra/cache/redis-cache.service'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Public()
@Controller('/tickets/:ticketId/comments')
export class FetchCommentsTicketController {
  constructor(
    private fetchCommentsTicket: FetchCommentsTicketUseCase,
    private cache: RedisCacheService
  ) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param('ticketId') ticketId: string,
    @Query('page', queryValidationPipe) page: PageQueryParamSchema
  ) {
    const cacheKey = `comments:${ticketId}:page:${page}`

    const cached = await this.cache.get(cacheKey)

    if (cached) {
      return cached
    }

    const result = await this.fetchCommentsTicket.execute({
      ticketId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const response = {
      comments: result.value.comments.map(comment => ({
        id: comment.id.toString(),
        content: comment.content,
        authorId: comment.authorId.toString(),
        authorType: comment.authorType,
        createdAt: comment.createdAt,
      })),
    }

    await this.cache.set(cacheKey, response, 60)

    return response
  }
}
