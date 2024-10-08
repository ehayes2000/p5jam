import type { TComment } from './types'
import { v4 as uuid } from 'uuid'
import client, { type Prisma } from '../../prisma'

const INCLUDE_FIELDS: Prisma.CommentInclude = {
  author: true,
}

export type TCommentPartial = Partial<TComment>

export async function get(filters: {
  data: TCommentPartial
}): Promise<TComment[]> {
  const { data } = filters
  return await client.comment.findMany({
    where: {
      ...data,
    },
    include: {
      ...INCLUDE_FIELDS,
    },
  })
}

export async function create(params: {
  data: Omit<TComment, 'id' | 'author'>
}): Promise<TComment> {
  const { data } = params
  return await client.comment.create({
    data: { ...data, id: uuid() },
    include: {
      ...INCLUDE_FIELDS,
    },
  })
}

export async function deleteComment(params: {
  id: string
  authorId: string
}): Promise<boolean> {
  const { id, authorId } = params
  try {
    await client.comment.delete({
      where: { id, authorId },
    })
    return true
  } catch (_) {
    return false
  }
}
