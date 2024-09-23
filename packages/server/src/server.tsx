import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import loginRoutes from './routes/login'
import postsRoutes from './routes/posts'
// import protectedRoutes from './routes/protected'
import { feed, post, userPosts } from './queries'
import client from './prisma'

export const api = new Elysia({ prefix: '/api' })
  .guard({
    as: 'local',
    error: async ({ route, error }) => {
      console.log(`([${new Date().toString()}] - ${route} - ${error}`)
    },
  })
  .use(html())
  .use(loginRoutes())
  .use(postsRoutes())
  .get('/feed', feed)
  .get('/users', async () => {
    return await client.user.findMany()
  })
  .get('/users/:id/posts', ({ params: { id } }) => userPosts(id)) // TODO
  .get(
    '/users/:id/comments',
    async ({ body: { id } }) => {
      return client.comment.findMany({
        include: { author: true },
        where: { postId: id },
        orderBy: {
          createdAt: 'desc',
        },
      })
    },
    { body: t.Object({ id: t.String() }) },
  )

const app = new Elysia().use(api).use(swagger())

if (process.env.NODE_ENV !== 'development') {
  app.use(
    staticPlugin({
      assets: '../client/dist',
      prefix: '',
    }),
  )
} else {
  app.get('/', ({ redirect }) => redirect(process.env.DEV_SERVER!))
}

app.listen(3000, (debug) => console.log(`🚀 running on ${debug.url.origin}`))

export type App = typeof app
export * from '@prisma/client'
