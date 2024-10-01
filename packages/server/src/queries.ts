import client from '../prisma/prisma'

export const feed = async () =>
  client.post
    .findMany({
      include: {
        comments: {
          include: { author: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((posts) =>
      posts.map((post) => ({
        ...post,
        likes: post.likes.reduce(
          (acc, like) => {
            acc[like.userId] = true
            return acc
          },
          {} as { [key: string]: true },
        ),
      })),
    )

export const userPosts = async (userId: string) =>
  client.post
    .findMany({
      include: {
        comments: {
          include: { author: true },
          orderBy: {
            createdAt: 'desc',
          },
        },
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((posts) =>
      posts.map((post) => ({
        ...post,
        likes: post.likes.reduce(
          (a, l) => {
            a[l.userId] = true
            return a
          },
          {} as { [k: string]: true },
        ),
      })),
    )
