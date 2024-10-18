// import { TProfile } from "../types"
// import PostCollection from "../components/PostCollection";

// export default function User() {
//   return <PostCollection posts={posts} />
// }


import { useLoaderData } from 'react-router-dom';

import type { TProfile } from "../types"
import PostCollection from "../components/PostCollection"
import { useContext } from "react"
import { LoginContext } from "../login"

export default function User() {
  const { posts, user } = useLoaderData() as TProfile;
  const { user: me } = useContext(LoginContext)

  return (
    <div>
      <div className="h-1/5 p-12 border-b border-black">
        <h1 className="text-xl font-bold">
          {user.name}
        </h1>

      </div>
      <PostCollection posts={posts} />
    </div>
  );
}
