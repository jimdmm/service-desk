import { ValueObject } from "@/core/value-object";

export type PriorityLevel = 'low' | 'medium' | 'high';

export interface PriorityProps {
  value: PriorityLevel;
}

export class Priority extends ValueObject<PriorityProps> {
  static create(value: PriorityLevel): Priority {
    return new Priority({ value });
  }

  get value(): PriorityLevel {
    return this.props.value;
  }
}