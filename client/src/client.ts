import {
  getPosts as mockGetPosts,
  createPost as mockCreatePost,
  getUsers as mockGetUsers,
  createUser as mockCreateUser,
} from "./fakeServer";

import { type Post } from "./types";

export async function getPosts() {
  return mockGetPosts();
}

export async function createPost(
  post: Omit<Post, "published" | "likeCount" | "viewCount">
) {
  return mockCreatePost(post);
}

export async function getUsers() {
  return mockGetUsers();
}

export async function createUser(name: string) {
  return mockCreateUser(name);
}
