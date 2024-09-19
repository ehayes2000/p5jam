import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { client, TPost, getMyId } from '../client'

export default function Comments({
  comments,
  postComment,
}: {
  comments: TPost['comments']
  postComment: (t: { text: string }) => Promise<boolean>
}) {
  const [myComment, setMyComment] = useState<string>('')
  const [myId, setMyId] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      setMyId(await getMyId())
    })()
  }, [])
  return (
    <div>
      {myId ? (
        <div className="">
          <textarea
            onChange={(e) => setMyComment(e.target.value)}
            rows={3}
            value={myComment}
            className="w-full border resize-none p-1"
          />
          <button
            className="relative border left hover:bg-gray-200 px-1"
            onClick={() => postComment({ text: myComment })}
          >
            Post
          </button>
        </div>
      ) : (
        <a href="/login"> login </a>
      )}
      {comments.map((c) => (
        <div className="flex justify-between">
          <div>{c.author.name}</div>
          <div>{c.createdAt.toString()}</div>
          <div> {c.text} </div>
          <div>
            <i className="bi bi-hand-thumbs-up" /> {c.likeCount}
          </div>
        </div>
      ))}
    </div>
  )
}
