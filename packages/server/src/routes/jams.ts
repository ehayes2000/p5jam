import { Context, Elysia, t } from 'elysia'
import client from '../../prisma/prisma'
import { authMiddleware } from '../githubAuth'
import JamService from '../services/JamService'

export default function jamRoutes() {
  return makeJamRoutes(authMiddleware)
}

export const makeJamRoutes = (
  auth: (ctx: Context) => Promise<{ isAuth: boolean; userId: string }>,
) => {
  return new Elysia()
    .decorate('JamService', new JamService(client))
    .derive(auth)
    .guard({
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .get('/jams', async ({ JamService }) => {
      return await JamService.getJams()
    })
    .get('/jams/:id', async ({ params: { id }, error, JamService }) => {
      const jams = await JamService.getJamByID(id)
      if (!jams) return error(404)
      return jams
    })
    .post(
      '/jams',
      async ({ userId, error, body: { title, durationMs }, JamService }) => {
        try {
          const { id } = await JamService.createJam({
            userId,
            title,
            durationMs,
          })

          return { id }
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
    .delete('/jams/:id', async ({ userId, params: { id }, JamService }) => {
      return await JamService.deleteJam({ id, userId })
    })
    .post(
      '/jams/:id/join',
      async ({ userId, error, params: { id }, JamService }) => {
        try {
          return await JamService.joinJam({ id, userId })
        } catch (e) {
          console.error(`${e} + L + bozo`)
          return error(405)
        }
      },
    )
    .delete(
      '/jams/:id/leave',
      async ({ userId, params: { id }, JamService }) => {
        await JamService.leaveJam({ id, userId })
      },
    )
    .get('/jams/activeJam', async ({ userId, error, JamService }) => {
      const activeJam = await JamService.getUsersActiveJam({ userId })
      if (activeJam) return activeJam
      return error(404)
    })
}
