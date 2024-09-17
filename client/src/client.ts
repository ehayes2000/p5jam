import { type Post, type PostDraft } from './types'

// TODO error handling?
export async function getPosts(): Promise<Post[]> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/posts`)
  const posts = await response.json()
  return posts
}

export async function makePost(
  post: PostDraft
): Promise<'ok' | [number, string]> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/profile/makePost`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...post }),
    }
  )
  return response.ok ? 'ok' : [response.status, response.statusText]
}

export async function getUsers() {
  return []
}

export async function createUser(_: string) {
  return
}

export async function getProfilePosts() {
  const response = await fetch(`${import.meta.env.VITE_API_BASE}/profile/posts`)
  const posts = await response.json()
  return posts
}

export async function deletePost(postId: string): Promise<boolean> {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE}/profile/deletePost`,
    {
      method: 'POST',
      body: JSON.stringify({
        postId,
      }),
      headers: { 'Content-Type': 'application/json' },
    }
  )
  return response.ok
}

export async function updatePost({
  postId,
  script,
  description,
}: {
  postId: string
  script: string
  description: string
}): Promise<boolean> {
  const updated = await fetch(
    `${import.meta.env.VITE_API_BASE}/profile/updatePost`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, description, script }),
    }
  )
  return updated.ok
}
