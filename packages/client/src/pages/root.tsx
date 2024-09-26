import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import useStore from '../jamContext'

function Root() {
  const [isSideBar, setIsSideBar] = useState(true)
  const nav = useNavigate()
  const location = useLocation()
  const { setPopup } = useStore()

  const newJam = () => {
    setPopup('createJam')
    if (location.pathname !== '/') nav('/')
  }

  const joinJam = () => {
    setPopup('joinJam')
    if (location.pathname !== '/') nav('/')
  }

  return (
    <div className="grid h-full w-full grid-flow-col grid-cols-5 divide-x divide-black overflow-hidden">
      <div
        className={`${isSideBar ? 'hidden' : ''} absolute p-4 text-xl text-black hover:text-gray-500`}
      >
        <button onClick={() => setIsSideBar(true)}>
          <i className="bi bi-layout-sidebar"></i>
        </button>
      </div>
      <div
        className={`${isSideBar ? '' : 'hidden'} fixed bottom-0 flex h-full w-full p-4 font-bold sm:relative sm:flex-col sm:justify-start`}
      >
        <div
          className={`content-end text-right text-xl text-black hover:text-gray-500`}
        >
          <button onClick={() => setIsSideBar(false)}>
            <i className="bi bi-x-lg text-black hover:text-gray-500"></i>
          </button>
        </div>
        <div className="flex h-full flex-col justify-center gap-4">
          <div className="flex flex-col items-end gap-2 text-4xl">
            <button
              className="hover:cursor-pointer hover:text-gray-500"
              onClick={newJam}
            >
              New Jam
            </button>
            <button
              className="hover:cursor-pointer hover:text-gray-500"
              onClick={joinJam}
            >
              Join Jam
            </button>
          </div>
          <div className="flex flex-col items-end text-2xl text-gray-500">
            <Link
              className="hover:cursor-pointer hover:text-gray-400"
              to="explore"
            >
              Explore
            </Link>
            <Link
              className="hover:cursor-pointer hover:text-gray-400"
              to="users"
            >
              Users
            </Link>
            <Link
              className="hover:cursor-pointer hover:text-gray-400"
              to="profile"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${isSideBar ? 'col-span-4' : 'col-span-full'} g-amber-400 h-full w-full overflow-y-auto`}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default Root
