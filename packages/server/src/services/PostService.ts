import dbClient from '../prisma'
import { v4 as uuid } from 'uuid'
import Models from './models'

export default class PostService {
  private client: Models

  constructor(client: Models) {
    this.client = client
  }

  async list(params: { userId?: string; jamId?: string }) {
    return await this.client.getPosts({ filters: params })
  }

  async get(params: { id: string }) {
    return await this.client.getPost({ id: params.id })
  }

  async create(params: { userId: string; jamId?: string }) {
    // TODO: make jam id actually work
    const { userId, jamId } = params
    const postId = await this.client.createPost({ userId, jamId })
    if (!postId) throw new Error('Unexpected null postId on creation')
    const post = await this.client.getPost({ id: postId })
    if (!post) throw new Error('Unexpected null post on creation')
    return post
  }

  async delete(params: { userId: string; id: string }) {
    const { userId, id } = params
    await this.client.deletePost({ userId, id })
  }

  async edit(params: {
    id: string
    userId: string
    script: string
    description: string
  }) {
    const { id: editedId } = await this.client.editPost(params)
    return await this.client.getPost({ id: editedId })
  }

  async like(params: { id: string; userId: string }) {
    await this.client.likePost(params)
  }

  async deleteLike(params: { userId: string; id: string }) {
    await this.client.unlikePost(params)
  }

  async createComment(params: {
    postId: string
    text: string
    userId: string
  }) {
    const { id } = await this.client.createComment(params)
    const comment = await this.client.getComment({ id })
    return comment
  }

  async deleteComment(params: { commentId: string; userId: string }) {
    return await this.client.deleteComment(params)
  }
}
