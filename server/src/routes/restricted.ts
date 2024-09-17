import { Elysia, t } from 'elysia'
import { lucia } from '../githubAuth'
import { v4 as uuid } from 'uuid'
import { type User, type Post } from '@prisma/client'
import client from '../prisma'

export const restrictedRoutes = new Elysia({ prefix: '/profile' })
  .derive(async ({ headers, cookie: { auth_session } }) => {
    const sessionId = lucia.readSessionCookie(
      headers.cookie === undefined ? '' : headers.cookie,
    )
    if (!sessionId) return { isAuth: false, userId: 'null' }
    const { session, user } = await lucia.validateSession(sessionId)
    if (session && session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      auth_session.set({ ...sessionCookie.attributes })
      if (user) return { isAuth: true, userId: user.id }
    }
    if (!session || !user) {
      const blankCookie = lucia.createBlankSessionCookie()
      auth_session.set({ ...blankCookie.attributes })
      return { isAuth: false, userId: 'null' }
    }
    return { isAuth: true, userId: user.id }
  })
  .guard(
    {
      // validate session
      async beforeHandle({ isAuth, userId, error }) {
        if (!isAuth || userId === 'null' || !userId) return error(401)
      },
    },
    (app) => {
      app.post(
        '/makePost',
        async ({ body, userId, set }) => {
          try {
            const newPost: Post = await client.post.create({
              data: {
                ...body,
                id: uuid(),
                content: '',
                published: true,
                likeCount: 0,
                viewCount: 0,
                author: { connect: { id: userId } },
              },
            })
            return { success: true, post: newPost }
          } catch (error: any) {
            set.status = 400
            return { success: false, error: error.message }
          }
        },
        {
          body: t.Object({
            script: t.String(),
            description: t.String(),
          }),
          response: {
            200: t.Object({ success: t.Boolean(), post: t.Any() }), // TODO
            400: t.Object({ success: t.Boolean(), error: t.String() }),
          },
        },
      )
      app.post(
        '/updatePost',
        async ({ body, userId, set }) => {
          try {
            const updated = await client.post.update({
              where: {
                id: body.postId,
                authorId: userId,
              },
              data: {
                script: body.script,
                description: body.description,
                updatedAt: new Date(),
              },
            })
            return {
              success: true,
              post: updated,
            }
          } catch (e) {
            set.status = 400
            return {
              success: false,
              error: ':(', // TODO
            }
          }
        },
        {
          body: t.Object({
            postId: t.String(),
            script: t.String(),
            description: t.String(),
          }),
          response: {
            200: t.Object({ success: t.Boolean(), post: t.Any() }), // TODO
            400: t.Object({ success: t.Boolean(), error: t.String() }),
          },
        },
      )
      app.post(
        '/deletePost',
        async ({ body, userId, set }) => {
          try {
            await client.post.delete({
              where: {
                id: body.postId,
                authorId: userId,
              },
            })
            return { success: true }
          } catch (e) {
            set.status = 400
            return { success: false }
          }
        },
        {
          body: t.Object({ postId: t.String() }),
          response: {
            200: t.Object({ success: t.Boolean() }),
            400: t.Object({ success: t.Boolean() }),
          },
        },
      )
      app.get(
        '/posts',
        async ({ userId }) => {
          const posts = await client.post.findMany({
            select: {
              id: true,
              script: false,
              createdAt: true,
              updatedAt: true,
              description: true,
              content: true,
              published: true,
              likeCount: true,
              viewCount: true,
              authorId: true,
            },
            where: { authorId: userId },
          })
          return posts
        },
        {
          response: {
            200: t.Array(
              t.Object({
                id: t.String(),
                createdAt: t.Date(),
                updatedAt: t.Date(),
                description: t.String(),
                content: t.String(),
                published: t.Boolean(),
                likeCount: t.Number(),
                viewCount: t.Number(),
                authorId: t.String(),
              }),
            ),
          },
        },
      )
      app.get('/greet', async ({ userId }) => {
        const user = await client.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (user) {
          return {
            id: user.id,
            name: user.name,
          }
        } else {
          return 'who are you'
        }
      })
      return app
    },
  )
