import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import Post from '../components/Post'
import { QUERY_KEYS } from '../queries/client'

export default function User() {
  const { id } = useParams()

  const { data: myPosts } = useQuery({
    queryKey: QUERY_KEYS.USER_POSTS(id ?? ''),
    queryFn: async () => {
      const { data } = await client.api.posts.get({ query: { userId: id } })
      return data
    },
  })

  return (
    <div className="grid justify-center gap-4 p-6">
      {myPosts?.length ? (
        myPosts.map((p) => <Post key={p.id} post={p} />)
      ) : (
        <div> No posts for user {id} </div>
      )}
    </div>
  )
}
