import { v4 as uuid } from 'uuid'
import { addMilliseconds } from 'date-fns'
import { Elysia, t } from 'elysia'
import { authMiddleware } from '../githubAuth'
import client from '../prisma'

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

export default function jamRoutes() {
  return new Elysia({ prefix: 'jams' })
    .derive(authMiddleware)
    .guard({
      as: 'local',
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .get('/', async () => {
      return await client.jam.findMany({
        include: {
          Post: true,
          JamParticipant: true,
        },
        where: {
          isDeleted: false,
        },
      })
    })
    .get('/:id', async ({ params: { id }, error }) => {
      const jams = await client.jam.findUnique({
        include: {
          Post: true,
          JamParticipant: true,
        },
        where: {
          id,
        },
      })
      if (!jams) return error(404)
      return jams
    })
    .post(
      '/',
      async ({ userId, body: { title, durationMs } }) => {
        const inviteCode = await generateInviteCode()
        const startTime = new Date()
        const endTime = addMilliseconds(startTime, durationMs)
        const [comeOnandSlam, andWelcomeToTheJam] = await client.$transaction([
          client.jam.create({
            data: {
              id: inviteCode,
              ownerId: userId,
              startTime: startTime,
              endTime: endTime,
              lateWindowMinutes: 60,
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
      },
      {
        body: t.Object({
          title: t.String(),
          durationMs: t.Integer(),
        }),
      },
    )
    .delete('/:id', async ({ userId, params: { id } }) => {
      client.jam.update({
        where: {
          id,
          ownerId: userId,
        },

        data: {
          isDeleted: true,
        },
      })
    })
    .post('/:id/join', async ({ userId, error, params: { id } }) => {
      const activeJam = await client.jamParticipant.findFirst({
        select: {
          jam: {
            select: {
              id: true,
              acceptingSubmisions: true,
            },
          },
        },
        where: {
          userId,
          jam: {
            acceptingSubmisions: true,
          },
        },
      })
      if (activeJam) {
        return error(405)
      }
      await client.jamParticipant.create({
        data: {
          userId,
          jamId: id,
        },
      })
    })
    .delete('/:id/leave', async ({ userId, params: { id } }) => {
      await client.jamParticipant.update({
        where: {
          jamId_userId: {
            userId,
            jamId: id,
          },
        },
        data: {
          active: false,
        },
      })
    })
    .get('/activeJam', async ({ userId }) => {
      const activeJam = await client.jamParticipant.findFirst({
        select: {
          jam: {
            select: {
              id: true,
              acceptingSubmisions: true,
            },
          },
        },
        where: {
          userId,
          jam: {
            acceptingSubmisions: true,
          },
        },
      })
      return activeJam
    })
}
