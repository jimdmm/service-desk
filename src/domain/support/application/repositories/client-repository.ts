import type { Client } from '@/domain/support/enterprise/entities/client'

export interface ClientRepository {
  create(client: Client): Promise<void>
  findById(id: string): Promise<Client | null>
  save(client: Client): Promise<void>
}
