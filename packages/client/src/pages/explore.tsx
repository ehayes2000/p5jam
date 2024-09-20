import { useEffect, useState } from 'react'
import { client, TPost } from '../client'
import Post from '../components/Post'

function Explore() {
  const [posts, setPosts] = useState<TPost[]>([])
  const [myLikes, setMyLikes] = useState<Set<string>>(new Set())
  useEffect(() => {
    ;(async () => {
      const { data } = await client.api.posts.get()
      try {
        const myLikes = await client.api.users.likes.get()
        if (myLikes.data) setMyLikes(new Set(myLikes.data))

        console.log('MY LIKES', myLikes.data, data)
      } catch (_) {}
      if (data) setPosts(data)
    })()
  }, [])
  return (
    <div className="grid gap-4 justify-center p-6">
      {posts.map((p) => (
        <Post key={p.id} post={p} liked={myLikes.has(p.id)} />
      ))}
    </div>
  )
}

export default Explore
