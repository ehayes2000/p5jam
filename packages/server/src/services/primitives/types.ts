import client, { type Prisma } from '../../prisma'

export type TUser = NonNullable<
  Awaited<ReturnType<typeof client.user.findFirst>>
>

export type TLike = NonNullable<
  Awaited<ReturnType<typeof client.like.findFirst>>
>

export type TComment = Prisma.CommentGetPayload<{
  include: {
    author: true
  }
}>

export type TPost = Prisma.PostGetPayload<{
  include: {
    comments: {
      include: {
        author: true
      }
    }
    author: true
    likes: true
    _count: {
      select: {
        comments: true
        likes: true
      }
    }
  }
}>

export type TJam = Prisma.JamGetPayload<{
  include: {
    creator: true
  }
}> & {
  activity: {
    posts: number
    participants: TUser[]
  }
}

type Equals<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
    ? true
    : false

type AssertTrue<A extends true> = A

// @ts-expect-error
type _fail = AssertTrue<TPost['author'], string>

type _post_author = AssertTrue<Equals<TPost['author'], TUser>>
type _post_comment = AssertTrue<Equals<TPost['comments'][number], TComment>>
type _post_like = AssertTrue<Equals<TPost['likes'], TLike[]>>
type _post_data = AssertTrue<Equals<TPost['script'], string>>
type _post_data_stats = AssertTrue<
  Equals<TPost['_count'], { comments: number; likes: number }>
>

type _comment_author = AssertTrue<Equals<TComment['author'], TUser>>
type _comment_vals = AssertTrue<Equals<TComment['text'], string>>

type _jam_participant = AssertTrue<
  Equals<TJam['activity']['participants'][number], TUser>
>
type _jam_data = AssertTrue<Equals<TJam['title'], string>>
type _jam_owner = AssertTrue<AssertTrue<Equals<TJam['creator'], TUser>>>
