import { Elysia, Context, t } from 'elysia'
import { auth } from '../githubAuth'
import { create as createLike, deleteLike } from '../services/primitives/likes'
import { create, get, update, deletePost } from '../services/primitives/posts'
import {
  create as createComment,
  deleteComment,
} from '../services/primitives/comments'
import { Html, html } from '@elysiajs/html'
import ScriptTemplate from '../scriptTemplate'

const DEFAULT_SCRIPT = `
function setup() {
  createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function draw() {
  background(220);
}` as const

export const postMutators = (authPlugin: typeof auth) =>
  new Elysia()
    .use(authPlugin)
    // .guard({
    //   // response: { // breaks type inference :)
    //   //   401: t.String(),
    //   //   404: t.String(),
    //   //   200: t.
    //   // },
    // })
    .post(
      '/posts', // TODO "posts"
      async ({ userId, body }) => {
        return await create({
          authorId: userId,
          jamId: body?.jamId,
          script: DEFAULT_SCRIPT,
          published: false,
        })
      },
      {
        isSignIn: true,
        body: t.Object({
          jamId: t.Optional(t.String()),
        }),
      },
    )
    .delete(
      '/posts/:id',
      async ({ userId, error, params: { id } }) => {
        const isDeleted = await deletePost({ authorId: userId, id })
        if (isDeleted)
          return
        else return error(404, "Not Found")
      },
      {
        isSignIn: true,
      },
    )
    .put(
      '/posts/:id',
      async ({ userId, error, body, params: { id } }) => {
        try {
          const post = await update({
            id,
            authorId: userId,
            description: body.description,
            script: body.script,
            published: true,
          })
          return post
        } catch (e) {
          return error(404, 'Post not found')
        }
      },
      {
        isSignIn: true,
        body: t.Object({
          script: t.String(),
          description: t.String(),
        }),
      },
    )
    .post(
      '/posts/:id/comments',
      async ({ userId, error, params: { id }, body: { text } }) => {
        try {
          return await createComment({
            data: {
              authorId: userId,
              createdAt: new Date(),
              postId: id,
              text,
            },
          })
        } catch (e) {
          return error(404, 'Post not found')
        }
      },
      {
        isSignIn: true,
        body: t.Object({ text: t.String() }),
      },
    )
    .delete(
      '/posts/:id/comments/:commentId',
      async ({ userId, error, params: { commentId } }) => {
        try {
          await deleteComment({
            authorId: userId,
            id: commentId,
          })
        } catch (e) {
          return error(404, 'Post not found')
        }
      },
      {
        isSignIn: true,
      },
    )
    .post(
      '/posts/:id/like',
      async ({ userId, params: { id } }) => {
        try {
          return await createLike({ postId: id, userId })
        } catch (e) {
          throw e
        }
      },
      { isSignIn: true },
    )
    .delete(
      '/posts/:id/like',
      async ({ userId, params: { id } }) => {
        return await deleteLike({ postId: id, userId })
      },
      { isSignIn: true },
    )
export const makePostRoutes = (authPlugin: typeof auth) =>
  new Elysia()
    .use(html())
    .use(postMutators(authPlugin))
    .get('/posts/featured', async ({ error }) => {
      // TODO real featured system
      const posts = await get({
        authorIds: ['0665a608-a67c-4264-93b0-143fa8c92389'],
      })
      if (!posts.length) return error(404)
      return posts[posts.length - 1]
    })
    .get(
      '/posts',
      async ({ query: { userId, jamId, userName }, error }) => {
        if (userName) return await get({ authorNames: [userName] })
        if (jamId) return await get({ jamIds: [jamId] })
        if (userId) return await get({ authorIds: [userId] })
        return error(404)
      },
      {
        query: t.Object({
          userId: t.Optional(t.String()),
          userName: t.Optional(t.String()),
          jamId: t.Optional(t.String()),
        }),
      },
    )
    .get('/posts/:id/script', async ({ params: { id }, error }) => {
      const post = (await get({ data: { id } }))[0]
      if (!post) return error(404)
      return <ScriptTemplate script={post.script} />
    })
    .get('/posts/:id', async ({ params: { id }, error }) => {
      const posts = await get({ data: { id }, includeUnpublished: true })
      if (!posts.length) return error(404)
      return posts[0]
    })

export const postsRoutes = makePostRoutes(auth)
