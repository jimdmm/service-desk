import { ClientNotFoundError } from '@/domain/support/application/errors/client-not-found-error'
import { UserAlreadyExistsError } from '@/domain/support/application/errors/user-already-exists-error'
import { PromoteClientToTechnicianUseCase } from '@/domain/support/application/use-cases/promote-client-to-technician'
import { makeClient } from 'test/factories/make-client'
import { makeTechnician } from 'test/factories/make-technician'
import { InMemoryClientRepository } from 'test/repositories/in-memory-client-repository'
import { InMemoryTechnicianRepository } from 'test/repositories/in-memory-technician-repository'

let inMemoryClientRepository: InMemoryClientRepository
let inMemoryTechnicianRepository: InMemoryTechnicianRepository
let sut: PromoteClientToTechnicianUseCase

describe('Promote Client to Technician', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    inMemoryTechnicianRepository = new InMemoryTechnicianRepository()
    
    sut = new PromoteClientToTechnicianUseCase(
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
      clientId: client.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.technician.name).toBe('John Doe')
      expect(result.value.technician.email).toBe('john@doe.com')
      expect(result.value.technician.password).toBe(client.password)
    }
    expect(Array.from(inMemoryTechnicianRepository.items.values())).toHaveLength(1)
  })

  it('should not be able to promote a non-existent client', async () => {
    const result = await sut.execute({
      clientId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNotFoundError)
  })

  it('should not be able to promote a client if technician with same email already exists', async () => {
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
      clientId: client.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})