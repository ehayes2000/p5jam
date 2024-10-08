import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { swagger } from '@elysiajs/swagger'
import { Elysia, t } from 'elysia'
import client from '../prisma/prisma'
import jamRoutes from './routes/jams'
import { loginRoutes } from './routes/login'
import { postsRoutes } from './routes/posts'

export const api = new Elysia({ prefix: '/api' })
  .guard({
    as: 'local',
    error: async ({ route, error }) => {
      console.log(
        `([${new Date().toString()}] - ${route} - ${error.cause}\n--\n ${error.message}\n--\n${error.stack}\n--\n${error.name}`,
      )
    },
  })
  .use(html())
  .use(loginRoutes)
  .use(postsRoutes)
  .use(jamRoutes())
  .get('/users', async () => {
    return await client.user.findMany()
  })

const app = new Elysia().use(api).use(swagger())

if (process.env.NODE_ENV !== 'development') {
  app
    .use(
      staticPlugin({
        prefix: '',
        assets: 'public',
      }),
    )
    .get('*', () => Bun.file('public/index.html'))
} else {
  app.get('/', ({ redirect }) => redirect(process.env.DEV_SERVER!))
}

app.listen(3000, (debug) => console.log(`🚀 running on ${debug.url.origin}`))

export type App = typeof app
export * from '@prisma/client'
