import { Context } from 'elysia'
import { makeProtectedRoutes } from '../src/routes/protected'
import { describe, expect, it } from 'bun:test'

const allowAuth = async (ctx: Context) => ({ isAuth: true, userId: 'testUser' })

const testServer = makeProtectedRoutes(allowAuth)

describe('create comment', () => {
  it('error on bad id', async () => {
    const response = await testServer.handle(
      new Request('http://localhost/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'test comment',
          postId: 'does not exist',
        }),
      }),
    )
    expect(response.status).toBe(404)
  })
})
