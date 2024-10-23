import { useLoaderData } from "react-router-dom";
import PostCollection from "../components/PostCollection";
import CreateSketch from "../components/CreateSketch";
import { type TPost } from "../client";

export default function ExplorePage() {
  const posts = useLoaderData() as TPost[]


  return (
    <div>
      <div className="text-center pt-6">
        <CreateSketch />
      </div>
      <PostCollection posts={posts} />
    </div>
  )


}