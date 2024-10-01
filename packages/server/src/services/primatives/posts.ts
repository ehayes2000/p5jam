import { v4 as uuid } from 'uuid'
import client from '../../prisma'

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
async function getPost({ id }: { id: string }): Promise<TPost | null> {
  const post = await getPosts({ filters: { id } })
  return post[0]
}

async function getPosts({
  filters,
}: {
  filters?: { userId?: string; jamId?: string; id?: string }
}) {
  return await client.post.findMany({
    where: {
      ...(filters?.userId ? { authorId: filters.userId } : {}),
      ...(filters?.jamId ? { jamId: filters.jamId } : {}),
      ...(filters?.id ? { id: filters.id } : {}),
    },
    include: {
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

async function createPost(params: {
  userId: string
  jamId?: string
}): Promise<{ id: string }> {
  const post = await client.post.create({
    data: {
      script: DEFAULT_SCRIPT,
      id: uuid(),
      content: '',
      author: { connect: { id: params.userId } },
      jam: { connect: { id: params.jamId } },
    },
  })
  return { id: post.id }
}

async function deletePost({ id, userId }: { id: string; userId: string }) {
  await client.$transaction([
    client.comment.deleteMany({
      where: { postId: id },
    }),
    client.like.deleteMany({
      where: { postId: id },
    }),
    client.post.delete({
      where: {
        id,
        authorId: userId,
      },
    }),
  ])
}

async function editPost(params: {
  id: string
  userId: string
  script: string
  description: string
}) {
  const { id, userId, script, description } = params
  const post = await client.post.update({
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

export type TPost = NonNullable<Awaited<ReturnType<typeof getPosts>>>[number]
export type TLike = TPost['likes'][number]
export type TUser = TPost['author']

const postPrimatives = {
  getPost,
  getPosts,
  createPost,
  deletePost,
  editPost,
}
export default postPrimatives
