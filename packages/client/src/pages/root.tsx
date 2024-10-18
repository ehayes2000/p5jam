// import { useSelector } from '@xstate/store/react';
import { TLoginContext, LoginContext } from '../login';
import { useState, useEffect, useContext } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png"
// import { useMyID } from '../queries/queryClient';
import { client } from '../client';
import { PopupContext } from '../state';

function Root() {
  const { setPopup } = useContext(PopupContext);
  const [isSideBar, setIsSideBar] = useState(true);
  const nav = useNavigate();
  const location = useLocation();
  const { onLogin, onLogout, user } = useContext(LoginContext) as TLoginContext;

  // get logged in user info
  useEffect(() => {
    (async () => {
      const { data: myId } = await client.api.login.myid.get();
      if (!myId) {
        onLogout();
        return
      }
      const { data: user } = await client.api.users.user.get({ query: { id: myId.id } })
      if (!user) {
        onLogout()
        return
      } else {
        onLogin({ user });
      }
    })();
  }, [])

  return (
    <div className="grid h-full w-full grid-flow-col grid-cols-5 ">
      <div
        className={`${isSideBar ? 'hidden' : ''} absolute z-50  p-1 text-xl text-black hover:text-gray-500`}
      >
        <button onClick={() => setIsSideBar(true)}>
          <i className="bi bi-layout-sidebar"></i>
        </button>
      </div>
      <div
        className={`z-50 bg-white ${isSideBar ? '' : 'hidden'} fixed bottom-0 flex h-full w-full border-r border-black p-4 font-bold sm:relative sm:flex-col sm:justify-start`}
      >
        <div
          className={`content-end text-right text-xl text-black hover:text-gray-500`}
        >
          <button onClick={() => setIsSideBar(false)}>
            <i className="bi bi-x-lg text-black hover:text-gray-500"></i>
          </button>
        </div>
        {/* <link rel="icon" type="image/svg+xml" href="/logo.svg" /> */}
        <div className="flex h-full flex-col justify-start pt-16">
          <div className="flex justify-end w-full mb-4">
            <img src={Logo} width={200} className="hover:cursor-pointer" onClick={() => {
              setPopup("closed")
              nav("/")
            }} />
          </div>
          <div className="flex flex-col items-end text-2xl">
            <button
              className="hover:cursor-pointer hover:text-gray-500"
              onClick={() => {
                setPopup('join');
                if (location.pathname !== '/') nav('/');
              }}
            >
              Join Jam
            </button>
            <button
              className="hover:cursor-pointer hover:text-gray-500"
              onClick={() => {
                setPopup("closed")
                if (!user) {
                  nav("/login")
                } else {
                  setPopup('create');
                }
                if (location.pathname !== '/') nav('/');
              }}
            >
              New Jam
            </button>
          </div>
          <div className="flex flex-col items-end text-xl font-normal text-black">
            {/* <Link
              className="hover:cursor-pointer hover:text-gray-400"
              to="explore"
            >
              Explore
            </Link> */}
            <Link
              className="hover:cursor-pointer hover:text-gray-500"
              to="jam/myJams"
            >
              My Jams
            </Link>
            <Link
              className="hover:cursor-pointer hover:text-gray-500"
              to="profile"
            >
              Profile
            </Link>
            <Link
              className="hover:cursor-pointer hover:text-gray-500"
              to="users"
            >
              Users
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${isSideBar ? 'col-span-4' : 'col-span-full'} g-amber-400 h-full w-full  overflow-y-auto`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
