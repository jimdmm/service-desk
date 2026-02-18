import { DeleteTicketUseCase } from '@/domain/support/application/use-cases/delete-ticket'
import { Roles } from '@/infra/auth/roles'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Roles('CLIENT')
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
