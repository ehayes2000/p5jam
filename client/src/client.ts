import { type Post, type PostDraft } from './types'

// TODO error handling?
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/posts`)
  const posts = await response.json()
  return posts

  // return mockGetPosts();
}

export async function makePost(
  post: PostDraft
): Promise<'ok' | [number, string]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/makePost`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...post }),
  })
  return response.ok ? 'ok' : [response.status, response.statusText]
}

export async function getUsers() {
  return []
}

export async function createUser(_: string) {
  return
}
