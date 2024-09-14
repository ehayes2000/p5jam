import {
  getPosts as mockGetPosts,
  createPost as mockCreatePost,
  getUsers as mockGetUsers,
  createUser as mockCreateUser,
} from "./fakeServer";

import { type Post, type PostDraft } from "./types";

// TODO error handling?
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/posts`);
  const posts = await response.json();
  return posts;

  // return mockGetPosts();
}

export async function makePost(
  post: PostDraft
): Promise<"ok" | [number, string]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/makePost`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...post }),
  });
  return response.ok ? "ok" : [response.status, response.statusText];
}

export async function getUsers() {
  return mockGetUsers();
}

export async function createUser(name: string) {
  return mockCreateUser(name);
}
