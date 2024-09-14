import { useEffect, useState } from "react";
import { getPosts } from "../client";
import { type Post as PostType } from "../types";
import Post from "../components/Post";

function Explore() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    getPosts().then((posts) => setPosts(posts));
  }, []);
  return (
    <div className="grid gap-4 justify-center p-6">
      {posts.length === 0 ? (
        <div> loading ... </div>
      ) : (
        posts.map((p) => <Post key={p.id} post={p} />)
      )}
    </div>
  );
}

export default Explore;
