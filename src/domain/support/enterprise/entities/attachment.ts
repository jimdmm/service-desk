import { Entity } from '@/core/entity'
import type { UniqueEntityId } from '@/core/unique-entity-id'

interface AttachmentProps {
  title: string
  link: string
}

export class Attatchment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title
  }

  get link() {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityId) {
    const attachment = new Attatchment(props, id)

    return attachment
  }
}
