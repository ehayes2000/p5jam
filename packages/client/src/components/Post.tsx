import { useState } from 'react'
import { client, TPost } from '../client'
import Comments from './Comments'

export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="360" // TODO
      height="360"
      scrolling="no" // TODO
      className="rounded-sm"
      src={`${import.meta.env.VITE_API_BASE}/api/posts/script/${id}`}
    ></iframe>
  )
}

export default function Post({ post: p }: { post: TPost }) {
  const [openComments, setOpenComments] = useState<boolean>(true)
  const postComment = async ({ text }: { text: string }) => {
    const ok = await client.api.comments.post({ text, postId: p.id })
    return ok.error === null
  }
  console.log(p)
  return (
    <div
      key={p.id}
      className="border rounded-md p-2 grid content-center justify-center gap-1"
    >
      <h2 className=""> {p.author.name} </h2>
      <Sketch id={p.id} />
      <div className=""> {p.description} </div>
      <div className="flex gap-4 justify-start">
        <span>
          <i className="bi bi-heart"> </i>
          <span> {p.likeCount} </span>
        </span>
        <span className="px-1">
          <i className={`bi  ${openComments ? 'bi-chat-fill' : 'bi-chat'}`}></i>
          <span> {p.commentCount} </span>
        </span>
      </div>
      {openComments ? (
        <Comments comments={p.comments} postComment={postComment} />
      ) : (
        <></>
      )}
    </div>
  )
}
