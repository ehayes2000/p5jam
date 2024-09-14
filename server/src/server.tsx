import { Elysia, t } from 'elysia'
import { cors } from '@elysiajs/cors'
import { html, Html } from '@elysiajs/html'
import { PrismaClient, Prisma } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import P5Template from './P5Template'

const prisma = new PrismaClient()

new Elysia()
  .use(html())
  .get('/post/script/:id', async ({ params, error }) => {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
    })
    if (!post) return error(404)
    return <P5Template script={post.script} />
  })
  .get('/posts', async ({ error }) => {
    const posts = await prisma.post.findMany({
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
      console.log('hehe xdj post plx', body)

      try {
        const newPost = await prisma.post.create({
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
      } catch (error) {
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
  .get('/', () => (
    <html lang="en">
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <h1>Hello World</h1>
      </body>
    </html>
  ))
  .use(cors())
  .listen(3000)
console.log('🚀 running on http://localhost:3000')
