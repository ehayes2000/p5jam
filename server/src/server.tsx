import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { html, Html } from '@elysiajs/html'
import { v4 as uuid } from 'uuid'
import ScriptTemplate from './scriptTemplate'
import { login } from './routes/login'
import { restrictedRoutes } from './routes/restricted'
import client from './prisma'

new Elysia()
  .use(html())
  .get('/post/script/:id', async ({ params, error }) => {
    const post = await client.post.findUnique({
      where: { id: params.id },
    })
    if (!post) return error(404)
    return <ScriptTemplate script={'44'} />
  })
  .get('/posts', async ({ error }) => {
    const posts = await client.post.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        content: true,
        script: false,
        published: true,
        likeCount: true,
        viewCount: true,
        author: true,
        authorId: true,
      },
    })
    if (!posts) return error(404)
    return posts
  })
  .post(
    '/makePost',
    async ({ body }) => {
      try {
        const newPost = await client.post.create({
          data: {
            ...body,
            id: uuid(),
            content: '',
            published: true,
            likeCount: 0,
            viewCount: 0,
            author: { connect: { id: 'test' } }, // TODO
          },
        })
        return { success: true, post: newPost }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    },
    {
      body: t.Object({
        script: t.String(),
        description: t.String(),
      }),
    },
  )
  .get('/test', () => (
    <html lang="en">
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  ))
  .use(login)
  .use(restrictedRoutes)
  .use(cors())
  .listen(3000)

console.log('🚀 running on http://localhost:3000')
