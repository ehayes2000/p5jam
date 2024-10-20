import { useNavigate, Link } from 'react-router-dom'
import { type ReactNode, useRef, useState, useEffect, useContext } from 'react'
import { client, TPost } from '../client'
import { LoginContext } from "../login"
import Comments from './Comments'
import JamTag from './JamTag'


export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="360" // TODO
      height="360"
      scrolling="no" // TODO
      className="rounded-sm "
      src={`${import.meta.env.VITE_API_BASE}/api/posts/${id}/script`}
    />
  )
}

export default function Post({
  post: p,
  showJam,
  isComments,
  deletePost: deleteCallback,
  sketch
}: {
  post: TPost
  deletePost?: () => void,
  showJam: boolean,
  isComments?: boolean,
  sketch?: ReactNode
}) {
  const [isLiked, setIsLiked] = useState<boolean>()
  const [openComments, setOpenComments] = useState<boolean>(isComments ?? false)
  const [comments, setComments] = useState<typeof p.comments>(p.comments)
  const [likes, setLikes] = useState<number>(p.likes.length)
  const { user } = useContext(LoginContext)
  const nav = useNavigate()

  useEffect(() => {
    if (!user?.id) return
    p.likes.forEach((l) => {
      if (l.userId === user.id) {
        setIsLiked(true)
      }
    })
  }, [user])

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
  const editPost = () => nav(`/editPost/${p.id}`)
  const pref = useRef(null)

  const deletePost = async () => {
    if (confirm("Are you sure you want to delete this post?")) {
      if (deleteCallback)
        deleteCallback()
      await client.api.posts({ id: p.id }).delete()
    }
  }

  return (
    <div
      ref={pref}
      key={p.id}
      className="grid content-center justify-center "
    >
      <div className="border p-2 gap-1 grid">
        <div className="flex justify-between">
          <Link to={`/user/${p.author.name}`}> {p.author.name} </Link>
          {
            showJam && p.jamId ? <JamTag jamId={p.jamId} /> : <></>
          }
        </div>
        {sketch ??
          <Sketch id={p.id} />}

        <div className="flex justify-between">
          <div className="flex justify-start gap-4">
            <span>
              <button
                onClick={() => {
                  if (isLiked) {
                    client.api.posts({ id: p.id }).like.delete()
                    p.likes = p.likes.filter((l) => l.userId !== 'me')
                    setLikes(p => p - 1)
                    setIsLiked(false)
                  } else {
                    client.api.posts({ id: p.id }).like.post()
                    p.likes = [...p.likes, { postId: p.id, userId: 'me' }]
                    setLikes(p => p + 1)
                    setIsLiked(true)
                  }
                }}
              >
                <i
                  className={`bi ${isLiked ? 'bi-heart-fill text-rose-400' : 'bi-heart'}`}
                >
                </i>
                <span> {likes} </span>
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
          {
            user?.id === p.author.id ?
              <div className="flex justify-end gap-2">
                <button className="px-2 border hover:bg-red-400" onClick={deletePost}> delete </button>
                <button className="px-2 border hover:bg-yellow-400" onClick={editPost}> edit </button>
              </div> :
              <div className="flex justify-end ">
                <button className="px-2 border hover:bg-blue-400" onClick={
                  () => nav(`/posts/${p.id}`)
                }> source </button>
              </div>
          }
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
    </div >
  )
}
