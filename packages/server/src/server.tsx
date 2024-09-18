import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import ScriptTemplate from './scriptTemplate'
import { login } from './routes/login'
import { restrictedRoutes } from './routes/restricted'
import client from './prisma'
import { Post } from '@prisma/client'

const api = new Elysia({ prefix: '/api' })
  .use(html())
  .use(login)
  .use(restrictedRoutes)
  .get('/posts/script/:id', async ({ params, error }) => {
    const post = await client.post.findUnique({
      where: { id: params.id },
    })
    if (!post) return error(404)
    return <ScriptTemplate script={post.script} />
  })
  .get('/posts', async () => {
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
        published: true,
      },
    })
    return posts ?? ([] as Post[])
  })
  .get('/users', async () => {
    return await client.user.findMany()
  })

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
