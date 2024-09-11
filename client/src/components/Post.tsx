import { type Post } from "../types";
import formatNumber from "../junkDrawer/formatNumber";

export function Sketch({ id, source }: { id: string; source: string }) {
  return (
    <iframe
      id={id}
      width="300" // TODO
      height="200"
      src={source}
    ></iframe>
  );
}

export default function Post({ post: p }: { post: Post }) {
  return (
    <div key={`${p.id}`} className="post border-bottom px-5 py-3">
      <h4 className="post-author px-1"> {p.author.displayName} </h4>
      <p className="post-description px-1"> {p.description} </p>
      <Sketch id={p.id} source={p.script} />
      <span className="p-0 d-flex justify-content-between">
        <span className="comment-icon px-1">
          <i className="bi bi-chat"></i>
          <span> {formatNumber(p.commentCount)} </span>
        </span>
        <span className="comment-icon px-1">
          <i className="bi bi-heart"> </i>
          <span> {formatNumber(p.likeCount)} </span>
        </span>
        <span className="comment-icon px-1">
          <i className="bi bi-bar-chart"></i>
          <span> {formatNumber(p.viewCount)} </span>
        </span>
      </span>
    </div>
  );
}
