import { PromoteClientToTechnicianUseCase } from '@/domain/support/application/use-cases/promote-client-to-technician'
import { Controller, Param, Post } from '@nestjs/common'

@Controller('/admin')
export class PromoteClientToTechnicianController {
  constructor(
    private promoteClientToTechnician: PromoteClientToTechnicianUseCase
  ) {}

  @Post('/clients/:clientId/promote-to-technician')
  async handle(@Param('clientId') clientId: string) {
    const result = await this.promoteClientToTechnician.execute({
      clientId,
    })

    if (result.isLeft()) {
      throw result.value
    }

    const { technician } = result.value

    return {
      technician: {
        id: technician.id.toString(),
        name: technician.name,
        email: technician.email,
        maxConcurrentTickets: technician.maxConcurrentTickets,
        createdAt: technician.createdAt,
      },
    }
  }
}
