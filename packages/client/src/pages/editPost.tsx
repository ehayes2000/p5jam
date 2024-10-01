import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useSelector } from '@xstate/store/react'
import { client } from '../client'
import PostEditor from '../components/PostEditor'
import { store } from '../stateStore'
import { useEffect } from 'react'

function EditPost() {
  const post = useSelector(store, (state) => state.context.post)
  const { id } = useParams()
  const nav = useNavigate()
  useEffect(() => {
    console.log('ID', id, 'POST', post)
    if (!post && id) {
      client.api
        .posts({ id })
        .get()
        .then((p) => {
          if (p.data)
            store.send({ type: 'postCreated', payload: { post: p.data } })
        })
    }
  }, [])

  return (
    <div>
      {post ? (
        <PostEditor
          post={{ description: post.description, script: post.script }}
          callback={async ({ script, description }) => {
            const { data } = await client.api
              .posts({ id: post.id })
              .put({ script, description })
            if (!data) return
            if (data && data.jamId) {
              nav(`/jam/${data.jamId}`)
            } else {
              nav(`/profile`)
            }
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
