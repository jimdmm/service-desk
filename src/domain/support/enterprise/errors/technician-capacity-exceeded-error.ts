import { UseCaseError } from '@/core/errors/use-case-error'

export class TechnicianCapacityExceededError extends UseCaseError {
  constructor() {
    super('The technician has reached the maximum capacity of assigned tickets.')
  }
}