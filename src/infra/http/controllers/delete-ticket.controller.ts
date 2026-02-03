import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeleteTicketUseCase } from '@/domain/support/application/use-cases/delete-ticket'

const deleteTicketParamsSchema = z.object({
  ticketId: z.string().uuid(),
  clientId: z.string().uuid(),
})

const paramsValidationPipe = new ZodValidationPipe(deleteTicketParamsSchema)

type DeleteTicketParamsSchema = z.infer<typeof deleteTicketParamsSchema>

@Controller('/tickets/:ticketId/client/:clientId')
export class DeleteTicketController {
  constructor(private deleteTicket: DeleteTicketUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('clientId') clientId: string
  ) {
    const result = await this.deleteTicket.execute({
      ticketId,
      clientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
