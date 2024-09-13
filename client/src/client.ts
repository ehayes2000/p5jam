import {
  getPosts as mockGetPosts,
  createPost as mockCreatePost,
  getUsers as mockGetUsers,
  createUser as mockCreateUser,
} from "./fakeServer";

import { type Post } from "./types";

// TODO error handling?
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/posts`);
  const posts = await response.json();
  return posts;
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
