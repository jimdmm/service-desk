import { WrongCredentialsError } from '@/domain/support/application/errors/wrong-credentials-error'
import { AuthenticateUserUseCase } from '@/domain/support/application/use-cases/authenticate-user'
import { Public } from '@/infra/auth/public'
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = authenticateBodySchema.parse(body)

    const result = await this.authenticateUser.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      if (error instanceof WrongCredentialsError) {
        throw new UnauthorizedException(error.message)
      }

      throw error
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
