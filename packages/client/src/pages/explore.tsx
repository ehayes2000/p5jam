import { useQuery } from '@tanstack/react-query'
import { client } from '../client'
import Post from '../components/Post'
import { QUERY_KEYS } from '../queries/client'

function Explore() {
  const { data: posts } = useQuery({
    queryKey: QUERY_KEYS.POSTS,
    queryFn: async () => {
      const { data } = await client.api.feed.get()
      return data
    },
  })

  return (
    <div className="grid justify-center gap-4 p-6">
      {posts?.map((p) => (
        <div key={p.id}>
          <Post key={p.id} post={p} />
        </div>
      ))}
    </div>
  )
}

export default Explore
