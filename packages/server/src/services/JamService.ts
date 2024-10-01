import { addMilliseconds } from 'date-fns'
import client from './models'

export default class JamService {
  private client: client

  constructor(client: client) {
    this.client = client
  }

  async get(id: string) {
    return await this.client.getJam({ id })
  }

  async create(params: { title: string; durationMs: number; userId: string }) {
    const { id } = await this.client.createJam(params)
    const jam = await this.client.getJam({ id })
    if (!jam) throw new Error('Expected Jam on creation')
    return jam
  }

  async delete(params: { id: string; userId: string }) {
    return await this.client.deleteJam(params)
  }

  async join(params: { userId: string; id: string }) {
    const { id, userId } = params
    const jamIdParticipant = await this.client.getUserActiveJam({ userId })
    if (jamIdParticipant) throw new Error('Already a participant')
    const { id: jamid } = await this.client.joinJam({ userId, id })
    const jam = await this.client.getJam({ id })
    if (!jam) throw new Error('Expected Jam on creation')
    return jam
  }

  async leave(params: { userId: string; id: string }) {
    await this.client.leaveJam(params)
  }

  async getUserActiveJam(params: { userId: string }) {
    return await this.client.getUserActiveJam({ userId: params.userId })
  }
}
