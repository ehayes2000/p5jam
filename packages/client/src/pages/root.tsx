import { useSelector } from '@xstate/store/react'
import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMyID } from '../queries/queryClient'
import { store } from '../stateStore'
import { client } from '../client'

function Root() {
  const [isSideBar, setIsSideBar] = useState(true)
  const nav = useNavigate()
  const location = useLocation()
  const { jam } = useSelector(store, (state) => state.context)
  const { data: _id } = useMyID()

  const newJam = () => {
    store.send({ type: 'userClickedCreatedJam' })
    if (location.pathname !== '/') nav('/')
  }

  const joinJam = () => {
    store.send({ type: 'userClickedJoinJam' })
    if (location.pathname !== '/') nav('/')
  }

  useEffect(() => {
    client.api.jams.activeJam.get().then(async (j) => {
      if (j.data) {
        const myJam = await client.api.jams({ id: j.data.id }).get()
        if (!myJam.data) {
          alert('expecetd active jam data :)')
          return
        }
        store.send({
          type: 'receivedJamFromServer',
          payload: { jam: myJam.data },
        })
      }
    })
  }, [])

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
            {jam ? (
              <button
                className="hover:cursor-pointer hover:text-gray-500"
                onClick={() => nav(`/jam/${jam.id}`)}
              >
                Jam
              </button>
            ) : (
              <>
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
              </>
            )}
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
