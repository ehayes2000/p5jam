import { QueryClient, useQuery } from '@tanstack/react-query'
import { client } from '../client'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 100 * 60,
    },
  },
})

export const QUERY_KEYS = {
  USERS: ['users'],
  MY_ID: ['myID'],
  USER: (id: string) => ['users', id] as const,
  USER_POSTS: (id: string) => ['users', id, 'posts'] as const,
  POSTS: ['posts'] as const,
  POSTS_BY_ID: (id: string) => ['posts', id] as const,
  JAM_BY_ID: (id: string) => ['jams', id],
} as const

export const useMyID = () =>
  useQuery({
    queryKey: QUERY_KEYS.MY_ID,
    queryFn: async () => {
      const myId = await client.api.login.myid.get()
      if (myId.data) return myId.data.id
      else return null
    },
  })
