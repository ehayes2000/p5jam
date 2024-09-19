import { treaty } from '@elysiajs/eden'
import type { App } from 'server'

export const client = treaty<App>('', {
  fetcher(url, options) {
    const [_, path] = url.toString().split('//')
    return fetch(`${import.meta.env.VITE_API_BASE}/${path}`, options)
  },
})

export const getMyId = async (): Promise<string | null> => {
  const cachedId = localStorage.getItem('uid')
  if (cachedId) return cachedId
  const id = await client.api.myid.get()
  if (id.data) {
    localStorage.setItem('uid', id.data.id)
    return id.data.id
  } else {
    return null
  }
}

export type TPost = NonNullable<
  Awaited<ReturnType<typeof client.api.posts.get>>['data']
>[number]
