import type { UseCaseError } from '@/core/errors/use-case-error'

export class ClientNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Client with ID "${identifier}" not found.`)
  }
}