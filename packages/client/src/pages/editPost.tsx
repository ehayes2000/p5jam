import useStore from '../stateStore'
import { client } from '../client'
import PostEditor from '../components/PostEditor'

function EditPost() {
  const { post } = useStore()
  console.log('EDIT POST', post)

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
