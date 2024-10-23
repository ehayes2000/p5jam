import type { TPost, TComment, TLike } from './types';
import { v4 as uuid } from 'uuid';
import client, { type Prisma } from '../../prisma';

const PAGE_SIZE = 100;

export type TPostData = Partial<
  NonNullable<Awaited<ReturnType<typeof client.post.findFirst>>>
>;

export async function get(filters: {
  data?: TPostData;
  authorIds?: string[];
  jamIds?: string[];
  authorNames?: string[];
  includeUnpublished?: boolean;
  isUnpublished?: boolean;
  offset?: number;
}): Promise<TPost[]> {
  const {
    data,
    authorIds,
    jamIds,
    includeUnpublished,
    authorNames,
    isUnpublished,
    offset,
  } = filters;
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
      ...(isUnpublished === true ? { published: false } : {}),
    },
    ...(offset ? { skip: offset, take: PAGE_SIZE } : {}),
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
  });
}

export type TPostCreateData = Omit<
  Omit<TPostData, 'authorId'> & { authorId: string },
  'id'
>;

export async function create(data: TPostCreateData): Promise<TPost> {
  if (data.jamId) {
    const now = new Date();
    const jam = await client.jam.findFirst({
      where: {
        id: data.jamId,
      },
      select: {
        endTime: true,
      },
    });
    if (!jam) throw new Error('Cannot post to nonexistent jam');
    if (jam.endTime < now) throw new Error('Cannt post to expired jam');
  }
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
  });
}

export async function deletePost(params: {
  id: string;
  authorId: string;
}): Promise<boolean> {
  const { id, authorId } = params;
  try {
    await client.post.delete({
      where: {
        id,
        authorId,
      },
    });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export type TPostUpdate = Omit<TPostData, 'id' | 'authorId' | 'jamId'> & {
  id: string;
  authorId: string;
};

export async function update(data: TPostUpdate): Promise<TPost> {
  const { id, authorId } = data;
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
  });
}
