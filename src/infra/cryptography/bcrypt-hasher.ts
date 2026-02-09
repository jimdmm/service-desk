import { Injectable } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { HashGenerator } from '@/domain/support/application/cryptography/hash-generator'

@Injectable()
export class BcryptHasher implements HashGenerator {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
}