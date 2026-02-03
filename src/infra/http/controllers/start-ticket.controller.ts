import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { StartTicketUseCase } from '@/domain/support/application/use-cases/start-ticket'

@Controller('/tickets/:ticketId/start/technician/:technicianId')
export class StartTicketController {
  constructor(private startTicket: StartTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('technicianId') technicianId: string
  ) {
    const result = await this.startTicket.execute({
      ticketId,
      technicianId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
