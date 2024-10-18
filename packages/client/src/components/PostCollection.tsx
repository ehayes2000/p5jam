import { useState } from "react"
import Post from "../components/Post"
import type { TPost } from "../client"
import { client } from "../client"

export default function PostCollection(props: { posts: TPost[], showJam?: boolean }) {
  const [posts, setPosts] = useState<TPost[]>(props.posts)
  const deleteCallback = (id: string) => {
    return () => {
      if (confirm("Are you sure you want to delete this post?")) {
        client.api.posts({ id }).delete()
        setPosts(p => p.filter(post => post.id !== id))
      }
    }
  }
  return (
    < div className="grid justify-center gap-4 p-6" >
      {
        posts?.length ? (
          posts.map((p) => <Post key={p.id} post={p} deletePost={deleteCallback(p.id)} showJam={props.showJam ?? false} />)
        ) : (
          <div> No Posts Yet :( </div>
        )
      }
    </div >
  )
}