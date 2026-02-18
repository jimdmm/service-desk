import { WrongCredentialsError } from '@/domain/support/application/errors/wrong-credentials-error'
import { AuthenticateUserUseCase } from '@/domain/support/application/use-cases/authenticate-user'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeClient } from 'test/factories/make-client'
import { makeTechnician } from 'test/factories/make-technician'
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository'
import { InMemoryTechnicianRepository } from 'test/repositories/in-memory-technician-repository'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTechnicianRepository: InMemoryTechnicianRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateUserUseCase(
      inMemoryClientRepository,
      inMemoryTechnicianRepository,
      fakeHasher,
      fakeEncrypter
    )
  })

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      email: 'john@doe.com',
      password: 'password123-hashed',
    })

    await inMemoryClientRepository.create(client)

    const result = await sut.execute({
      email: 'john@doe.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })

    if (result.isRight()) {
      const payload = JSON.parse(result.value.accessToken)
      expect(payload.sub).toBe(client.id.toString())
      expect(payload.role).toBe('CLIENT')
    }
  })

  it('should be able to authenticate a technician', async () => {
    const technician = makeTechnician({
      email: 'tech@example.com',
      password: 'password123-hashed',
    })

    await inMemoryTechnicianRepository.create(technician)

    const result = await sut.execute({
      email: 'tech@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })

    if (result.isRight()) {
      const payload = JSON.parse(result.value.accessToken)
      expect(payload.sub).toBe(technician.id.toString())
      expect(payload.role).toBe('TECHNICIAN')
    }
  })

  it('should not be able to authenticate with wrong email', async () => {
    const result = await sut.execute({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const client = makeClient({
      email: 'john@doe.com',
      password: 'password123-hashed',
    })

    await inMemoryClientRepository.create(client)

    const result = await sut.execute({
      email: 'john@doe.com',
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
