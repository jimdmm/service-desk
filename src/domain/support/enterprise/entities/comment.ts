import type {Optional} from '@/core/@types/optional'
import {Entity} from '@/core/entity'
import type {UniqueEntityId} from '@/core/unique-entity-id'

export interface CommentProps {
  ticketId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
  authorType: 'CLIENT' | 'TECHNICIAN'
  createdAt: Date
  updatedAt?: Date
}

export class Comment extends Entity<CommentProps> {
  get ticketId() {
    return this.props.ticketId
  }

  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get authorType() {
    return this.props.authorType
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set content(content: string) {
    this.props.content = content
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const comment = new Comment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return comment
  }
}
