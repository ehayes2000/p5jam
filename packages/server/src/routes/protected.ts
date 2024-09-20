import { Elysia, t, Context } from 'elysia'
import { lucia } from '../githubAuth'
import { v4 as uuid } from 'uuid'
import { type User, type Post } from '@prisma/client'
import client from '../prisma'

export const makeProtectedRoutes = (
  auth: (ctx: Context) => Promise<{ isAuth: boolean; userId: string }>,
) => {
  return new Elysia()
    .derive(auth)
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
          const postCount = await client.user.findUniqueOrThrow({
            where: { id: userId },
            select: { postCount: true },
          })
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
            client.user.update({
              where: { id: userId },
              data: { postCount: postCount.postCount + 1 },
            }),
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
    .delete('/posts/:id', async ({ userId, error, params: { id } }) => {
      try {
        const postCount = await client.user.findUniqueOrThrow({
          where: { id: userId },
          select: { postCount: true },
        })
        await client.$transaction([
          client.comment.deleteMany({
            where: { postId: id },
          }),
          client.like.deleteMany({
            where: { postId: id },
          }),
          client.post.delete({
            where: {
              id,
              authorId: userId,
            },
          }),
          client.user.update({
            where: { id: userId },
            data: {
              postCount: postCount.postCount - 1,
            },
          }),
        ])
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
          where: { authorId: userId },
        })
        return posts
      } catch (e) {
        console.log(e)
        return error(404)
      }
    })
    .post('/posts/:id/like', async ({ userId, params: { id } }) => {
      try {
        await client.like
          .create({
            data: {
              postId: id,
              userId,
            },
          })
          .then(
            async (_) =>
              await client.post.findFirstOrThrow({
                where: { id },
                select: { likeCount: true },
              }),
          )
          .then(
            async (likes) =>
              await client.post.update({
                where: { id },
                data: { likeCount: likes.likeCount + 1 },
              }),
          )
      } catch (e) {
        console.log(e)
        throw e
      }
    })
    .delete('/posts/:id/like', async ({ userId, params: { id } }) => {
      await client.like
        .delete({
          where: {
            userId_postId: {
              userId,
              postId: id,
            },
          },
        })
        .then(
          async () =>
            await client.post.findFirstOrThrow({
              where: { id },
              select: { likeCount: true },
            }),
        )
        .then(
          async (likes) =>
            await client.post.update({
              where: { id },
              data: { likeCount: likes.likeCount - 1 },
            }),
        )
    })
    .get('/users/:id/posts', async ({ userId, params: { id } }) => {
      let posts = await client.post.findMany({
        include: {
          comments: {
            include: { author: true },
            orderBy: {
              createdAt: 'desc',
            },
          },
          author: true,
          likes: {
            select: {
              userId: true,
            },
          },
        },
        where: {
          published: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      // TODO
      return posts.map((post) => ({
        ...post,
        likes: post.likes.map((like) => like.userId),
      }))
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
    .get('/myid', async ({ userId }) => {
      return { id: userId }
    })
    .post(
      '/comments',
      async ({ userId, error, body: { text, postId } }) => {
        try {
          const counts = await client.post.findFirstOrThrow({
            where: {
              id: postId,
            },
            select: {
              author: {
                select: {
                  commentCount: true,
                },
              },
              commentCount: true,
            },
          })
          const newComment = await client.comment.create({
            data: {
              id: uuid(),
              text,
              authorId: userId,
              createdAt: new Date(),
              postId,
            },
            include: {
              author: true,
            },
          })
          await client.user.update({
            data: { commentCount: counts.author.commentCount + 1 },
            where: { id: userId },
          })
          await client.post.update({
            data: { commentCount: counts.commentCount + 1 },
            where: { id: postId },
          })
          return newComment
        } catch (e) {
          return error(404)
        }
      },
      {
        body: t.Object({ text: t.String(), postId: t.String() }),
      },
    )
    .delete(
      '/comments',
      async ({ userId, error, body: { id } }) => {
        try {
          const counts = await client.comment.findFirstOrThrow({
            where: {
              id,
            },
            select: {
              author: {
                select: {
                  commentCount: true,
                },
              },
              post: {
                select: {
                  commentCount: true,
                  id: true,
                },
              },
            },
          })
          await client.comment.delete({
            where: {
              id,
              authorId: userId,
            },
          })
          await client.user.update({
            data: {
              commentCount: counts.author.commentCount - 1,
            },
            where: {
              id: userId,
            },
          })
          await client.post.update({
            data: {
              commentCount: counts.post.commentCount - 1,
            },
            where: {
              id: counts.post.id,
            },
          })
        } catch (e) {
          return error(404)
        }
      },
      {
        body: t.Object({
          id: t.String(),
        }),
      },
    )
}

const authMiddleware = async ({
  headers,
  cookie: { auth_session },
}: Context) => {
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
}

const protectedRoutes = makeProtectedRoutes(authMiddleware)
export default protectedRoutes
