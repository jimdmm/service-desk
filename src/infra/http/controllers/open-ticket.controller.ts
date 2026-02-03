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
import { OpenTicketUseCase } from '@/domain/support/application/use-cases/open-ticket'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'

const openTicketBodySchema = z.object({
  clientId: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']).default('low'),
  attachmentsIds: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(openTicketBodySchema)

type OpenTicketBodySchema = z.infer<typeof openTicketBodySchema>

@Controller('/tickets')
export class OpenTicketController {
  constructor(private openTicket: OpenTicketUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: OpenTicketBodySchema) {
    const { clientId, title, description, priority, attachmentsIds } = body

    const result = await this.openTicket.execute({
      clientId,
      title,
      description,
      priority: Priority.create(priority),
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }

    return {
      ticketId: result.value.ticket.id.toString(),
    }
  }
}
