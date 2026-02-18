import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import { UserNotFoundError } from '@/domain/support/application/errors/user-not-found-error'
import { ChangeUserRoleUseCase } from '@/domain/support/application/use-cases/change-user-role'
import { makeClient } from 'test/factories/make-client'
import { makeTechnician } from 'test/factories/make-technician'
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository'
import { InMemoryTechnicianRepository } from 'test/repositories/in-memory-technician-repository'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTechnicianRepository: InMemoryTechnicianRepository
let sut: ChangeUserRoleUseCase

describe('Change User Role', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()

    sut = new ChangeUserRoleUseCase(
      inMemoryClientRepository,
      inMemoryTechnicianRepository
    )
  })

  it('should be able to promote a client to technician', async () => {
    const client = makeClient({
      name: 'John Doe',
      email: 'john@doe.com',
    })

    await inMemoryClientRepository.create(client)

    const result = await sut.execute({
      userId: client.id.toString(),
      currentRole: 'CLIENT',
      newRole: 'TECHNICIAN',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('John Doe')
      expect(result.value.user.email).toBe('john@doe.com')
      expect(result.value.user.password).toBe(client.password)
    }
    expect(
      Array.from(inMemoryTechnicianRepository.items.values())
    ).toHaveLength(1)
  })

  it('should be able to demote a technician to client', async () => {
    const technician = makeTechnician({
      name: 'Jane Tech',
      email: 'jane@tech.com',
    })

    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      userId: technician.id.toString(),
      currentRole: 'TECHNICIAN',
      newRole: 'CLIENT',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('Jane Tech')
      expect(result.value.user.email).toBe('jane@tech.com')
      expect(result.value.user.password).toBe(technician.password)
    }
    expect(Array.from(inMemoryClientRepository.items.values())).toHaveLength(1)
  })

  it('should return the same user if current and new roles are the same', async () => {
    const client = makeClient({
      name: 'John Doe',
      email: 'john@doe.com',
    })

    await inMemoryClientRepository.create(client)

    const result = await sut.execute({
      userId: client.id.toString(),
      currentRole: 'CLIENT',
      newRole: 'CLIENT',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toBe(client)
    }
  })

  it('should not be able to change role of a non-existent user', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      currentRole: 'CLIENT',
      newRole: 'TECHNICIAN',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })

  it('should not be able to change role if user with same email already exists in target role', async () => {
    const client = makeClient({
      name: 'John Doe',
      email: 'john@doe.com',
    })

    const technician = makeTechnician({
      name: 'Jane Tech',
      email: 'john@doe.com', // Same email
    })

    await inMemoryClientRepository.create(client)
    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      userId: client.id.toString(),
      currentRole: 'CLIENT',
      newRole: 'TECHNICIAN',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
