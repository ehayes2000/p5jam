import { useEffect, useState } from 'react'
import { type Post } from ''
import { getProfilePosts } from '../client'

function Profile() {
  const [myPosts, setMyPosts] = useState<Post[]>([])
  useEffect(() => {
    getProfilePosts().then((posts) => setMyPosts(posts))
  }, [])
  return (
    <div>
      {myPosts.map((v: Post) => (
        <div> {v.description} </div>
      ))}
    </div>
  )
}

export default Profile
