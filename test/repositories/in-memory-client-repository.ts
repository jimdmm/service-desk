import type { ClientRepository } from '@/domain/support/application/repositories/client-repository'
import type { Client } from '@/domain/support/enterprise/entities/client'

export class InMemoryClientRepository implements ClientRepository {
  public items: Map<string, Client> = new Map()

  async create(client: Client): Promise<void> {
    this.items.set(client.id.toString(), client)
  }

  async findById(id: string): Promise<Client | null> {
    return this.items.get(id) ?? null
  }

  async save(client: Client): Promise<void> {
    this.items.set(client.id.toString(), client)
  }
}
