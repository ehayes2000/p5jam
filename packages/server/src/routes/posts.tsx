import { v4 as uuid } from 'uuid'
import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import client from '../../prisma/prisma'
import { authMiddleware } from '../githubAuth'
import ScriptTemplate from '../scriptTemplate'
import { post, userPosts } from '../queries'

export const postMutators = () =>
  new Elysia()
    .derive(authMiddleware)
    .guard({
      as: 'local',
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .post(
      '/', // TODO "posts"
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
    .post(
      '/:id/comments',
      async ({ userId, error, params: { id }, body: { text } }) => {
        try {
          const counts = await client.post.findFirstOrThrow({
            where: {
              id,
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
              postId: id,
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
            where: { id },
          })
          return newComment
        } catch (e) {
          return error(404)
        }
      },
      {
        body: t.Object({ text: t.String() }),
      },
    )
    .delete(
      '/:id/comments/:commentId',
      async ({ userId, error, params: { id, commentId } }) => {
        try {
          const counts = await client.comment.findFirstOrThrow({
            where: {
              id: commentId,
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
              id: commentId,
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
    )
    .post('/:id/like', async ({ userId, params: { id } }) => {
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
        throw e
      }
    })
    .delete('/:id/like', async ({ userId, params: { id } }) => {
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
    .delete('/:id', async ({ userId, error, params: { id } }) => {
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
      } catch (e) {
        return error(404)
      }
    })
    .put(
      '/:id',
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

export default function postsRoutes() {
  return new Elysia({ prefix: '/posts' })
    .use(html())
    .use(postMutators())
    .get(
      '/',
      async ({ query: { userId }, error }) => {
        if (userId) {
          const posts = await userPosts(userId)
          return posts
        }
        return error(404)
      },
      {
        query: t.Object({
          userId: t.Optional(t.String()),
        }),
      },
    )
    .get('/:id/script', async ({ params, error }) => {
      const post = await client.post.findUnique({
        where: { id: params.id },
      })
      if (!post) return error(404)
      return <ScriptTemplate script={post.script} />
    })
    .get('/:id', async ({ params: { id } }) => post(id))
}
