import PostEditor from '../components/PostEditor'
import { client } from '../client'

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
        callback={async ({ description, script }) => {
          const newPost = await client.api.posts.post({
            script,
            description,
          })
          return newPost.error === null
        }}
        callbackText="Post"
        post={{
          script: DEFAULT_SCRIPT,
          description: '',
        }}
      />
    </div>
  )
}
