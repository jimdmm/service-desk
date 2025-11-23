export abstract class UseCaseError extends Error {
  public readonly message: string

  constructor(message: string) {
    super(message)
    this.message = message
    this.name = this.constructor.name
  }
}