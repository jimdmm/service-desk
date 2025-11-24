import type {Optional} from '@/core/@types/optional'
import {AggregateRoot} from '@/core/aggregate-root'
import type {UniqueEntityId} from '@/core/unique-entity-id'

export interface ClientProps {
  name: string
  email: string
  createdAt: Date
}

export class Client extends AggregateRoot<ClientProps> {
  static create(
    props: Optional<ClientProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return client
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get createdAt() {
    return this.props.createdAt
  }
}
