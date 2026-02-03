import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { CloseTicketUseCase } from '@/domain/support/application/use-cases/close-ticket'

@Controller('/tickets/:ticketId/close/client/:clientId')
export class CloseTicketController {
  constructor(private closeTicket: CloseTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('clientId') clientId: string
  ) {
    const result = await this.closeTicket.execute({
      ticketId,
      clientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
