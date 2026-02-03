import type { Client } from '@/domain/support/enterprise/entities/client'

export abstract class ClientRepository {
  abstract create(client: Client): Promise<void>
  abstract findById(id: string): Promise<Client | null>
  abstract findByEmail(email: string): Promise<Client | null>
  abstract save(client: Client): Promise<void>
}
