import { useState, useEffect, useRef } from 'react'
import { client, TPost, getMyId } from '../client'
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
  const [myId, setMyId] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState<boolean>()
  const [openComments, setOpenComments] = useState<boolean>(false)
  const [comments, setComments] = useState<typeof p.comments>(p.comments)

  const postComment = async ({ text }: { text: string }) => {
    const newComment = await client.api.comments.post({ text, postId: p.id })
    if (newComment.data) setComments([newComment.data, ...comments])
  }

  const deleteComment = async ({ id }: { id: string }) => {
    await client.api.comments.delete({ id })
    setComments(comments.filter((c) => c.id !== id))
  }

  const pref = useRef(null)

  // TODO
  useEffect(() => {
    if (pref.current) {
      const width = pref.current.offsetWidth
      pref.current.style.width = `${width}px`
    }
    getMyId().then((id) => {
      setIsLiked(p.likes.includes(id ?? ''))
    })
  }, [])

  return (
    <div
      ref={pref}
      key={p.id}
      className="border rounded-md p-2 grid content-center justify-center gap-1"
    >
      <h2 className=""> {p.author.name} </h2>
      <Sketch id={p.id} />
      <div className=""> {p.description} </div>
      <div className="flex gap-4 justify-start">
        <span>
          <button
            onClick={() => {
              if (isLiked) {
                client.api.posts({ id: p.id }).like.delete()
                p.likeCount -= 1
                setIsLiked(false)
              } else {
                client.api.posts({ id: p.id }).like.post()
                p.likeCount += 1
                setIsLiked(true)
              }
            }}
          >
            <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}> </i>
          </button>
          <span> {p.likeCount} </span>
        </span>
        <span className="px-1">
          <button onClick={() => setOpenComments(!openComments)}>
            <i
              className={`bi  ${openComments ? 'bi-chat-fill' : 'bi-chat'}`}
            ></i>
          </button>
          <span> {comments.length} </span>
        </span>
      </div>
      {openComments ? (
        <div className="">
          <Comments
            comments={comments}
            postComment={postComment}
            deleteComment={deleteComment}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
