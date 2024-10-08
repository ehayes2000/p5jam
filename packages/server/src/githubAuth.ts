import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import { User } from '@prisma/client'
import { GitHub } from 'arctic'
import { Context } from 'elysia'
import { Lucia } from 'lucia'
import { Elysia, error } from 'elysia'
import client from '../prisma/prisma'

const adapter = new PrismaAdapter(client.session, client.user)

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
  }
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.id,
      username: attributes.name,
    }
  },
})

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
  throw new Error(
    'undefined environment variables GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET',
  )

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!,
)
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: User
  }
}

export const auth = new Elysia({ name: 'Service.Auth' })
  .derive(
    { as: 'scoped' },
    async ({ headers: { cookie }, cookie: { auth_session }, error }) => {
      const sessionId = lucia.readSessionCookie(cookie ?? '')
      if (!sessionId) return { Auth: { userId: null } }
      const { session, user } = await lucia.validateSession(sessionId)
      if (!session || !user) {
        const blankCookie = lucia.createBlankSessionCookie()
        auth_session.set({ ...blankCookie.attributes })
        return { Auth: { userId: null } }
      }
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id)
        auth_session.set({ ...sessionCookie.attributes })
      }
      return { Auth: { userId: user.id } }
    },
  )
  .macro(({ onBeforeHandle, mapResponse }) => ({
    isSignIn(_: boolean) {
      onBeforeHandle(
        async ({
          Auth,
          error,
        }): Promise<undefined | ReturnType<typeof error>> => {
          if (!Auth?.userId || !Auth.userId) return error(401)
        },
      )
    },
  }))
  .resolve({ as: 'scoped' }, ({ Auth }): { userId: string | '' } => {
    return {
      userId: Auth.userId ?? '',
    }
  })
