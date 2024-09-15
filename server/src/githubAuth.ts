import { Lucia } from 'lucia'
import { GitHub } from 'arctic'
import { PrismaAdapter } from '@lucia-auth/adapter-prisma'
import client from './prisma'
import { User } from '@prisma/client'

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
