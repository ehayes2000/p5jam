import commentPrimatives from './primatives/comments'
import likePrimatives from './primatives/likes'
import postPrimatives from './primatives/posts'
import JamService from './JamService'

export default class PostService {
  private readonly jamService: JamService

  constructor(jamService: JamService) {
    this.jamService = jamService
  }

  async list(params: { userId?: string; jamId?: string }) {
    return await postPrimatives.getPosts({ filters: params })
  }

  async get(params: { id: string }) {
    return await postPrimatives.getPost({ id: params.id })
  }

  async create(params: { userId: string; jamId?: string }) {
    // TODO: make jam id actually work
    const { userId, jamId } = params
    if (jamId) {
      const isActive = await this.jamService.isActiveJam({ id: jamId })
      if (!isActive) throw new Error('Cannot create post for expired Jam')
    }
    const { id: postId } = await postPrimatives.createPost({ userId, jamId })
    if (!postId) throw new Error('Unexpected null postId on creation')
    const post = await postPrimatives.getPost({ id: postId })
    if (!post) throw new Error('Unexpected null post on creation')
    return post
  }

  async delete(params: { userId: string; id: string }) {
    const { userId, id } = params
    await postPrimatives.deletePost({ userId, id })
  }

  async edit(params: {
    id: string
    userId: string
    script: string
    description: string
  }) {
    const { id: editedId } = await postPrimatives.editPost(params)
    return await postPrimatives.getPost({ id: editedId })
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
