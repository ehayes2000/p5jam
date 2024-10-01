import { Elysia, error, t } from 'elysia'
import Models from '../services/models'
import prisma from '../prisma'
import { authMiddleware } from '../githubAuth'
import PostService from '../services/PostService'
import { Html, html } from '@elysiajs/html'
import ScriptTemplate from '../scriptTemplate'

export const postMutators = () =>
  new Elysia()
    .decorate('PostService', new PostService(new Models(prisma)))
    .derive(authMiddleware)
    .guard({
      as: 'local',
      beforeHandle: async ({ isAuth, error }) => {
        if (!isAuth) return error(401)
      },
    })
    .post(
      '/posts', // TODO "posts"
      async ({ userId, error, PostService }) => {
        try {
          return await PostService.create({ userId })
        } catch (e) {
          console.error(e)
          return error(400)
        }
      },
    )
    .post(
      '/posts/jam/:jamId',
      async ({ userId, params: { jamId }, PostService }) => {
        try {
          return await PostService.create({ userId, jamId })
        } catch (e) {
          console.error(e)
          return error(500)
        }
      },
    )

    .delete(
      '/posts/:id',
      async ({ userId, error, params: { id }, PostService }) => {
        try {
          return await PostService.delete({ userId, id })
        } catch (e) {
          return error(404)
        }
      },
    )
    .put(
      '/posts/:id',
      async ({ userId, error, body, params: { id }, PostService }) => {
        try {
          const post = await PostService.edit({ id, userId, ...body })
          return post
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
    .post(
      '/posts/:id/comments',
      async ({
        userId,
        error,
        params: { id },
        body: { text },
        PostService,
      }) => {
        try {
          return await PostService.createComment({ postId: id, userId, text })
        } catch (e) {
          return error(404)
        }
      },
      {
        body: t.Object({ text: t.String() }),
      },
    )
    .delete(
      '/posts/:id/comments/:commentId',
      async ({ userId, error, params: { commentId }, PostService }) => {
        try {
          await PostService.deleteComment({ userId, commentId })
        } catch (e) {
          return error(404)
        }
      },
    )
    .post(
      '/posts/:id/like',
      async ({ userId, params: { id }, PostService }) => {
        try {
          return await PostService.like({ userId, id })
        } catch (e) {
          throw e
        }
      },
    )
    .delete(
      '/posts/:id/like',
      async ({ userId, params: { id }, PostService }) => {
        return await PostService.deleteLike({ userId, id })
      },
    )

export default function postsRoutes() {
  return new Elysia()
    .use(html())
    .decorate('PostService', new PostService(new Models(prisma)))
    .use(postMutators())
    .get(
      '/posts',
      async ({ query: { userId }, error, PostService }) => {
        if (userId) {
          const posts = await PostService.list({ userId })
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
    .get(
      '/posts/:id/script',
      async ({ params: { id }, error, PostService }) => {
        const post = await PostService.get({ id })
        if (!post) return error(404)
        return <ScriptTemplate script={post.script} />
      },
    )
    .get(
      '/posts/:id',
      async ({ params: { id }, PostService }) => await PostService.get({ id }),
    )
    .get('/users/:id/posts', async ({ params: { id }, PostService }) => {
      return await PostService.list({ userId: id })
    })
}
