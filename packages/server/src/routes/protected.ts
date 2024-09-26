// import { Elysia, t, Context } from 'elysia'
// import { authMiddleware } from '../githubAuth'
// import { v4 as uuid } from 'uuid'
// import { type User, type Post } from '@prisma/client'
// import client from '../prisma'

// export const makeProtectedRoutes = (
//   auth: (ctx: Context) => Promise<{ isAuth: boolean; userId: string }>,
// ) => {
//   return new Elysia()
//     .derive(auth)
//     .guard({
//       as: 'local',
//       async beforeHandle({ isAuth, userId, error }) {
//         if (!isAuth || userId === 'null' || !userId) return error(401)
//       },
//     })
//     .get('/users/:id/posts', async ({ userId, params: { id } }) => {
//       let posts = await client.post.findMany({
//         include: {
//           comments: {
//             include: { author: true },
//             orderBy: {
//               createdAt: 'desc',
//             },
//           },
//           author: true,
//           likes: {
//             select: {
//               userId: true,
//             },
//           },
//         },
//         orderBy: {
//           createdAt: 'desc',
//         },
//       })
//       // TODO
//       return posts.map((post) => ({
//         ...post,
//         likes: post.likes.map((like) => like.userId),
//       }))
//     })
//     .get('/myid', async ({ userId }) => {
//       return { id: userId }
//     })
//     .post('/comments')
// }

// const protectedRoutes = makeProtectedRoutes(authMiddleware)
// export default protectedRoutes
