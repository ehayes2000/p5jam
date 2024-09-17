import { type Post } from '../types'

export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="360" // TODO
      height="360"
      scrolling="no" // TODO
      className="rounded-sm"
      src={`${import.meta.env.VITE_API_BASE}/post/script/${id}`}
    ></iframe>
  )
}

export default function Post({ post: p }: { post: Post }) {
  return (
    <div
      key={p.id}
      className="border rounded-md py-4 px-12 flex-col content-center justify-center"
    >
      <h2 className="py-2"> {p.author.name} </h2>
      <Sketch id={p.id} />
      <div className="py-2"> {p.description} </div>
      <div className="flex gap-4 justify-start">
        <span>
          <i className="bi bi-heart"> </i>
          <span> {p.likeCount} </span>
        </span>
        <span className="comment-icon px-1">
          <i className="bi bi-bar-chart"></i>
          <span> {p.viewCount} </span>
        </span>
      </div>
    </div>
  )
}
