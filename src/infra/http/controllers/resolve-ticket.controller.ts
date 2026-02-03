import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { ResolveTicketUseCase } from '@/domain/support/application/use-cases/resolve-ticket'

@Controller('/tickets/:ticketId/resolve/technician/:technicianId')
export class ResolveTicketController {
  constructor(private resolveTicket: ResolveTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('technicianId') technicianId: string
  ) {
    const result = await this.resolveTicket.execute({
      ticketId,
      technicianId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
