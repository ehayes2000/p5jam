import { Elysia, t } from 'elysia'
import { lucia } from '../githubAuth'
import { v4 as uuid } from 'uuid'
import { type User, type Post } from '@prisma/client'
import client from '../prisma'

export const restrictedRoutes = new Elysia()
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
  .guard({
    as: 'local',
    async beforeHandle({ isAuth, userId, error }) {
      if (!isAuth || userId === 'null' || !userId) return error(401)
    },
  })
  .post(
    '/posts', // TODO "posts"
    async ({ body, userId, error }) => {
      try {
        const [newPost, _] = await client.$transaction([
          client.post.create({
            data: {
              ...body,
              id: uuid(),
              content: '',
              published: true,
              likeCount: 0,
              viewCount: 0,
              author: { connect: { id: userId } },
            },
          }),
          client.$executeRaw`update "User" set postCount = postCount + 1 where id = ${userId}`,
        ])
        return { post: newPost }
      } catch (error: any) {
        return error(400)
      }
    },
    {
      body: t.Object({
        script: t.String(),
        description: t.String(),
      }),
    },
  )
  .put(
    '/posts/:id',
    async ({ userId, error, body, params: { id } }) => {
      try {
        const updated = await client.post.update({
          where: {
            id,
            authorId: userId,
          },
          data: {
            script: body.script,
            description: body.description,
            updatedAt: new Date(),
          },
        })
        return {
          post: updated,
        }
      } catch (e) {
        return error(404)
      }
    },
    {
      body: t.Object({
        script: t.String(),
        description: t.String(),
      }),
    },
  )
  .delete(
    '/posts/:id',
    async ({ userId, error, params: { id } }) => {
      try {
        await client.$transaction([
          client.post.delete({
            where: {
              id,
              authorId: userId,
            },
          }),
          client.$executeRaw`update "User" postCount = postCount - 1 where id = ${userId}`,
        ])
        return
      } catch (e) {
        return error(404)
      }
    },
    {
      body: t.Object({ postId: t.String() }),
    },
  )
  .get('/users/:id/posts', async ({ userId, params: { id } }) => {
    const posts = await client.post.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        content: true,
        script: true,
        published: true,
        likeCount: true,
        viewCount: true,
        author: true,
      },
      where: {
        authorId: userId,
        ...(userId === id ? {} : { published: true }),
      },
    })
    return posts ?? ([] as Post[])
  })
  .get('/greet', async ({ userId }) => {
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
      throw new Error('how did we get here. Auth failed!!!')
    }
  })
