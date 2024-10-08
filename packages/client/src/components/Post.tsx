import { useRef, useState, useEffect } from 'react'
import { client, TPost } from '../client'
import Comments from './Comments'
import { useMyID } from '../queries/queryClient'

export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="360" // TODO
      height="360"
      scrolling="no" // TODO
      className="rounded-sm"
      src={`${import.meta.env.VITE_API_BASE}/api/posts/${id}/script`}
    ></iframe>
  )
}

export default function Post({
  post: p,
  isComments,
}: {
  post: TPost
  isComments?: boolean
}) {
  const [isLiked, setIsLiked] = useState<boolean>()
  const [openComments, setOpenComments] = useState<boolean>(isComments ?? false)
  const [comments, setComments] = useState<typeof p.comments>(p.comments)
  const { data: myId } = useMyID()

  // TODO delete :)
  useEffect(() => {
    if (!myId) return
    p.likes.forEach((l) => {
      if (l.userId === myId) {
        setIsLiked(true)
      }
    })
  }, [])

  const postComment = async ({ text }: { text: string }) => {
    const newComment = await client.api
      .posts({ id: p.id })
      .comments.post({ text })
    if (newComment.data) setComments([newComment.data, ...comments])
  }

  const deleteComment = async ({ id }: { id: string }) => {
    await client.api.posts({ id: p.id }).comments({ commentId: id }).delete()
    setComments(comments.filter((c) => c.id !== id))
  }

  const pref = useRef(null)

  return (
    <div
      ref={pref}
      key={p.id}
      className="grid cursor-pointer content-center justify-center"
    >
      <div className="border p-2 gap-1 grid">
      <h2 className=""> {p.author.name} </h2>
      <Sketch id={p.id} />
      <div className=""> {p.description} </div>
      <div className="flex justify-start gap-4">
        <span>
          <button
            onClick={() => {
              if (isLiked) {
                client.api.posts({ id: p.id }).like.delete()
                p.likes = p.likes.filter((l) => l.userId !== 'me')
                setIsLiked(false)
              } else {
                client.api.posts({ id: p.id }).like.post()
                p.likes = [...p.likes, { postId: p.id, userId: 'me' }]
                setIsLiked(true)
              }
            }}
          >
            <i
              className={`bi ${isLiked ? 'bi-heart-fill text-rose-400' : 'bi-heart'}`}
            >
              {' '}
            </i>
            <span> {p.likes.length} </span>
          </button>
        </span>
        <span className="px-1">
          <button onClick={() => setOpenComments((p) => !p)}>
            <i className={`bi bi-chat`}></i>
            <span> {comments.length} </span>
          </button>
        </span>
        <span>
          <button>
            <i
              className={`bi bi-box-arrow-up`}
              onClick={() => {
                navigator.clipboard.writeText(`${origin}/posts/${p.id}`)
              }}
            ></i>
          </button>
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
    </div>
  )
}
