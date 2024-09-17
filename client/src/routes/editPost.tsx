import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostEditor from '../components/PostEditor'
import { type Post } from '../types'
import { updatePost } from '../client'

function EditPost() {
  const navigate = useNavigate()
  const location = useLocation()
  const { post } = location.state || {}

  useEffect(() => {
    if (!post) navigate('/')
  }, [post])

  return (
    <div>
      {post ? (
        <PostEditor
          post={{ description: post.description, script: post.script }}
          callback={async ({ script, description }) => {
            return await updatePost({
              postId: post.id,
              script: script,
              description: description,
            })
          }}
          callbackText="Update Post"
        /> // TODO reroute to profile?
      ) : (
        <></>
      )}
    </div>
  )
}

export default EditPost
