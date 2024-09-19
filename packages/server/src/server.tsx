import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import ScriptTemplate from './scriptTemplate'
import { login } from './routes/login'
import protectedRoutes from './routes/protected'
import client from './prisma'
import { Post } from '@prisma/client'

export const api = new Elysia({ prefix: '/api' })
  .use(html())
  .use(login)
  .use(protectedRoutes)
  .get('/posts/script/:id', async ({ params, error }) => {
    const post = await client.post.findUnique({
      where: { id: params.id },
    })
    if (!post) return error(404)
    return <ScriptTemplate script={post.script} />
  })
  .get('/posts', async () => {
    const posts = await client.post.findMany({
      include: {
        comments: {
          include: { author: true },
        },
        author: true,
      },
      where: {
        published: true,
      },
    })
    return (posts ?? ([] as Post[])).reverse()
  })
  .get('/users', async () => {
    return await client.user.findMany()
  })
  .get(
    '/comments',
    async ({ body: { id } }) => {
      return client.comment.findMany({
        include: { author: true },
        where: { postId: id },
      })
    },
    { body: t.Object({ id: t.String() }) },
  )

const app = new Elysia().use(api)

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
