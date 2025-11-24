import {UniqueEntityId} from '@/core/unique-entity-id'
import {Comment} from '@/domain/support/enterprise/entities/comment'
import {faker} from '@faker-js/faker'

interface MakeCommentProps {
  ticketId: UniqueEntityId
  authorId: UniqueEntityId
  content: string
}

export function makeComment(
  override: Partial<MakeCommentProps> = {},
  id?: UniqueEntityId
) {
  const comment = Comment.create(
    {
      ticketId: new UniqueEntityId(),
      authorId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    id
  )

  return comment
}
