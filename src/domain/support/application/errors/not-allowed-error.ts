import {UseCaseError} from '@/core/errors/use-case-error'

export class NotAllowedError extends UseCaseError {
  constructor(message = 'Not Allowed Error') {
    super(message)
  }
}
