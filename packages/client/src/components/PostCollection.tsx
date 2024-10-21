import { useState, useEffect } from "react"
import Post from "../components/Post"
import type { TPost } from "../client"

export default function PostCollection(props: { posts: TPost[], showJam?: boolean }) {
  const [posts, setPosts] = useState<TPost[]>(props.posts)
  const deleteCallback = (id: string) => {
    return () => {
      setPosts(p => p.filter(post => post.id !== id))
    }
  }
  return (
    <div className="grid justify-center gap-4 p-6" >
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


export function JamPostCollection(props: { jamId: string }) {
  const postMap: Map<string, TPost> = new Map()
  const [posts, setPosts] = useState<TPost[]>([])
  const deleteCallback = (id: string) => {
    return () => {
      setPosts(p => p.filter(post => post.id !== id))
    }
  }
  useEffect(() => {
    const feed = new WebSocket(`/ws/jam?jamId=${props.jamId}`)
    feed.addEventListener("message", ({ data }) => {
      const { add, remove } = JSON.parse(data) as { add?: TPost[], remove?: string[] }
      if (remove) {
        remove.forEach(id => {
          if (postMap.has(id))
            postMap.delete(id)
        })
        setPosts([...postMap.values()])
      }
      if (add)
        setPosts(_ => {
          add.forEach(p => {
            postMap.set(p.id, p)
          })
          const update = [...postMap.values()]
          // update.sort((a, b) => b.updatedAt - a.updatedAt)
          update.sort((a, b) => (Number(new Date(b.updatedAt)) - Number(new Date(a.updatedAt))))
          return update
        })
    })

    return () => {
      try {
        feed.close()
      } catch (_) { }
    }
  }, [])

  return (
    <div className="grid justify-center gap-4 p-6" >
      {
        posts.map((p) => <Post key={`${p.id}-${p.updatedAt}`} post={p} deletePost={deleteCallback(p.id)} showJam={false} />)
      }
    </div >
  )
}