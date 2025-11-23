import type { Optional } from "@/core/@types/optional";
import { AggregateRoot } from "@/core/aggregate-root";
import type { UniqueEntityId } from "@/core/unique-entity-id";
import { Priority } from "@/domain/support/enterprise/value-objects/priority";
import { Status } from "@/domain/support/enterprise/value-objects/status";

export interface TicketProps {
  title: string
  description: string
  priority: Priority
  openedBy: UniqueEntityId
  status?: Status
  assignedBy?: UniqueEntityId | null
  createdAt: Date
  updatedAt?: Date
}

export class Ticket extends AggregateRoot<TicketProps> {
  static create(
    props: Optional<TicketProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const ticket = new Ticket(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return ticket
  }


  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status ?? Status.create("OPEN")
  }

  get priority() {
    return this.props.priority ?? Priority.create("low")
  }

  get openedBy() {
    return this.props.openedBy
  }

  get assignedBy() {
    return this.props.assignedBy
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.touch()
  }

  set priority(priority: Priority) {
    this.props.priority = priority
    this.touch()
  }

  set status(status: Status) {
    this.props.status = status
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  assignTo(technicianId: UniqueEntityId): void {
    this.props.assignedBy = technicianId
    this.props.status = Status.create('ASSIGNED');
    this.touch()
  }

  unassign(status: Status): void {
    this.props.assignedBy = undefined
    this.props.status = status
    this.touch()
  }
}
