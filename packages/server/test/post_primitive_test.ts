import {
  describe,
  expect,
  test,
  beforeAll,
  beforeEach,
  afterAll,
} from 'bun:test'
import {
  get,
  create,
  update,
  deletePost,
} from '../src/services/primitives/posts'
import prisma from '../src/prisma'

describe('get function', () => {
  beforeAll(async () => {
    // Set up test data
    await prisma.user.createMany({
      data: [
        { id: 'user1', name: 'User 1' },
        { id: 'user2', name: 'User 2' },
        { id: 'user3', name: 'User 3' },
      ],
    })

    await prisma.jam.createMany({
      data: [
        { id: 'jam1', ownerId: 'user1', endTime: new Date(), title: 'Jam 1' },
        { id: 'jam2', ownerId: 'user2', endTime: new Date(), title: 'Jam 2' },
      ],
    })

    await prisma.post.createMany({
      data: [
        { id: 'post1', authorId: 'user1', published: true, jamId: 'jam1' },
        { id: 'post2', authorId: 'user1', published: false, jamId: 'jam1' },
        { id: 'post3', authorId: 'user2', published: true, jamId: 'jam2' },
        { id: 'post4', authorId: 'user3', published: true },
        { id: 'post5', authorId: 'user3', published: false },
      ],
    })

    await prisma.comment.createMany({
      data: [
        {
          id: 'comment1',
          authorId: 'user2',
          postId: 'post1',
          text: 'Comment 1',
        },
        {
          id: 'comment2',
          authorId: 'user3',
          postId: 'post1',
          text: 'Comment 2',
        },
      ],
    })

    await prisma.like.createMany({
      data: [
        { userId: 'user2', postId: 'post1' },
        { userId: 'user3', postId: 'post1' },
      ],
    })
  })
  afterAll(async () => {
    await prisma.like.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
    // await prisma.jam.deleteMany()
    // await prisma.user.deleteMany()
  })
  test('get all published posts', async () => {
    const posts = await get({})
    expect(posts.length).toBe(3)
    expect(posts.every((post) => post.published)).toBe(true)
  })

  test('get all posts including unpublished', async () => {
    const posts = await get({ includeUnpublished: true })
    expect(posts.length).toBe(5)
  })

  test('filter by author IDs', async () => {
    const posts = await get({ authorIds: ['user1', 'user2'] })
    expect(posts.length).toBe(2)
    expect(
      posts.every((post) => ['user1', 'user2'].includes(post.authorId)),
    ).toBe(true)
  })

  test('filter by jam IDs', async () => {
    const posts = await get({ jamIds: ['jam1'] })
    expect(posts.length).toBe(1)
    expect(posts[0].jamId).toBe('jam1')
  })

  test('filter by author names', async () => {
    const posts = await get({ authorNames: ['User 1', 'User 2'] })
    expect(posts.length).toBe(2)
    expect(
      posts.every((post) => ['User 1', 'User 2'].includes(post.author.name)),
    ).toBe(true)
  })

  test('intersectional filtering', async () => {
    const posts = await get({
      authorIds: ['user1'],
      jamIds: ['jam1'],
      includeUnpublished: true,
    })
    expect(posts.length).toBe(2)
    expect(
      posts.every((post) => post.authorId === 'user1' && post.jamId === 'jam1'),
    ).toBe(true)
  })

  test('check included relations', async () => {
    const posts = await get({ authorIds: ['user1'] })
    expect(posts.length).toBe(1)
    const post = posts[0]

    expect(post.comments).toBeDefined()
    expect(post.comments.length).toBe(2)
    expect(post.comments[0].author).toBeDefined()

    expect(post.likes).toBeDefined()
    expect(post.likes.length).toBe(2)

    expect(post.author).toBeDefined()
    expect(post.author.name).toBe('User 1')

    expect(post._count).toBeDefined()
    expect(post._count.likes).toBe(2)
    expect(post._count.comments).toBe(2)
  })

  test('check ordering', async () => {
    const posts = await get({ includeUnpublished: true })
    expect(posts.length).toBe(5)

    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
        posts[i].createdAt.getTime(),
      )
    }
  })

  test('filter with empty result', async () => {
    const posts = await get({ authorIds: ['nonexistent'] })
    expect(posts.length).toBe(0)
  })

  test('filter with custom data', async () => {
    const posts = await get({ data: { description: '' } })
    expect(posts.length).toBe(3)
    expect(posts.every((post) => post.description === '')).toBe(true)
  })
})

describe('Post CRUD operations', () => {
  let userId: string
  let jamId: string

  beforeEach(async () => {
    await prisma.like.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.post.deleteMany()
  })

  beforeAll(async () => {
    // Set up test user and jam
    const user = await prisma.user.create({
      data: { id: 'testUser', name: 'Test User' },
    })
    userId = user.id
    expect(userId).toBe('testUser')

    const users = await prisma.user.findMany()
    const jam = await prisma.jam.create({
      data: {
        id: 'testJam',
        ownerId: userId,
        endTime: new Date(),
        title: 'Test Jam',
      },
    })
    jamId = jam.id
    expect(jamId).toBe('testJam')
    expect(jam.ownerId).toBe(userId)
  })

  describe('create function', () => {
    test('should create a new post', async () => {
      const postData = {
        authorId: userId,
        description: 'Test post',
        script: 'Test script',
        jamId: jamId,
      }
      const createdPost = await create(postData)
      expect(createdPost).toBeDefined()
      expect(createdPost.id).toBeDefined()
      expect(createdPost.authorId).toBe(userId)
      expect(createdPost.published).toBe(false)
      expect(createdPost.description).toBe('Test post')
      expect(createdPost.script).toBe('Test script')
      expect(createdPost.jamId).toBe(jamId)
      // Check included relations
      expect(createdPost.comments).toEqual([])
      expect(createdPost.likes).toEqual([])
      expect(createdPost.author).toBeDefined()
      expect(createdPost.author.id).toBe(userId)
      expect(createdPost._count).toBeDefined()
      expect(createdPost._count.likes).toBe(0)
      expect(createdPost._count.comments).toBe(0)
    })

    test('should create a post without a jam', async () => {
      const postData = {
        authorId: userId,
        published: false,
        description: 'No jam post',
        content: 'Content without jam',
        script: '',
      }
      const createdPost = await create(postData)
      expect(createdPost).toBeDefined()
      expect(createdPost.jamId).toBeNull()
    })
  })

  describe('deletePost function', () => {
    test('should delete an existing post', async () => {
      const post = await prisma.post.create({
        data: {
          id: 'testPostId',
          authorId: userId,
          published: true,
          description: 'To be deleted',
        },
      })

      const result = await deletePost({ id: post.id, authorId: userId })
      expect(result).toBe(true)

      const deletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(deletedPost).toBeNull()
    })

    test('should return false when trying to delete a non-existent post', async () => {
      const result = await deletePost({ id: 'nonExistentId', authorId: userId })
      expect(result).toBe(false)
    })

    test('should return false when trying to delete a post with wrong authorId', async () => {
      const post = await prisma.post.create({
        data: {
          id: 'testPostId',
          authorId: userId,
          published: true,
          description: 'Wrong author',
        },
      })

      const result = await deletePost({
        id: post.id,
        authorId: 'wrongAuthorId',
      })
      expect(result).toBe(false)

      const notDeletedPost = await prisma.post.findUnique({
        where: { id: post.id },
      })
      expect(notDeletedPost).not.toBeNull()
    })
  })

  describe('update function', () => {
    test('should update an existing post', async () => {
      const post = await prisma.post.create({
        data: {
          id: 'testPostId',
          authorId: userId,
          published: true,
          description: 'Original description',
          content: 'Original content',
          script: 'Original script',
        },
      })

      const updatedData = {
        id: post.id,
        authorId: userId,
        published: false,
        description: 'Updated description',
        content: 'Updated content',
        script: 'Updated script',
      }

      const updatedPost = await update(updatedData)

      expect(updatedPost).toBeDefined()
      expect(updatedPost.id).toBe(post.id)
      expect(updatedPost.authorId).toBe(userId)
      expect(updatedPost.published).toBe(false)
      expect(updatedPost.description).toBe('Updated description')
      expect(updatedPost.content).toBe('Updated content')
      expect(updatedPost.script).toBe('Updated script')

      // Check included relations
      expect(updatedPost.comments).toBeDefined()
      expect(updatedPost.likes).toBeDefined()
      expect(updatedPost.author).toBeDefined()
      expect(updatedPost._count).toBeDefined()
    })

    test('should throw an error when updating a non-existent post', async () => {
      const updateData = {
        id: 'nonExistentId',
        authorId: userId,
        published: true,
        description: 'Non-existent post',
        content: '',
        script: '',
      }

      await expect(update(updateData)).rejects.toThrow()
    })

    test('should throw an error when updating with wrong authorId', async () => {
      const post = await prisma.post.create({
        data: {
          id: 'testPostId',
          authorId: userId,
          published: true,
          description: 'Original description',
        },
      })

      const updateData = {
        id: post.id,
        authorId: 'wrongAuthorId',
        published: false,
        description: 'Should not update',
        content: '',
        script: '',
      }
      await expect(update(updateData)).rejects.toThrow()
    })
  })
})
