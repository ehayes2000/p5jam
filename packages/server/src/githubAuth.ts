import { Context } from 'elysia'
import { Lucia } from 'lucia'
import { GitHub } from 'arctic'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import client from '../prisma/prisma'
import { User } from '@prisma/client'
import { isAsync } from 'elysia/dist/compose'

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

export const authMiddleware = async ({
  headers,
  cookie: { auth_session },
}: Context) => {
  const sessionId = lucia.readSessionCookie(
    headers.cookie === undefined ? '' : headers.cookie,
  )
  if (!sessionId) return { isAuth: false, userId: 'null' }
  const { session, user } = await lucia.validateSession(sessionId)
  if (!session || !user) {
  }
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    auth_session.set({ ...sessionCookie.attributes })
    if (user) {
      return { isAuth: true, userId: user.id }
    } else {
      return { isAuth: false, userId: 'null' }
    }
  }
  if (session && user) {
    return { isAuth: true, userId: user.id }
  }
  const blankCookie = lucia.createBlankSessionCookie()
  auth_session.set({ ...blankCookie.attributes })
  return { isAuth: false, userId: 'null' }
}
