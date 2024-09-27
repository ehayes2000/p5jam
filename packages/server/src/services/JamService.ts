import { addMilliseconds } from 'date-fns'
import dbClient from '../prisma'

export const generateInviteCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLen = 5
  // hehexd
  let code = ''
  for (let i = 0; i < codeLen; ++i) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default class JamService {
  private client: typeof dbClient

  constructor(client: typeof dbClient) {
    this.client = client
  }

  async list() {
    return await this.client.jam.findMany({
      include: {
        Post: true,
        JamParticipant: true,
      },
      where: {
        isDeleted: false,
      },
    })
  }

  async get(id: string) {
    return await this.client.jam.findUnique({
      include: {
        Post: true,
        JamParticipant: {
          where: {
            active: true,
          },
        },
      },
      where: {
        id,
      },
    })
  }

  async create(params: { title: string; durationMs: number; userId: string }) {
    const { title, durationMs, userId } = params
    const inviteCode = await generateInviteCode()
    const startTime = new Date()
    const endTime = addMilliseconds(startTime, durationMs)
    const [comeOnandSlam, _andWelcomeToTheJam] = await this.client.$transaction(
      [
        this.client.jam.create({
          data: {
            id: inviteCode,
            ownerId: userId,
            startTime: startTime,
            endTime: endTime,
            title,
          },
        }),
        this.client.jamParticipant.create({
          data: {
            jamId: inviteCode,
            userId,
          },
        }),
      ],
    )
    return comeOnandSlam
  }

  async delete(params: { id: string; userId: string }) {
    const { id, userId } = params
    return await this.client.jam.update({
      where: {
        id,
        ownerId: userId,
        endTime: {
          lte: new Date(),
        },
      },
      data: {
        isDeleted: true,
      },
    })
  }

  async join(params: { userId: string; id: string }) {
    const { id, userId } = params
    const activeParticipant = await this.client.jamParticipant.findFirst({
      select: {
        jam: {
          select: {
            id: true,
          },
        },
      },
      where: {
        userId,
        jam: {
          endTime: {
            gte: new Date(),
          },
        },
        active: true,
      },
    })
    if (activeParticipant) {
      throw new Error(
        'This should be a structured error: already active participant in jam',
      )
    }
    const activeOwner = await this.client.jam.findFirst({
      where: {
        ownerId: userId,
        endTime: {
          gte: new Date(),
        },
      },
    })

    if (activeOwner) {
      throw new Error('You are already an active owner in a jam')
    }

    await this.client.jamParticipant.upsert({
      where: {
        jamId_userId: {
          userId,
          jamId: id,
        },
      },
      create: {
        jamId: id,
        userId,
      },
      update: {
        active: true,
      },
    })
    const jam = await this.client.jam.findUnique({
      include: {
        Post: true,
        JamParticipant: {
          where: {
            active: true,
          },
        },
      },
      where: {
        id,
      },
    })
    return jam
  }

  async leave(params: { userId: string; id: string }) {
    const { id, userId } = params
    await this.client.jamParticipant.update({
      where: {
        jam: {
          ownerId: {
            not: userId,
          },
        },
        jamId_userId: {
          userId,
          jamId: id,
        },
      },
      data: {
        active: false,
      },
    })
  }

  async getUsersActiveJam(params: { userId: string }) {
    const { userId } = params
    return await this.client.jamParticipant.findFirst({
      select: {
        jam: {
          select: {
            id: true,
          },
        },
      },
      where: {
        userId,
        active: true,
        jam: {
          endTime: {
            gte: new Date(),
          },
        },
      },
    })
  }
}
