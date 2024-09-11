import { useEffect, useState } from "react";
import { getPosts } from "../client";
import formatNumber from "../junkDrawer/formatNumber";
import { type Post } from "../types";

function Explore() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts()
      .then((posts) => setPosts(posts))
      .then(() => console.log("SET", posts));
  }, []);
  return (
    <div className="d-flex flex-column flex-grow-1">
      {posts.length === 0 ? (
        <div> loading ... </div>
      ) : (
        posts.map((p) => (
          <div key={`${p.postId}`} className="post border-bottom px-5 py-3">
            <h4 className="post-author px-1"> {p.author.displayName} </h4>
            <p className="post-description px-1"> {p.description} </p>
            <p className="post-script p-1 rounded"> {p.script} </p>
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
        ))
      )}
    </div>
  );
}

export default Explore;
