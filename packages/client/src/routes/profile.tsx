import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Post from '../components/Post'

function Profile() {
  const navigate = useNavigate()
  // const [myPosts, setMyPosts] = useState<TPost[]>([])

  return <div> hi </div>
  // useEffect(() => {
  //   getProfilePosts().then((posts) => setMyPosts(posts))
  // }, [])

  // const deletePost = async (id: string) => {
  //   const deleted = await clientDeletePost(id)
  //   if (deleted) setMyPosts(await getProfilePosts())
  // }
  // const editPost = (post: TPost) => {
  //   return navigate(`/editPost`, {
  //     state: {
  //       post,
  //     },
  //   })
  // }
  // return (
  //   <div className="grid gap-4 justify-center p-6">
  //     {myPosts.map((p) => (
  //       <div key={p.id}>
  //         <div className="p-1 flex lex gap-1">
  //           <button
  //             onClick={() => editPost(p)}
  //             className="bg-gray-200 px-2 rounded-sm hover:bg-gray-300"
  //           >
  //             Edit
  //           </button>
  //           <button
  //             onClick={() => deletePost(p.id)}
  //             className="bg-gray-200 px-2 rounded-sm hover:bg-gray-300"
  //           >
  //             Delete
  //           </button>
  //         </div>
  //         <Post key={p.id} post={p} />
  //       </div>
  //     ))}
  //   </div>
  // )
}

export default Profile
