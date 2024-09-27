import { useSelector } from '@xstate/store/react'
import { client } from '../client'
import PostEditor from '../components/PostEditor'
import { store } from '../stateStore'

function EditPost() {
  const post = useSelector(store, (state) => state.context.post)

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
          callbackText="Post"
        /> // TODO reroute to profile?
      ) : (
        <></>
      )}
    </div>
  )
}

export default EditPost
