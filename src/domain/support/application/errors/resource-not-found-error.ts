import { UseCaseError } from "@/core/errors/use-case-error";

export class ResourceNotFoundError extends UseCaseError {
  constructor(resource = 'Resource') {
    super(`${resource} Not Found`)
  }
}
