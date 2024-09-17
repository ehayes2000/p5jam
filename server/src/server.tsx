import { Elysia, t } from 'elysia'
import { Html, html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import ScriptTemplate from './scriptTemplate'
import { login } from './routes/login'
import { restrictedRoutes } from './routes/restricted'
import client from './prisma'

const api = new Elysia({ prefix: '/api' })
  .use(login)
  .use(restrictedRoutes)
  .use(html())
  .get('/post/script/:id', async ({ params, error }) => {
    const post = await client.post.findUnique({
      where: { id: params.id },
    })
    if (!post) return error(404)
    return <ScriptTemplate script={post.script} />
  })
  .get('/posts', async ({ error }) => {
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
    return posts
  })

const server = new Elysia().use(api)

if (process.env.NODE_ENV !== 'development') {
  server.use(
    staticPlugin({
      assets: '../client/dist',
      prefix: '',
    }),
  )
} else {
  server.get('/', ({ redirect }) => redirect(process.env.DEV_SERVER!))
}

server.listen(3000, (debug) =>
  console.log(`console.log('🚀 running on ${debug.url.origin}`),
)
