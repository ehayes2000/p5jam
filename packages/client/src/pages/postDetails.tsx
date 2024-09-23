import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { client, TPost } from '../client'
import Post from '../components/Post'

export default function PostDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState<TPost | null>(null)
  useEffect(() => {
    ;(async () => {
      if (!id) {
        navigate('/error')
      } else {
        const post = await client.api.posts({ id }).get()
        if (post.data) {
          setPost(post.data)
        } else {
          navigate('/error')
        }
      }
    })()
  }, [])
  return (
    <div className="grid gap-4 justify-center p-6">
      {post ? <Post post={post} isComments={true} /> : 'loading ...'}
    </div>
  )
}
