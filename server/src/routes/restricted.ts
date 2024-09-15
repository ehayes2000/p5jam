import Elysia from 'elysia'
import { lucia } from '../githubAuth'

export const restrictedRoutes = new Elysia({ prefix: '/user' }).guard(
  {
    async beforeHandle({ body, headers, error, cookie: { auth_session } }) {
      const sessionId = lucia.readSessionCookie(
        headers.cookie === undefined ? '' : headers.cookie,
      )
      if (!sessionId) {
        return error(400)
      }
      const { session, user } = await lucia.validateSession(sessionId)
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id)
        auth_session.set({ ...sessionCookie.attributes })
      }
      if (!session) {
        const blankCookie = lucia.createBlankSessionCookie()
        auth_session.set({ ...blankCookie.attributes })
        return error(401)
      }
    },
  },
  (app) => app.get('/', () => "i'm in"),
)
