import { useState, useEffect } from 'react'
import { TPost, getMyId } from '../client'

export default function Comments({
  comments,
  postComment,
  deleteComment,
}: {
  comments: TPost['comments']
  postComment: (t: { text: string }) => Promise<void>
  deleteComment: (id: { id: string }) => Promise<void>
}) {
  const [myComment, setMyComment] = useState<string>('') // who ?
  const [myId, setMyId] = useState<string | null>(null)
  useEffect(() => {
    ;(async () => {
      setMyId(await getMyId())
    })()
  }, [])

  return (
    <div className="flex flex-col gap-1">
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
            onClick={() => {
              setMyComment('')
              postComment({ text: myComment })
            }}
          >
            Post
          </button>
        </div>
      ) : (
        <a href="/login"> login </a>
      )}
      {comments.map((c) => {
        let dateString = ''
        try {
          dateString = new Date(c.createdAt).toDateString()
        } catch {}
        return (
          <div key={c.id} className="flex-col justify-between border p-1">
            <div className="flex justify-start gap-2">
              <div>{c.author.name}</div>
              <div className="text-gray-500 font-light">{dateString}</div>
            </div>
            <div className="text-wrap"> {c.text} </div>

            <div className="flex justify-between">
              <span>
                <i className="bi bi-heart" /> {c.likeCount}
              </span>
              {c.authorId === myId ? (
                <button onClick={() => deleteComment({ id: c.id })}>
                  <i className="bi bi-trash3" />
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
