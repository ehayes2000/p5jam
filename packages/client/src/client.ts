import { treaty } from '@elysiajs/eden'
import type { App } from 'server'

export const client = treaty<App>('', {
  fetcher(url, options) {
    const [_, path] = url.toString().split('//')
    return fetch(`${import.meta.env.VITE_API_BASE}/${path}`, options)
  },
})

export const getMyId = async (): Promise<string | null> => {
  const myId = await client.api.login.myid.get()
  if (myId.data) return myId.data.id
  else return null
}

export type TPost = NonNullable<
  Awaited<ReturnType<typeof client.api.feed.get>>['data']
>[number]

export type TJam = NonNullable<
  NonNullable<Awaited<ReturnType<typeof client.api.jams.get>>>['data']
>[number]

export type TEditPost = NonNullable<
  Awaited<ReturnType<typeof client.api.posts.index.post>>['data']
>['post']
