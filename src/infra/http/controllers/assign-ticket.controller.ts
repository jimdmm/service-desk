import { AssignTicketUseCase } from '@/domain/support/application/use-cases/assign-ticket'
import { Roles } from '@/infra/auth/roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Roles('TECHNICIAN')
@Controller('/tickets/:ticketId/assign/technician/:technicianId')
export class AssignTicketController {
  constructor(private assignTicket: AssignTicketUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Param('ticketId') ticketId: string,
    @Param('technicianId') technicianId: string
  ) {
    const result = await this.assignTicket.execute({
      ticketId,
      technicianId,
    })

    if (result.isLeft()) {
      throw new BadRequestException(result.value.message)
    }
  }
}
