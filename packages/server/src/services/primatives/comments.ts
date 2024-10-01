import { v4 as uuid } from 'uuid'
import client from '../../prisma'

async function createComment(params: {
  postId: string
  text: string
  userId: string
}) {
  const { postId, text, userId } = params
  const newComment = await client.comment.create({
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
  return { id: newComment.id }
}

async function deleteComment(params: { commentId: string; userId: string }) {
  const { commentId, userId } = params
  await client.comment.delete({
    where: {
      id: commentId,
      authorId: userId,
    },
  })
}

async function getComment({ id }: { id: string }): Promise<TComment> {
  const comments = await getComments({ id })
  return comments[0]
}

async function getComments(params: {
  id?: string
  authorId?: string
  postId?: string
}) {
  return client.comment.findMany({
    where: {
      authorId: params.authorId,
      id: params.id,
      postId: params.postId,
    },
    include: {
      author: true,
    },
  })
}

export type TComment = NonNullable<
  Awaited<ReturnType<typeof getComments>>
>[number]

const commentPrimatives = {
  createComment,
  deleteComment,
  getComment,
  getComments,
}

export default commentPrimatives
