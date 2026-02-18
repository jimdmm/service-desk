import { UnassignTicketUseCase } from '@/domain/support/application/use-cases/unassign-ticket'
import { Roles } from '@/infra/auth/roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Roles('TECHNICIAN')
@Controller('/tickets/:ticketId/unassign/technician/:technicianId')
export class UnassignTicketController {
  constructor(private unassignTicket: UnassignTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('technicianId') technicianId: string
  ) {
    const result = await this.unassignTicket.execute({
      ticketId,
      technicianId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
