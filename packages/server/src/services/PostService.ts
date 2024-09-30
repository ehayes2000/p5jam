import dbClient from '../prisma'
import { v4 as uuid } from 'uuid'

const DEFAULT_SCRIPT = `
const WIDTH=360
const HEIGHT=360
function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  // TODO
}
`

export default class PostService {
  private client: typeof dbClient

  constructor(client: typeof dbClient) {
    this.client = client
  }

  async list() {
    return await this.client.post
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
  }

  async get(params: { id: string }) {
    const { id } = params
    return await this.client.post
      .findUnique({
        where: { id },
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
      })
      .then((post) => {
        if (post) {
          return {
            ...post,
            likes: post.likes.reduce(
              (acc, like) => {
                acc[like.userId] = true
                return acc
              },
              {} as { [k: string]: true },
            ),
          }
        } else {
          return null
        }
      })
  }

  async create(params: { userId: string; jamId?: string }) {
    // TODO: make jam id actually work
    const { userId, jamId } = params
    const postCount = await this.client.user.findUniqueOrThrow({
      where: { id: userId },
      select: { postCount: true },
    })

    const [newPost, _] = await this.client.$transaction([
      this.client.post.create({
        data: {
          script: DEFAULT_SCRIPT,
          id: uuid(),
          content: '',
          likeCount: 0,
          viewCount: 0,
          author: { connect: { id: userId } },
          jam: { connect: { id: jamId } },
        },
      }),
      this.client.user.update({
        where: { id: userId },
        data: { postCount: postCount.postCount + 1 },
      }),
    ])
    return newPost
  }

  async delete(params: { userId: string; id: string }) {
    const { userId, id } = params
    const postCount = await this.client.user.findUniqueOrThrow({
      where: { id: userId },
      select: { postCount: true },
    })
    await this.client.$transaction([
      this.client.comment.deleteMany({
        where: { postId: id },
      }),
      this.client.like.deleteMany({
        where: { postId: id },
      }),
      this.client.post.delete({
        where: {
          id,
          authorId: userId,
        },
      }),
      this.client.user.update({
        where: { id: userId },
        data: {
          postCount: postCount.postCount - 1,
        },
      }),
    ])
  }

  async edit(params: {
    id: string
    userId: string
    script: string
    description: string
  }) {
    const { id, userId, script, description } = params
    return await this.client.post.update({
      where: {
        id,
        authorId: userId,
      },
      data: {
        script,
        description,
        updatedAt: new Date(),
      },
    })
  }

  async like(params: { id: string; userId: string }) {
    const { id, userId } = params
    await this.client.like.create({
      data: {
        postId: id,
        userId,
      },
    })
    const likes = await this.client.post.findFirstOrThrow({
      where: { id },
      select: { likeCount: true },
    })

    await this.client.post.update({
      where: { id },
      data: { likeCount: likes.likeCount + 1 },
    })
  }

  async deleteLike(params: { userId: string; id: string }) {
    const { userId, id } = params
    await this.client.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    })
    const likes = await this.client.post.findFirstOrThrow({
      where: { id },
      select: { likeCount: true },
    })
    await this.client.post.update({
      where: { id },
      data: { likeCount: likes.likeCount - 1 },
    })
  }

  async createComment(params: {
    postId: string
    text: string
    userId: string
  }) {
    const { postId, text, userId } = params
    const counts = await this.client.post.findFirstOrThrow({
      where: {
        id: postId,
      },
      select: {
        author: {
          select: {
            commentCount: true,
          },
        },
        commentCount: true,
      },
    })
    const newComment = await this.client.comment.create({
      data: {
        id: uuid(),
        text,
        authorId: userId,
        createdAt: new Date(),
        postId,
      },
      include: {
        author: true,
      },
    })
    await this.client.user.update({
      data: { commentCount: counts.author.commentCount + 1 },
      where: { id: userId },
    })
    await this.client.post.update({
      data: { commentCount: counts.commentCount + 1 },
      where: { id: postId },
    })
    return newComment
  }

  async deleteComment(params: { commentId: string; userId: string }) {
    const { commentId, userId } = params

    const counts = await this.client.comment.findFirstOrThrow({
      where: {
        id: commentId,
      },
      select: {
        author: {
          select: {
            commentCount: true,
          },
        },
        post: {
          select: {
            commentCount: true,
            id: true,
          },
        },
      },
    })
    await this.client.comment.delete({
      where: {
        id: commentId,
        authorId: userId,
      },
    })
    await this.client.user.update({
      data: {
        commentCount: counts.author.commentCount - 1,
      },
      where: {
        id: userId,
      },
    })
    await this.client.post.update({
      data: {
        commentCount: counts.post.commentCount - 1,
      },
      where: {
        id: counts.post.id,
      },
    })
  }
}
