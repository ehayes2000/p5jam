import Elysia from 'elysia'
import { OAuth2RequestError, generateState } from 'arctic'
import { v4 as uuid } from 'uuid'
import { github, lucia, authMiddleware } from '../githubAuth'
import { type User } from '@prisma/client'
import client from '../prisma'

interface GitHubUser {
  login: string
}

export default function loginRoutes() {
  return new Elysia()
    .get('/login/github', async ({ cookie, redirect }) => {
      const state = generateState()
      const url = await github.createAuthorizationURL(state)
      cookie.github_oauth_state.set({
        value: state,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax',
      })
      return redirect(url.toString())
    })
    .get(
      '/login/github/callback',
      async ({
        cookie: { github_oauth_state, auth_session },
        query,
        error,
        redirect,
      }) => {
        // called by github config
        const code = query.code?.toString() ?? null
        const state = query.code?.toString() ?? null
        const storedState = github_oauth_state.value ?? null
        if (!code || !state || !storedState) {
          console.error(code, state, storedState)
          return error(400)
        }
        try {
          const tokens = await github.validateAuthorizationCode(code)
          const githubUserResponse = await fetch(
            'https://api.github.com/user',
            {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            },
          )
          const githubUser: GitHubUser =
            (await githubUserResponse.json()) as GitHubUser
          const existingUser = await client.user.findUnique({
            where: { name: githubUser.login },
          })
          if (existingUser) {
            const session = await lucia.createSession(
              (existingUser as User).id,
              {},
            )
            const sessionCookie = lucia.createSessionCookie(session.id)
            auth_session.value = sessionCookie.value
            auth_session.set({
              ...sessionCookie.attributes,
            })
            return redirect('/')
          } else {
            const id = uuid()
            const newUser: User = {
              id: id,
              name: githubUser.login,
              postCount: 0,
              commentCount: 0,
            }
            await client.user.create({ data: newUser })
            const session = await lucia.createSession(id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)
            auth_session.value = sessionCookie.value
            auth_session.set({
              ...sessionCookie.attributes,
            })
            return redirect('/')
          }
        } catch (e) {
          if (
            e instanceof OAuth2RequestError &&
            e.message === 'bad_verification_code'
          ) {
            return error(400)
          } else {
            return error(500)
          }
        }
      },
    )
    .derive(authMiddleware)
    .guard({
      as: 'local',
      beforeHandle: ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .get('/login/myid', async ({ userId }) => {
      return { id: userId }
    })
}
