import { RegisterUserUseCase } from '@/domain/support/application/use-cases/register-user'
import { Public } from '@/infra/auth/public'
import { Body, Controller, Post } from '@nestjs/common'

export class RegisterUserBodyDto {
  name!: string
  email!: string
  password!: string
}

@Public()
@Controller('/users')
export class RegisterUserController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post('/register')
  async handle(@Body() body: RegisterUserBodyDto) {
    const { name, email, password } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
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
        createdAt: user.createdAt,
      },
    }
  }
}
