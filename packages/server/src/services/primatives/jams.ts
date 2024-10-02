import { addMilliseconds } from 'date-fns'
import postPrimatives from './posts'
import client from '../../prisma'

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

async function getJams({
  filters,
}: {
  filters: { userId?: string; id?: string }
}) {
  return await client.jam.findMany({
    where: {
      id: filters.id,
      JamParticipant: {
        some: {
          userId: filters.userId,
        },
      },
      isDeleted: false,
    },
  })
}

async function getJam({ id }: { id: string }) {
  return await client.jam.findUnique({
    where: {
      id: id,
      isDeleted: false,
    },
    include: {
      Post: {
        include: {
          likes: true,
          comments: {
            include: {
              author: true,
            },
          },
          author: true,
        },
      },
    },
  })
}

async function createJam(params: {
  title: string
  durationMs: number
  userId: string
}) {
  const { title, durationMs, userId } = params
  const inviteCode = await generateInviteCode()
  const startTime = new Date()
  const endTime = addMilliseconds(startTime, durationMs)
  const [comeOnandSlam, _andWelcomeToTheJam] = await client.$transaction([
    client.jam.create({
      data: {
        id: inviteCode,
        ownerId: userId,
        startTime: startTime,
        endTime: endTime,
        title,
      },
    }),
    client.jamParticipant.create({
      data: {
        jamId: inviteCode,
        userId,
      },
    }),
  ])
  return { id: comeOnandSlam.id }
}

async function deleteJam(params: { id: string; userId: string }) {
  const { id, userId } = params
  await client.jam.update({
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
  return
}

async function endJam() {}

async function joinJam(params: { userId: string; id: string }) {
  const { userId, id } = params
  const { jamId } = await client.jamParticipant.upsert({
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
  return { id: jamId }
}

async function leaveJam(params: { userId: string; id: string }) {
  const { id, userId } = params
  await client.jamParticipant.update({
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

async function getUserActiveJam({ userId }: { userId: string }) {
  const participantJamId = await client.jamParticipant.findFirst({
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
  if (participantJamId) return { id: participantJamId.jam.id }
  const ownerJamId = await client.jam.findFirst({
    where: {
      endTime: {
        gte: new Date(),
      },
      ownerId: userId,
    },
    select: {
      id: true,
    },
  })
  return ownerJamId
}

const jamPrimatives = {
  getJam,
  getJams,
  createJam,
  deleteJam,
  joinJam,
  leaveJam,
  endJam,
  getUserActiveJam,
}

export default jamPrimatives
