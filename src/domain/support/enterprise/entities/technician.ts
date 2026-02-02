import type { Optional } from '@/core/@types/optional'
import { AggregateRoot } from '@/core/aggregate-root'
import type { UniqueEntityId } from '@/core/unique-entity-id'

export interface TechnicianProps {
  name: string
  email: string
  password: string
  maxConcurrentTickets: number
  ticketsAssigned: string[]
  createdAt: Date
}

export class Technician extends AggregateRoot<TechnicianProps> {
  static create(
    props: Optional<TechnicianProps, 'createdAt' | 'maxConcurrentTickets'>,
    id?: UniqueEntityId
  ) {
    const technician = new Technician(
      {
        maxConcurrentTickets: 3,
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return technician
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get ticketsAssigned() {
    return this.props.ticketsAssigned
  }

  get maxConcurrentTickets() {
    return this.props.maxConcurrentTickets
  }

  get createdAt() {
    return this.props.createdAt
  }

  canAssignNewTicket(): boolean {
    const qtyTicketsAssigned = this.props.ticketsAssigned.length
    const maxTicketsAllowed = this.props.maxConcurrentTickets

    return qtyTicketsAssigned < maxTicketsAllowed
  }

  assignToTicket(ticketId: string) {
    this.props.ticketsAssigned.push(ticketId)
  }

  unassignToTicket(ticketId: string) {
    const qtyTicketsAssigned = this.props.ticketsAssigned.length

    if (qtyTicketsAssigned === 0) {
      return false;
    }

    const ticketIndex = this.props.ticketsAssigned.findIndex(
      id => id === ticketId
    )

    if (ticketIndex !== -1) {
      this.props.ticketsAssigned.splice(ticketIndex, 1)
    }
  }
}
