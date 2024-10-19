import { makePostRoutes } from '../src/routes/posts';
import { get } from '../src/services/primitives/posts';
import JamService from '../src/services/JamService';
import { describe, expect, test, beforeAll, afterAll } from 'bun:test';
import { authorizeUser, unauthorizeUser } from './util';
import { treaty } from '@elysiajs/eden';
import client from '../src/prisma';

// Constants for test users
const AUTHOR_ID = 'testUserAuthor';
const COMMENTER_ID = 'testUserCommenter';

// Create server and client instances for author and commenter
const authorServer = makePostRoutes(authorizeUser(AUTHOR_ID));
const authorClient = treaty(authorServer);
const commenterServer = makePostRoutes(authorizeUser(COMMENTER_ID));
const commenterClient = treaty(commenterServer);
const unauthorizedServer = makePostRoutes(unauthorizeUser());
const unauthorizedClient = treaty(unauthorizedServer);

const makeUser = async (params: { name: string; id: string }) => {
  const { name, id } = params;
  return client.user.create({
    data: {
      name,
      id,
    },
  });
};

describe('Post Routes', () => {
  let createdPostId: string;
  let createdCommentId: string;
  let testJamId: string;
  beforeAll(async () => {
    const jamService = new JamService();
    await makeUser({ name: 'Author User', id: AUTHOR_ID });
    await makeUser({ name: 'Commenter User', id: COMMENTER_ID });
    const jam = await jamService.create({
      durationMs: 100000,
      title: 'test',
      userId: AUTHOR_ID,
    });
    expect(jam.creator.id).toBe(AUTHOR_ID);
    testJamId = jam.id;
    // // Clean up any existing test data
    const posts = await authorClient.posts.get({
      query: { userId: AUTHOR_ID },
    });
    if (!posts.data) return;
    for (const post of posts.data) {
      await authorClient.posts[post.id].delete();
    }
  });

  test('Create a new post', async () => {
    const response = (await authorClient.posts.post({
      jamId: testJamId,
    })) as any;
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data?.authorId).toBe(AUTHOR_ID);
    expect(response.data?.jamId).toBe(testJamId);
    expect(response.data?.published).toBe(false);
    createdPostId = response.data?.id!;
  });
  test('Created posts are unpublished', async () => {
    const { data } = await authorClient.posts.get({
      query: { userId: AUTHOR_ID },
    });
    expect(data?.length).toBe(0);
    const { data: jamData } = await authorClient.posts.get({
      query: { jamId: testJamId },
    });
    expect(jamData?.length).toBe(0);
  });
  test('Publish post on edit', async () => {
    const { data } = (await authorClient.posts({ id: createdPostId }).put({
      description: 'a new description',
      script: "this isn't javascript",
      published: true,
    })) as any;
    expect(data).not.toBe(null);
    expect(data?.description).toBe('a new description');
    expect(data?.script).toBe("this isn't javascript");
    expect(data?.published).toBe(true);
    const { data: fetched } = await authorClient.posts.get({
      query: { userId: AUTHOR_ID },
    });
    expect(fetched).not.toBe(null);
    expect(fetched?.length).toBeGreaterThan(0);
    const { data: fetchedJamId } = await authorClient.posts.get({
      query: { jamId: testJamId },
    });
    expect(fetchedJamId).not.toBe(null);
    expect(fetchedJamId?.length).toBeGreaterThan(0);
    expect(fetched?.[0].id).toBe(fetchedJamId?.[0].id!);
  });
  test('Get posts by user', async () => {
    const allPosts = await get({});
    const response = await authorClient.posts.get({
      query: { userId: AUTHOR_ID },
    });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data?.length).toBeGreaterThan(0);
    expect(response.data?.[0]).toHaveProperty('id', createdPostId);
  });

  test('Get a specific post', async () => {
    const response = await authorClient.posts[createdPostId].get();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', createdPostId);
    expect(response.data.authorId).toBe(AUTHOR_ID);
  });

  test('Update a post', async () => {
    const response = await authorClient.posts[createdPostId].put({
      script: 'console.log("Updated script")',
      description: 'Updated description',
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id', createdPostId);
    expect(response.data.script).toBe('console.log("Updated script")');
    expect(response.data.description).toBe('Updated description');
    expect(response.data.published).toBe(true);
  });

  test('Create a comment', async () => {
    const response = await commenterClient.posts[createdPostId].comments.post({
      text: 'Test comment',
    });

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data.authorId).toBe(COMMENTER_ID);
    expect(response.data.postId).toBe(createdPostId);
    expect(response.data.text).toBe('Test comment');
    createdCommentId = response.data.id;
  });

  test('Delete a comment', async () => {
    const response =
      await commenterClient.posts[createdPostId].comments[
        createdCommentId
      ].delete();
    expect(response.status).toBe(200);
  });

  test('Like a post', async () => {
    const response = await commenterClient.posts[createdPostId].like.post();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('userId', COMMENTER_ID);
    expect(response.data).toHaveProperty('postId', createdPostId);
  });

  test('Unlike a post', async () => {
    const response = await commenterClient.posts[createdPostId].like.delete();
    expect(response.status).toBe(200);
  });

  // TODO test when implemented
  // test('Get featured post', async () => {
  //   const response = await unauthorizedClient.posts.featured.get()
  //   expect(response.status).toBe(200)
  //   expect(response.data).toHaveProperty('id')
  // })

  test('Get post script', async () => {
    const response = await unauthorizedClient.posts[createdPostId].script.get();
    expect(response.status).toBe(200);
    expect(response.data).toContain('console.log("Updated script")');
  });

  test('Unauthorized user cannot create a post', async () => {
    const response = await unauthorizedClient.posts.post({
      jamId: testJamId,
    });
    expect(response.status).toBe(401);
  });

  test('Non-author cannot update a post', async () => {
    const response = await commenterClient.posts[createdPostId].put({
      script: 'console.log("Unauthorized update")',
      description: 'This should fail',
    });
    expect(response.status).toBe(404);
  });

  test('Delete a post', async () => {
    const response = await authorClient.posts[createdPostId].delete();
    expect(response.status).toBe(200);

    // Verify the post is deleted
    const getResponse = await authorClient.posts[createdPostId].get();
    expect(getResponse.status).toBe(404);
  });

  afterAll(async () => {
    // Clean up any remaining test data
    const posts = await authorClient.posts.get({
      query: { userId: AUTHOR_ID },
    });
    if (!posts.data) return;
    for (const post of posts.data) {
      await authorClient.posts[post.id].delete();
    }
  });
});
