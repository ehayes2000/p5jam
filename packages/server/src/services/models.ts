import { addMilliseconds } from 'date-fns'
import { v4 as uuid } from 'uuid'
import dbClient from '../prisma'
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

export const generateInviteCode = async (): Promise<string> => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const codeLen = 5
  // hehexd
  let code = ''
  for (let i = 0; i < codeLen; ++i) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default class Models {
  private client: typeof dbClient
  constructor(client: typeof dbClient) {
    this.client = client
  }

  async getUser({ id }: { id: string }) {
    return await this.client.user.findUnique({
      where: { id },
      include: { comments: true, likes: true },
    })
  }

  async getPost({ id }: { id: string }) {
    return await this.client.post.findUnique({
      where: { id },
      include: {
        comments: true,
        likes: true,
        author: true,
      },
    })
  }

  async getPosts({
    filters,
  }: {
    filters?: { userId?: string; jamId?: string }
  }) {
    return await this.client.post.findMany({
      where: {
        ...(filters?.userId ? { authorId: filters.userId } : {}),
        ...(filters?.jamId ? { jamId: filters.jamId } : {}),
      },
      include: {
        comments: true,
        likes: true,
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async getJam({ id }: { id: string }) {
    const jam = await this.client.jam.findUnique({ where: { id } })
    if (!jam) return null
    const posts = await this.getPosts({ filters: { jamId: id } })
    return {
      jam,
      posts,
    }
  }

  async getComment({ id }: { id: string }) {
    const comment = await this.client.comment.findUnique({
      where: { id },
      include: { author: true },
    })
    if (!comment) throw new Error('handle me:)')
    return comment
  }

  async getUserActiveJam({ userId }: { userId: string }) {
    const participantJamId = await this.client.jamParticipant.findFirst({
      select: {
        jam: {
          select: {
            id: true,
          },
        },
      },
      where: {
        userId,
        active: true,
        jam: {
          endTime: {
            gte: new Date(),
          },
        },
      },
    })
    if (participantJamId) return { id: participantJamId.jam.id }
    const ownerJamId = await this.client.jam.findFirst({
      where: {
        endTime: {
          gte: new Date(),
        },
        ownerId: userId,
      },
      select: {
        id: true,
      },
    })
    return ownerJamId
  }

  async createJam(params: {
    title: string
    durationMs: number
    userId: string
  }) {
    const { title, durationMs, userId } = params
    const activeJamId = await this.getUserActiveJam({ userId })
    if (activeJamId)
      throw new Error('Cannot participate in / own multiple jams')
    const inviteCode = await generateInviteCode()
    const startTime = new Date()
    const endTime = addMilliseconds(startTime, durationMs)
    const [comeOnandSlam, _andWelcomeToTheJam] = await this.client.$transaction(
      [
        this.client.jam.create({
          data: {
            id: inviteCode,
            ownerId: userId,
            startTime: startTime,
            endTime: endTime,
            title,
          },
        }),
        this.client.jamParticipant.create({
          data: {
            jamId: inviteCode,
            userId,
          },
        }),
      ],
    )
    return { id: comeOnandSlam.id }
  }

  async deleteJam(params: { id: string; userId: string }) {
    const { id, userId } = params
    await this.client.jam.update({
      where: {
        id,
        ownerId: userId,
        endTime: {
          lte: new Date(),
        },
      },
      data: {
        isDeleted: true,
      },
    })
    return
  }

  async joinJam(params: { userId: string; id: string }) {
    const { userId, id } = params
    const { jamId } = await this.client.jamParticipant.upsert({
      where: {
        jamId_userId: {
          userId,
          jamId: id,
        },
      },
      create: {
        jamId: id,
        userId,
      },
      update: {
        active: true,
      },
    })
    return { id: jamId }
  }

  async leaveJam(params: { userId: string; id: string }) {
    const { id, userId } = params
    await this.client.jamParticipant.update({
      where: {
        jam: {
          ownerId: {
            not: userId,
          },
        },
        jamId_userId: {
          userId,
          jamId: id,
        },
      },
      data: {
        active: false,
      },
    })
  }

  async createPost(params: { userId: string; jamId?: string }) {
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
    return newPost.id
  }

  async deletePost({ id, userId }: { id: string; userId: string }) {
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

  async editPost(params: {
    id: string
    userId: string
    script: string
    description: string
  }) {
    const { id, userId, script, description } = params
    const post = await this.client.post.update({
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
    return { id: post.id }
  }
  async likePost({ id, userId }: { id: string; userId: string }) {
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

  async unlikePost({ id, userId }: { id: string; userId: string }) {
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
    return { id: newComment.id }
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
