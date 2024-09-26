import { makeJamRoutes } from '../src/routes/jams'
import { describe, expect, test } from 'bun:test'
import { authorizeUser } from './util'
import { treaty } from '@elysiajs/eden'

const jamServer = makeJamRoutes(authorizeUser('testUser'))
const client = treaty(jamServer)

let testJamId

describe('jam behavior', () => {
  test('create', async () => {
    const { data } = await client.jams.post({
      title: 'test jam',
      durationMs: 1000 * 60 * 60,
    })
    expect(data).not.toBe(null)
    expect(data?.id.length).toBe(5)
    testJamId = data?.id
  })
  test('jam data', async () => {
    const { data } = await client.jams.get()
    expect(data).not.toBe(null)
    expect(data?.length).toBe(1)
    const jam = data?.[0]
    expect(jam?.title).toBe('test jam')
    expect(jam?.ownerId).toBe('testUser')
    expect(jam?.JamParticipant.length).toBe(1)
    expect(jam?.id).toBe(testJamId)
    const creator = jam?.JamParticipant?.[0]
    expect(creator?.active).toBe(true)
    expect(creator?.userId).toBe('testUser')
  })
  test('get jam', async () => {
    const { data } = await client.jams({ id: testJamId }).get()
    expect(data).not.toBe(null)
    expect(data?.id).toBe(testJamId)
  })

  test('leave jam', async () => {
    const { data } = await client.jams({ id: testJamId }).get()
    expect(data?.JamParticipant.length).toBe(1)
    await client.jams({ id: testJamId }).leave.delete()
    const { data: leaveData } = await client.jams({ id: testJamId }).get()
    expect(leaveData?.JamParticipant.length).toBe(0)
  })

  test('join jam', async () => {
    await client.jams({ id: testJamId }).join.post()
    const { data } = await client.jams({ id: testJamId }).get()
    expect(data?.JamParticipant.length).toBe(1)
  })
})
