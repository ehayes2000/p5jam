import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { client } from '../client'
import PostEditor from '../components/PostEditor'

function EditPost() {
  const navigate = useNavigate()
  const location = useLocation()
  const { post } =
    (location.state as {
      post: { id: string; description: string; script: string }
    }) || null

  useEffect(() => {
    if (!post) navigate('/')
  }, [post])

  return (
    <div>
      {post ? (
        <PostEditor
          post={{ description: post.description, script: post.script }}
          callback={async ({ script, description }) => {
            const response = await client.api
              .posts({ id: post.id })
              .put({ script, description })
            return response.error === null
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
