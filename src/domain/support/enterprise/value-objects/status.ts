import { ValueObject } from "@/core/value-object";

export type StatusLevel = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface StatusProps {
  value: StatusLevel;
}

export class Status extends ValueObject<StatusProps> {
  get value(): StatusLevel {
    return this.props.value;
  }

  static create(value: StatusLevel): Status {
    return new Status({ value });
  }

  canTransitionTo(newStatus: Status): boolean {
    const currentStatus = this.props.value;
    const targetStatus = newStatus.value;

    const validTransitions: Record<StatusLevel, StatusLevel[]> = {
      OPEN: ['ASSIGNED'],
      ASSIGNED: ['IN_PROGRESS', 'OPEN'],
      IN_PROGRESS: ['RESOLVED'],
      RESOLVED: ['CLOSED'],
      CLOSED: []
    };

    return validTransitions[currentStatus].includes(targetStatus);
  }
}