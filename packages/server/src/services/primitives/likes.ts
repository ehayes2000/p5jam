import type { TLike } from './types'
import client from '../../prisma'

const queryLike = client.like.findFirst

export async function get(
  filters:
    | { userId: string; postId?: never }
    | { postId: string; userId?: never },
): Promise<TLike[]> {
  const { userId, postId } = filters
  return await client.like.findMany({
    where: {
      postId,
      userId,
    },
  })
}

export async function create(data: TLike): Promise<TLike> {
  return await client.like.create({
    data,
  })
}

export async function deleteLike(like: TLike): Promise<boolean> {
  try {
    await client.like.delete({
      where: {
        userId_postId: like,
      },
    })
    return true
  } catch (_) {
    return false
  }
}
