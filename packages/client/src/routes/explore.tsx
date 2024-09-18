import { useEffect, useState } from 'react'
import { client } from '../client'
import Post from '../components/Post'

function Explore() {
  const [posts, setPosts] = useState<
    NonNullable<Awaited<ReturnType<typeof client.api.posts.get>>['data']>
  >([])
  useEffect(() => {
    ;(async () => {
      const { data } = await client.api.posts.get()
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
