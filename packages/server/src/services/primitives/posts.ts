import type { TPost, TComment, TLike } from './types'
import { v4 as uuid } from 'uuid'
import client, { type Prisma } from '../../prisma'

export type TPostData = Partial<
  NonNullable<Awaited<ReturnType<typeof client.post.findFirst>>>
>

export async function get(filters: {
  data?: TPostData
  authorIds?: string[]
  jamIds?: string[]
  authorNames?: string[]
  includeUnpublished?: boolean
}): Promise<TPost[]> {
  const { data, authorIds, jamIds, includeUnpublished, authorNames } = filters
  return await client.post.findMany({
    where: {
      ...data,
      ...(authorIds
        ? {
            authorId: { in: authorIds },
          }
        : {}),
      ...(jamIds
        ? {
            jamId: { in: jamIds },
          }
        : {}),
      ...(authorNames
        ? {
            author: {
              name: {
                in: authorNames,
              },
            },
          }
        : {}),
      ...(includeUnpublished === true ? {} : { published: true }),
    },
    include: {
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
      author: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export type TPostCreateData = Omit<
  Omit<TPostData, 'authorId'> & { authorId: string },
  'id'
>

export async function create(data: TPostCreateData): Promise<TPost> {
  return await client.post.create({
    data: { ...data, id: uuid() },
    include: {
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
      author: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })
}

export async function deletePost(params: {
  id: string
  authorId: string
}): Promise<boolean> {
  const { id, authorId } = params
  try {
    await client.post.delete({
      where: {
        id,
        authorId,
      },
    })
    return true
  } catch (_) {
    return false
  }
}

export type TPostUpdate = Omit<TPostData, 'id' | 'authorId' | 'jamId'> & {
  id: string
  authorId: string
}

export async function update(data: TPostUpdate): Promise<TPost> {
  const { id, authorId } = data
  return await client.post.update({
    where: {
      id,
      authorId,
    },
    data,
    include: {
      comments: {
        include: {
          author: true,
        },
      },
      likes: true,
      author: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })
}
