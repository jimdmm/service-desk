import type { Technician } from "@/domain/support/enterprise/entities/technician";
import type { TechnicianRepository } from "@/domain/support/application/repositories/technician-repository";

export class InMemoryTechnicianRepository implements TechnicianRepository {
  public items: Map<string, Technician> = new Map()

  async create(technician: Technician): Promise<void> {
    this.items.set(technician.id.toString(), technician)
  }

  async findById(id: string): Promise<Technician | null> {
    return this.items.get(id) ?? null
  }

  async findByEmail(email: string): Promise<Technician | null> {
    return Array.from(this.items.values()).find(item => item.email === email) ?? null
  }

  async save(technician: Technician): Promise<void> {
    this.items.set(technician.id.toString(), technician)
  }
}