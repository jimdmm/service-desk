import type { Technician } from '@/domain/support/enterprise/entities/technician'

export abstract class TechnicianRepository {
  abstract create(technician: Technician): Promise<void>
  abstract findById(id: string): Promise<Technician | null>
  abstract findByEmail(email: string): Promise<Technician | null>
  abstract save(technician: Technician): Promise<void>
}
