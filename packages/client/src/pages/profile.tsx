import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Post from '../components/Post'
import { client, getMyId, TPost } from '../client'

function Profile() {
  const navigate = useNavigate()
  const [myPosts, setMyPosts] = useState<TPost[]>()

  useEffect(() => {
    ;(async () => {
      const myId = await getMyId()
      if (!myId) {
        setMyPosts([])
        return
      }
      const posts = await client.api.users({ id: myId }).posts.get()
      if (posts.data) {
        setMyPosts(posts.data)
      }
    })()
  }, [])

  const deletePost = async (id: string) => {
    const updated = await client.api.posts({ id }).delete()
    if (updated.data) {
      setMyPosts(updated.data)
    }
  }

  const editPost = (post: {
    id: string
    description: string
    script: string
  }) => {
    return navigate(`/editPost`, {
      state: {
        post,
      },
    })
  }

  return (
    <div className="grid gap-4 justify-center p-6">
      {myPosts ? (
        <>
          {myPosts.map((p) => (
            <div key={p.id}>
              <div className="p-1 flex lex gap-1">
                <button
                  onClick={() => editPost(p)}
                  className="bg-gray-200 px-2 rounded-sm hover:bg-gray-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => deletePost(p.id)}
                  className="bg-gray-200 px-2 rounded-sm hover:bg-gray-300"
                >
                  Delete
                </button>
              </div>
              <Post key={p.id} post={p} />
            </div>
          ))}
        </>
      ) : (
        <Link to="/login" />
      )}
    </div>
  )
}

export default Profile