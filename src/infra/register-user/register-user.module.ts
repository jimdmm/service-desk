import { RegisterUserUseCase } from '@/domain/support/application/use-cases/register-user'
import { Module } from '@nestjs/common'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  providers: [RegisterUserUseCase],
  exports: [RegisterUserUseCase],
})
export class RegisterUserModule {}