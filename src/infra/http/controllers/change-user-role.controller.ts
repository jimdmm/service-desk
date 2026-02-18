import type { UserRole } from '@/domain/support/application/dto/change-user-role-dto'
import { ChangeUserRoleUseCase } from '@/domain/support/application/use-cases/change-user-role'
import { Roles } from '@/infra/auth/roles'
import { Body, Controller, Param, Patch } from '@nestjs/common'

export class ChangeUserRoleBodyDto {
  currentRole!: UserRole
  newRole!: UserRole
}

@Roles('ADMIN')
@Controller('/admin')
export class ChangeUserRoleController {
  constructor(private changeUserRole: ChangeUserRoleUseCase) {}

  @Patch('/users/:userId/role')
  async handle(
    @Param('userId') userId: string,
    @Body() body: ChangeUserRoleBodyDto
  ) {
    const { currentRole, newRole } = body

    const result = await this.changeUserRole.execute({
      userId,
      currentRole,
      newRole,
    })

    if (result.isLeft()) {
      throw result.value
    }

    const { user } = result.value

    return {
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: newRole,
        createdAt: user.createdAt,
        ...(newRole === 'TECHNICIAN' &&
          'maxConcurrentTickets' in user && {
            maxConcurrentTickets: user.maxConcurrentTickets,
          }),
      },
    }
  }
}
