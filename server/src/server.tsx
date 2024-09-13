import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { html, Html } from '@elysiajs/html'
import { PrismaClient } from '@prisma/client'
import P5Template from './P5Template'

const prisma = new PrismaClient()

new Elysia()
  .use(html())
  .get('/post/script/:id', async ({ params, error }) => {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
    })
    console.log('get script')
    if (!post) return error(404)
    console.log(post.script)
    return <P5Template script={post.script} />
  })
  .get('/posts', async ({ params, error }) => {
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
