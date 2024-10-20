import { Link } from 'react-router-dom'
import { type TPost } from '../client'

export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="100%" // TODO
      height="100%"
      scrolling="no" // TODO
      className="relative -z-50 h-full w-full rounded-sm"
      src={`${import.meta.env.VITE_API_BASE}/api/posts/${id}/script`}
    ></iframe>
  )
}

export default function HightlightedPost({ post: p }: { post: TPost }) {
  return (
    <>
      <Link
        className="absolute right-0 top-0 z-50 p-2 text-sm hover:text-gray-500 font-thin "
        to={`/user/${p.author.name}`}
      >
        {p.author.name}
      </Link>
      <Link
        className="absolute right-0 top-5 z-50 p-2 text-sm hover:text-gray-500 font-thin "
        to={`/posts/${p.id}`}
      >
        source
      </Link>
      <Sketch id={p.id} />
    </>
  )
}
