import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import Post from '../components/Post'
import { QUERY_KEYS } from '../queries/queryClient'

export default function PostDetails() {
  const { id } = useParams()
  const { data: post } = useQuery({
    queryKey: QUERY_KEYS.POSTS_BY_ID(id ?? ''),
    queryFn: async () => {
      const { data } = await client.api.posts({ id: id ?? '' }).get()
      return data
    },
  })

  return (
    <div className="grid justify-center gap-4 p-6">
      {post ? <Post post={post} isComments={true} /> : 'loading ...'}
    </div>
  )
}
