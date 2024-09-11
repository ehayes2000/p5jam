import { Elysia } from 'elysia'
import { PrismaClient } from '@prisma/client'
import { html, Html } from '@elysiajs/html'
import { Template } from './Template'

const prisma = new PrismaClient()

new Elysia()
  .use(html())
  .get('/posts/script/:id', async ({ params, error }) => {
    const { id } = params

    const post = await prisma.post.findUnique({
      where: { id },
    })
    if (!post) return error(404)
    return <Template script={post.script} />
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
  .listen(3000)
console.log('🚀 running on http://localhost:3000')
