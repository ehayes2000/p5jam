import PostEditor from '../components/PostEditor'
import { type PostDraft } from '../types'
import { makePost } from '../client'

const newDraft = (): PostDraft => {
  return {
    script: DEFAULT_SCRIPT,
    description: '',
  }
}

const DEFAULT_SCRIPT = `
const WIDTH=360
const HEIGHT=360
function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  // TODO
}
`
export default function NewPost() {
  return (
    <div className="">
      <PostEditor
        callback={async (description, script) => {
          const newPost = await makePost({ description, script })
          return newPost === 'ok'
        }}
        callbackText="Post"
        post={newDraft()}
      />
    </div>
  )
}
