import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { client, TPost } from '../client'
import Post from '../components/Post'

export default function User() {
  const { id } = useParams()
  const [myPosts, setMyPosts] = useState<TPost[]>([])

  useEffect(() => {
    if (!id) return
    ;(async () => {
      const posts = await client.api.posts.index.get({ query: { userId: id } })
      if (posts.data) {
        setMyPosts(posts.data)
      }
    })()
  }, [])
  return (
    <div className="grid gap-4 justify-center p-6">
      {myPosts.length ? (
        myPosts.map((p) => <Post key={p.id} post={p} />)
      ) : (
        <div> No posts for user {id} </div>
      )}
    </div>
  )
}
