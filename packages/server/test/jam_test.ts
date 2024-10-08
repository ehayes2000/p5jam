import { makeJamRoutes } from '../src/routes/jams'
import { describe, expect, test, beforeAll, afterAll } from 'bun:test'
import { authorizeUser, unauthorizeUser } from './util'
import { treaty } from '@elysiajs/eden'
import { TJam } from '../src/services/primitives/types'

// Constants for test users
const OWNER_ID = 'testUserOwner'
const PARTICIPANT_ID = 'testUserParticipant'

// Create server and client instances for owner and participant
const authUser = authorizeUser(OWNER_ID)
const ownerServer = makeJamRoutes(authUser)
const ownerClient = treaty(ownerServer)
const participantServer = makeJamRoutes(authorizeUser(PARTICIPANT_ID))
const participantClient = treaty(participantServer)

describe('Jam Routes Integration Tests', () => {
  let createdJamId: string

  beforeAll(async () => {
    // Set up any necessary test data or environment
  })

  afterAll(async () => {
    // Clean up any test data or environment
  })

  test('POST /jams - Create a new jam', async () => {
    const response = await ownerClient.jams.post({
      title: 'Test Jam',
      durationMs: 3600000, // 1 hour
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('id')
    expect(response.data?.title).toBe('Test Jam')
    expect(response.data?.ownerId).toBe(OWNER_ID)

    createdJamId = response.data?.id!
  })

  test('GET /jams/:id - Retrieve a specific jam', async () => {
    const response = await ownerClient.jams[createdJamId].get()

    expect(response.status).toBe(200)
    expect(response.data.id).toBe(createdJamId)
    expect(response.data.title).toBe('Test Jam')
    expect(response.data.ownerId).toBe(OWNER_ID)
  })

  test('GET /jams - List jams for owner', async () => {
    const response = await ownerClient.jams.get({ query: { userId: OWNER_ID } })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('owner')
    expect(response.data).toHaveProperty('participant')
    expect(response.data?.owner).toBeInstanceOf(Array)
    expect(response.data?.participant).toBeInstanceOf(Array)
    expect(
      response.data?.owner.some((jam: TJam) => jam.id === createdJamId),
    ).toBe(true)
  })

  test('GET /jams - List jams for participant', async () => {
    const response = await participantClient.jams.get({
      query: { userId: PARTICIPANT_ID },
    })

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('owner')
    expect(response.data).toHaveProperty('participant')
    expect(response.data?.owner).toBeInstanceOf(Array)
    expect(response.data?.participant).toBeInstanceOf(Array)
    expect(response.data?.owner.length).toBe(0) // Participant shouldn't own any jams
  })

  test('POST /jams - Unauthorized user cannot create a jam', async () => {
    const unauthorizedServer = makeJamRoutes(unauthorizeUser())
    const unauthorizedClient = treaty(unauthorizedServer)

    const response = await unauthorizedClient.jams.post({
      title: 'Unauthorized Jam',
      durationMs: 3600000,
    })

    expect(response.status).toBe(401)
  })

  test('GET /jams/:id - Non-existent jam returns 404', async () => {
    const response = await ownerClient.jams['NONEXISTENT'].get()

    expect(response.status).toBe(404)
  })
})
