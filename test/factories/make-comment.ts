import { UniqueEntityId } from '@/core/unique-entity-id'
import {
  Comment,
  type CommentProps,
} from '@/domain/support/enterprise/entities/comment'
import { faker } from '@faker-js/faker'

export function makeComment(
  override: Partial<CommentProps> = {},
  id?: UniqueEntityId
) {
  const comment = Comment.create(
    {
      ticketId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.lines(2),
      authorType: 'CLIENT',
      ...override,
    },
    id
  )

  return comment
}
