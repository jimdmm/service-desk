import { ClientCommentStrategy } from "@/domain/support/application/strategies/client-comment-strategy"
import type { CommentCreationStrategy, CommentStrategyType } from "@/domain/support/application/strategies/comment-creation-strategy"
import { TechnicianCommentStrategy } from "@/domain/support/application/strategies/technician-comment-strategy"

export class MakeCommentStrategy {
  private static strategies = new Map<CommentStrategyType, CommentCreationStrategy>([
    ['client', new ClientCommentStrategy()],
    ['technician', new TechnicianCommentStrategy()]
  ])

  static getStrategy(type: CommentStrategyType): CommentCreationStrategy {
    const strategy = this.strategies.get(type)

    if (!strategy) {
      throw new Error(`Comment strategy '${type}' not found`)
    }

    return strategy
  }
}