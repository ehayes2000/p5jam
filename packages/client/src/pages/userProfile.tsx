import type { TProfile } from "../types"
import PostCollection from "../components/PostCollection"

export default function UserProfile(props: { profile: TProfile }) {
  const { posts, user } = props.profile
  return (
    <div>
      <div className="h-1/5 p-12 border-b border-black">
        <h1 className="text-xl font-bold">
          {user.name}
        </h1>
      </div>
      <PostCollection posts={posts} showJam={true} />
    </div>
  );
}
