import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useSelector } from '@xstate/store/react'
import { client } from '../client'
import PostEditor from '../components/PostEditor'
import { store } from '../stateStore'
import { useEffect } from 'react'

function EditPost() {
  const { post, jam } = useSelector(store, (state) => state.context)
  const { id } = useParams()
  const nav = useNavigate()

  useEffect(() => {
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

  const updatePost = async ({
    script,
    description,
  }: {
    script: string
    description: string
  }) => {
    if (!post) return
    const { data } = await client.api
      .posts({ id: post.id })
      .put({ script, description })
    if (!data) return

    if (data && data.jamId && jam && data.jamId === jam.id) {
      nav(`/jam/${data.jamId}`)
    } else {
      nav(`/profile`)
    }
  }
  return (
    <div>
      {post ? (
        <PostEditor
          post={{ description: post.description, script: post.script }}
          callback={updatePost}
          callbackText="Post"
        /> // TODO reroute to profile?
      ) : (
        <></>
      )}
    </div>
  )
}

export default EditPost
