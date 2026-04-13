import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import { RegisterUserUseCase } from '@/domain/support/application/use-cases/register-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'

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
      const error = result.value

      if (error instanceof UserAlreadyExistsError) {
        throw new ConflictException(error.message)
      }

      throw new BadRequestException(error.message)
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
