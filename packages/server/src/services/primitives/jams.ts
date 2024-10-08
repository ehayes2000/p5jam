import type { TJam } from './types'
import { v4 as uuid } from 'uuid'
import client, { type Prisma } from '../../prisma'

export type TJamData = Partial<
  NonNullable<Awaited<ReturnType<typeof client.jam.findFirst>>>
>

const trash = client.jam.findFirst({
  include: {
    creator: true,
    Post: {
      select: {
        author: true,
      },
    },
  },
})
type TrashType = NonNullable<Awaited<typeof trash>>

const transformPost = (t: TrashType): TJam => {
  const { Post: posts, ...rest } = t
  const uniqueParticipants = new Set()
  const participants = posts
    .filter(({ author }) => {
      if (uniqueParticipants.has(author.id)) {
        return false
      } else {
        uniqueParticipants.add(author.id)
        return true
      }
    })
    .map(({ author }) => author)
  return {
    ...rest,
    activity: {
      posts: posts.length,
      participants,
    },
  }
}

export async function get(filters: {
  id?: string
  ownerId?: string
  participantId?: string
  endingBefore?: Date
}): Promise<TJam[]> {
  const { id, ownerId, participantId, endingBefore } = filters
  const jams = await client.jam.findMany({
    where: {
      isDeleted: false,
      id,
      ownerId,
      ...(endingBefore
        ? {
            endTime: {
              lt: endingBefore,
            },
          }
        : {}),
      ...(participantId
        ? {
            Post: {
              some: {
                authorId: participantId,
              },
            },
          }
        : {}),
    },
    include: {
      creator: true,
      Post: {
        select: {
          author: true,
        },
      },
    },
  })
  return jams.map((j) => transformPost(j))
}

export type TJamCreateData = Required<TJamData>

export async function create(data: TJamCreateData): Promise<TJam> {
  const jam = await client.jam.create({
    data: { ...data },
    include: {
      creator: true,
      Post: {
        select: { author: true },
      },
    },
  })
  return transformPost(jam)
}

export type TJamUpdateData = Omit<TJamData, 'id' | 'ownerId'> & {
  id: string
  ownerId: string
}

export async function update(data: TJamUpdateData): Promise<TJam> {
  const { id, ownerId } = data
  const jam = await client.jam.update({
    where: {
      id,
      ownerId,
    },
    data,
    include: {
      creator: true,
      Post: {
        select: {
          author: true,
        },
      },
    },
  })
  return transformPost(jam)
}
