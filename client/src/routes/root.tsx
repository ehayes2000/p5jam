import { useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'

function Root() {
  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  }, [])

  return (
    <div className="w-full h-full sm:grid sm:grid-flow-col sm:grid-cols-5 sm:divide-x">
      <div className="fixed bottom-0 w-full p-6 flex gap-8 font-bold sm:relative sm:flex-col sm:justify-start sm:gap-4">
        <Link to="explore">Explore</Link>
        <Link to="users">Users</Link>
        <Link to="makePost">New Post</Link>
        <Link to="profile">Profile</Link>
        <Link to="login">Login</Link>
      </div>
      <div className="w-full h-full sm:col-span-4 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  )
}

export default Root
