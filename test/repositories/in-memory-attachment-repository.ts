import type { AttachmentRepository } from '@/domain/support/application/repositories/attachment-repository'
import type { Attatchment } from '@/domain/support/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attatchment[] = []

  async create(attachment: Attatchment): Promise<void> {
    this.items.push(attachment)
  }

  async findById(id: string): Promise<Attatchment | null> {
    const attachment = this.items.find(item => item.id.toString() === id)

    return attachment ?? null
  }
}
