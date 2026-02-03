import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditTicketUseCase } from '@/domain/support/application/use-cases/edit-ticket'
import { Priority } from '@/domain/support/enterprise/value-objects/priority'

const editTicketBodySchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  attachmentsIds: z.array(z.string().uuid()).default([]),
})

const bodyValidationPipe = new ZodValidationPipe(editTicketBodySchema)

type EditTicketBodySchema = z.infer<typeof editTicketBodySchema>

@Controller('/tickets/:ticketId/client/:clientId')
export class EditTicketController {
  constructor(private editTicket: EditTicketUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('clientId') clientId: string,
    @Body(bodyValidationPipe) body: EditTicketBodySchema
  ) {
    const { title, description, priority, attachmentsIds } = body

    const result = await this.editTicket.execute({
      ticketId,
      clientId,
      title,
      description,
      priority: Priority.create(priority),
      attachmentsIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
