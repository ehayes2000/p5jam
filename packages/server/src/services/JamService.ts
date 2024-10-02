import jamPrimatives from './primatives/jams'
export default class JamService {
  constructor() {}

  async get(id: string) {
    return await jamPrimatives.getJam({ id })
  }

  async list(params: { userId?: string }) {
    return await jamPrimatives.getJams({ filters: { userId: params.userId } })
  }

  async create(params: { title: string; durationMs: number; userId: string }) {
    const jamIdParticipant = await jamPrimatives.getUserActiveJam({
      userId: params.userId,
    })
    if (jamIdParticipant) throw new Error('Already a participant')
    const { id } = await jamPrimatives.createJam(params)
    const jam = await jamPrimatives.getJam({ id })
    if (!jam) throw new Error('Expected Jam on creation')
    return jam
  }

  async delete(params: { id: string; userId: string }) {
    return await jamPrimatives.deleteJam(params)
  }

  async join(params: { userId: string; id: string }) {
    const { id, userId } = params
    const jamIdParticipant = await jamPrimatives.getUserActiveJam({ userId })
    if (jamIdParticipant) throw new Error('Already a participant')
    const { id: jamId } = await jamPrimatives.joinJam({ userId, id })
    const jam = await jamPrimatives.getJam({ id: jamId })
    if (!jam) throw new Error('Expected Jam on creation')
    return jam
  }

  async leave(params: { userId: string; id: string }) {
    await jamPrimatives.leaveJam(params)
  }

  async getUserActiveJam(params: { userId: string }) {
    return await jamPrimatives.getUserActiveJam({ userId: params.userId })
  }

  async isActiveJam(params: { id: string }) {
    const jam = await jamPrimatives.getJam({ id: params.id })
    if (!jam) return false
    return jam.endTime > new Date()
  }
}
