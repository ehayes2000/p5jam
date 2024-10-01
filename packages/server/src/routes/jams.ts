import { Context, Elysia, t } from 'elysia'
import { authMiddleware } from '../githubAuth'
import JamService from '../services/JamService'

export default function jamRoutes() {
  return makeJamRoutes(authMiddleware)
}

export const makeJamRoutes = (
  auth: (ctx: Context) => Promise<{ isAuth: boolean; userId: string }>,
) => {
  return new Elysia()
    .decorate('JamService', new JamService())
    .derive(auth)
    .guard({
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .get('/jams/:id', async ({ params: { id }, error, JamService }) => {
      const jams = await JamService.get(id)
      if (!jams) return error(404)
      return jams
    })
    .post(
      '/jams',
      async ({ userId, error, body: { title, durationMs }, JamService }) => {
        try {
          const jam = await JamService.create({
            userId,
            title,
            durationMs,
          })
          if (!jam) {
            return error(500, 'Expected jam after creation')
          }
          return jam
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
      return await JamService.delete({ id, userId })
    })
    .post(
      '/jams/:id/join',
      async ({ userId, error, params: { id }, JamService }) => {
        try {
          return await JamService.join({ id, userId })
        } catch (e) {
          console.error(`${e} + L + bozo`)
          return error(405)
        }
      },
    )
    .delete(
      '/jams/:id/leave',
      async ({ userId, params: { id }, JamService }) => {
        await JamService.leave({ id, userId })
      },
    )
    .get('/jams/activeJam', async ({ userId, error, JamService }) => {
      const activeJam = await JamService.getUserActiveJam({ userId })
      if (activeJam) return activeJam
      return error(404)
    })
}
