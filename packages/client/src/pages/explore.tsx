import { useEffect, useState } from 'react'
import { client, TPost } from '../client'
import Post from '../components/Post'

function Explore() {
  const [posts, setPosts] = useState<TPost[]>([])
  useEffect(() => {
    ;(async () => {
      const { data } = await client.api.posts.get()
      console.log(data)
      if (data) setPosts(data)
    })()
  }, [])
  return (
    <div className="grid gap-4 justify-center p-6">
      {posts.map((p) => (
        <Post key={p.id} post={p} />
      ))}
    </div>
  )
}

export default Explore
