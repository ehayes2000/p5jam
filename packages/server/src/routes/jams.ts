import { v4 as uuid } from 'uuid'
import { addMilliseconds } from 'date-fns'
import { Elysia, t } from 'elysia'
import { authMiddleware } from '../githubAuth'
import client from '../prisma'

export const generateInviteCode = async (): Promise<string> => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLen = 5
  const maxRetries = 3
  // hehexd
  const makeCode = () => {
    let code = ''
    for (let i = 0; i < codeLen; ++i) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const isUniqueCode = async (code: string): Promise<boolean> => {
    const exists = await client.jam.findUnique({ where: { id: code } })
    return !exists
  }

  let tries = 0
  do {
    let code = makeCode()
    let isUnique = await isUniqueCode(code)
    if (isUnique) return code
    tries++
  } while (tries < maxRetries)
  throw new Error('could not generate unique JamId')
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
        client.jam.create({
          data: {
            id: uuid(),
            inviteCode,
            ownerId: userId,
            startTime: startTime,
            endTime: endTime,
            lateWindowMinutes: 60,
            title,
          },
        })
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
    .post('/:id/participants', async ({ userId, params: { id } }) => {
      await client.jamParticipant.create({
        data: {
          userId,
          jamId: id,
        },
      })
    })
    .delete('/:id/participants', async ({ userId, params: { id } }) => {
      await client.jamParticipant.delete({
        where: {
          jamId_userId: {
            userId,
            jamId: id,
          },
        },
      })
    })
}
