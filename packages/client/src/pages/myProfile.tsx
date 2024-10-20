import { useState, useEffect } from "react"
import type { TPost } from "../client"
import type { TProfile, TJamCollection } from "../types"
import PostCollection from "../components/PostCollection"
import JamCollection from "../components/JamCollection"
import { client } from "../client"


export default function MyProfile(props: { profile: TProfile }) {
  const { posts, user } = props.profile
  const [drafts, setDrafts] = useState<TPost[]>([])
  const [jams, setJams] = useState<TJamCollection>({ owner: [], participant: [] })
  const [activeTab, setActiveTab] = useState<"posts" | "drafts" | "jams">("posts")

  useEffect(() => {
    (async () => {
      const { data: myDrafts } = await client.api.users.user.draftPosts.get()
      if (myDrafts) {
        setDrafts(myDrafts)
      }
    })();

    (async () => {
      const { data: jams } = await client.api.jams.get({
        query: { userId: user.id }
      })
      if (jams) {
        setJams(jams)
      }
    })()
  }, [])



  return (
    <div>
      <div className="border-b border-black px-12">
        <div className={`h-1/5 py-12`}>
          <h1 className={`text-xl font-bold`}>
            {user.name}
          </h1>
        </div>
        <div className="grid grid-cols-3 justify-around w-1/5 border-black border-b-0 border divide-black divide-x">
          <button className={`${activeTab === "posts" ? "bg-gray-200" : ""}`}
            onClick={() => setActiveTab("posts")}
          > posts </button>
          <button className={`${activeTab === "drafts" ? "bg-gray-200" : ""} `}
            onClick={() => setActiveTab("drafts")}
          > drafts </button>
          <button className={`${activeTab === "jams" ? "bg-gray-200" : ""} `}
            onClick={() => setActiveTab("jams")}
          > jams </button>
        </div>
      </div>
      {
        activeTab === "posts" ?
          <PostCollection key="posts" posts={posts} showJam={true} /> :
          activeTab === "jams" ?
            <JamCollection key="jams" jams={jams} /> :
            <PostCollection key="drafts" posts={drafts} showJam={true} />
      }
    </div>
  );
}
