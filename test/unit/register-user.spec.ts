import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import { RegisterUserUseCase } from '@/domain/support/application/use-cases/register-user'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository'
import { InMemoryTechnicianRepository } from 'test/repositories/in-memory-technician-repository'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTechnicianRepository: InMemoryTechnicianRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Register User', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()
    fakeHasher = new FakeHasher()
    
    sut = new RegisterUserUseCase(
      inMemoryClientRepository,
      inMemoryTechnicianRepository,
      fakeHasher
    )
  })

  it('should be able to register a new client', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@doe.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: Array.from(inMemoryClientRepository.items.values())[0],
    })
    expect(Array.from(inMemoryClientRepository.items.values())[0].password).toBe('password123-hashed')
  })

  it('should not be able to register a user with same email as existing client', async () => {
    const email = 'john@doe.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: 'password123',
    })

    const result = await sut.execute({
      name: 'John Doe 2',
      email,
      password: 'password456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be able to register a user with same email as existing technician', async () => {
    const email = 'tech@example.com'

    // First create a technician directly in the repository
    const technician = await import('@/domain/support/enterprise/entities/technician')
      .then(module => module.Technician.create({
        name: 'Tech User',
        email,
        password: 'hashed-password',
      }))
    
    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      name: 'New User',
      email,
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})