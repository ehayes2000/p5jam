import { type Post } from "../types";

export function Sketch({ id }: { id: string }) {
  return (
    <iframe
      id={id}
      width="300" // TODO
      height="200"
      src={`${import.meta.env.VITE_API_BASE}/post/script/${id}`}
    ></iframe>
  );
}

export default function Post({ post: p }: { post: Post }) {
  return (
    <div key={`${p.id}`} className="post border-bottom px-5 py-3">
      <h4 className="post-author px-1"> {p.author.displayName} </h4>
      <p className="post-description px-1"> {p.description} </p>
      <Sketch id={p.id} />
      <span className="p-0 d-flex justify-content-between">
        <span className="comment-icon px-1">
          <i className="bi bi-chat"></i>
          <span> {p.commentCount} </span>
        </span>
        <span className="comment-icon px-1">
          <i className="bi bi-heart"> </i>
          <span> {p.likeCount} </span>
        </span>
        <span className="comment-icon px-1">
          <i className="bi bi-bar-chart"></i>
          <span> {p.viewCount} </span>
        </span>
      </span>
    </div>
  );
}
