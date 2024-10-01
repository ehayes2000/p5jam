import commentPrimatives from './primatives/comments'
import likePrimatives from './primatives/likes'
import primatives from './primatives/posts'

export default class PostService {
  constructor() {}

  async list(params: { userId?: string; jamId?: string }) {
    return await primatives.getPosts({ filters: params })
  }

  async get(params: { id: string }) {
    return await primatives.getPost({ id: params.id })
  }

  async create(params: { userId: string; jamId?: string }) {
    // TODO: make jam id actually work
    const { userId, jamId } = params
    const { id: postId } = await primatives.createPost({ userId, jamId })
    if (!postId) throw new Error('Unexpected null postId on creation')
    const post = await primatives.getPost({ id: postId })
    if (!post) throw new Error('Unexpected null post on creation')
    return post
  }

  async delete(params: { userId: string; id: string }) {
    const { userId, id } = params
    await primatives.deletePost({ userId, id })
  }

  async edit(params: {
    id: string
    userId: string
    script: string
    description: string
  }) {
    const { id: editedId } = await primatives.editPost(params)
    return await primatives.getPost({ id: editedId })
  }

  async like({ id, userId }: { id: string; userId: string }) {
    await likePrimatives.createLike({ postId: id, userId })
  }

  async deleteLike({ id, userId }: { userId: string; id: string }) {
    await likePrimatives.deleteLike({ postId: id, userId })
  }

  async createComment({
    postId,
    text,
    userId,
  }: {
    postId: string
    text: string
    userId: string
  }) {
    const { id: commentId } = await commentPrimatives.createComment({
      postId,
      text,
      userId,
    })
    return await commentPrimatives.getComment({ id: commentId })
  }

  async deleteComment({
    commentId,
    userId,
  }: {
    commentId: string
    userId: string
  }) {
    await commentPrimatives.deleteComment({ commentId, userId })
  }
}
