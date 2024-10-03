import { makeJamRoutes } from '../src/routes/jams'
import { describe, expect, test } from 'bun:test'
import { authorizeUser } from './util'
import { treaty } from '@elysiajs/eden'

//-- defined in test.db seed 
const OWNER_ID = 'testUserOwner'
const PARTICIPANT_ID = 'testUserParticipant'
//--
const ownerServer = makeJamRoutes(authorizeUser(OWNER_ID))
const ownerClient = treaty(ownerServer)
const participantServer = makeJamRoutes(authorizeUser(PARTICIPANT_ID))
const participantClient = treaty(participantServer)

let testJamId

describe('jam behavior', () => {
  // test('post to jam', async () => {
  //   const { data } = await ownerClient.jams.post({
  //     title: 'test jam',
  //     durationMs: 1000 * 60 * 60,
  //   })
  //   expect(data).not.toBe(null)
  //   await participantClient.

  // })
  test('create', async () => {
    const { data } = await ownerClient.jams.post({
      title: 'test jam',
      durationMs: 1000 * 60 * 60,
    })
    expect(data).not.toBe(null)
    expect(data?.id.length).toBe(5)
    testJamId = data?.id
  })

  test('jam data', async () => {
    const { data } = await ownerClient.jams.get({query: { userId: OWNER_ID }})
    expect(data).not.toBe(null)
    expect(data?.length).toBe(1)
    const jam = data?.[0]
    expect(jam?.title).toBe('test jam')
    expect(jam?.ownerId).toBe(OWNER_ID)
    expect(jam?.id).toBe(testJamId)
  })

  test('get jam', async () => {
    const { data } = await ownerClient.jams({ id: testJamId }).get()
    expect(data).not.toBe(null)
    expect(data?.id).toBe(testJamId)
    expect(data?.Post.length).toBe(0)
  })

  test('owner active jam', async() => { 
    const { data } = await ownerClient.jams.activeJam.get()
    expect(data).not.toBe(null)
    expect(data?.id).toBe(testJamId)
  })

  test('leave jam', async () => {
    const { data } = await ownerClient.jams({ id: testJamId }).get()
    expect(data?._count.JamParticipant).toBe(1)
    await ownerClient.jams({ id: testJamId }).leave.post()
    const { data: leaveData } = await ownerClient.jams({ id: testJamId }).get()
    expect(leaveData?._count.JamParticipant).toBe(1) // owner cannot leave jam
  })


  test('join jam', async () => {
    const data = await participantClient.jams({id: testJamId}).join.post()
    expect(data.error).toBe(null)
    // expect(data).not.toBe(null)
    // expect(data?._count.JamParticipant).toBe(2)
    
  })

  // test('jam abuse', async () => {
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   const { data: active } = await ownerClient.jams.activeJam.get()
  //   expect(active?.jam.id).toBe(testJamId)
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   const { data } = await ownerClient.jams({ id: testJamId }).get()
  //   expect(data?.JamParticipant.length).toBe(1)
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   const { data: d } = await ownerClient.jams({ id: testJamId }).get()
  //   const { data: active1 } = await ownerClient.jams.activeJam.get()
  //   expect(active1).toBe(null)
  //   expect(d?.JamParticipant.length).toBe(0)
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()
  //   await ownerClient.jams({ id: testJamId }).leave.delete()

  //   const { data: active2 } = await ownerClient.jams.activeJam.get()
  //   expect(active2).toBe(null)
  //   expect(d?.JamParticipant.length).toBe(0)

  //   const { data: l } = await ownerClient.jams({ id: testJamId }).get()
  //   expect(l?.JamParticipant.length).toBe(0)

  //   await ownerClient.jams({ id: testJamId }).join.post()
  //   const { data: active3 } = await ownerClient.jams.activeJam.get()

  //   const { data: asdf } = await ownerClient.jams({ id: testJamId }).get()
  //   expect(active3?.jam.id).toBe(testJamId)
  //   expect(asdf?.JamParticipant.length).toBe(1)

  //   const { data: j } = await ownerClient.jams({ id: testJamId }).get()
  //   expect(j?.JamParticipant.length).toBe(1)
  // })

  // test('multijam', async () => {
  //   // create jam if not a participant in another active jam
  //   // leave jam
  //   // can't leave if jam is active and if owner
  //   // fail to join if participant in a different jam
  // })
})
