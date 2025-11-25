import type { Technician } from '@/domain/support/enterprise/entities/technician'

export interface TechnicianRepository {
  create(technician: Technician): Promise<void>
  findById(id: string): Promise<Technician | null>
  save(technician: Technician): Promise<void>
}
