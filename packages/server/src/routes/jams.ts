import { v4 as uuid } from 'uuid'
import { addMilliseconds } from 'date-fns'
import { Elysia, t, Context } from 'elysia'
import { authMiddleware } from '../githubAuth'
import client from '../../prisma/prisma'

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
  return makeJamRoutes(authMiddleware)
}

export const makeJamRoutes = (
  auth: (ctx: Context) => Promise<{ isAuth: boolean; userId: string }>,
) => {
  return new Elysia()
    .derive(auth)
    .guard({
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .get('/jams', async () => {
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
    .get('/jams/:id', async ({ params: { id }, error }) => {
      const jams = await client.jam.findUnique({
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
      if (!jams) return error(404)
      return jams
    })
    .post(
      '/jams',
      async ({ userId, error, body: { title, durationMs } }) => {
        const inviteCode = await generateInviteCode()
        const startTime = new Date()
        const endTime = addMilliseconds(startTime, durationMs)
        try {
          const [comeOnandSlam, andWelcomeToTheJam] = await client.$transaction(
            [
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
            ],
          )
          return { id: comeOnandSlam.id }
        } catch (e) {
          console.error(e)
          return error(500)
        }
      },
      {
        body: t.Object({
          title: t.String(),
          durationMs: t.Integer(),
        }),
      },
    )
    .delete('/jams/:id', async ({ userId, params: { id } }) => {
      client.jam.update({
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
    })
    .post('/jams/:id/join', async ({ userId, error, params: { id } }) => {
      try {
        const activeParticipant = await client.jamParticipant.findFirst({
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
          return error(405)
        }
        const activeOwner = await client.jam.findFirst({
          where: {
            ownerId: userId,
            endTime: {
              gte: new Date(),
            },
          },
        })

        if (activeOwner) {
          return error(405)
        }

        await client.jamParticipant.upsert({
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
        const jam = await client.jam.findUnique({
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
      } catch (e) {
        console.error(e)
        return error(500)
      }
    })
    .delete('/jams/:id/leave', async ({ userId, params: { id } }) => {
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
    })
    .get('/jams/activeJam', async ({ userId, error }) => {
      const activeJam = await client.jamParticipant.findFirst({
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
      if (activeJam) return activeJam
      return error(404)
    })
}
