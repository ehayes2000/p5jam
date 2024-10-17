// import { useSelector } from '@xstate/store/react';
import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Logo from "../assets/logo.png"
// import { useMyID } from '../queries/queryClient';
// import { client } from '../client';
import { PopupContext } from '../state';
import { useContext } from 'react';

function Root() {
  const { setPopup } = useContext(PopupContext);
  const [isSideBar, setIsSideBar] = useState(true);
  const nav = useNavigate();
  const location = useLocation();

  // const { jam } = useSelector(store, (state) => state.context);
  // const { data: myID } = useMyID();

  // useEffect(() => {
  //   client.api.jams.activeJam.get().then(async (j) => {
  //     if (j.data) {
  //       const { data } = await client.api.jams({ id: j.data.id }).get();
  //       if (!data) {
  //         alert('expecetd active jam data :)');
  //         return;
  //       }
  //       store.send({
  //         type: 'receivedJamFromServer',
  //         payload: { jam: data },
  //       });
  //     }
  //   });
  // }, []);

  return (
    <div className="grid h-full w-full grid-flow-col grid-cols-5 overflow-hidden">
      <div
        className={`${isSideBar ? 'hidden' : ''} absolute z-50 p-4 text-xl text-black hover:text-gray-500`}
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
        <img src={Logo} className="p-2 hover:cursor-pointer" onClick={() => {
          nav("/")
        }} />
        <div className="flex h-full flex-col justify-start gap-4 pt-16   pr-4">
          <div className="flex flex-col items-end gap-2 text-4xl">
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
                setPopup('create');
                if (location.pathname !== '/') nav('/');
              }}
            >
              New Jam
            </button>
          </div>
          <div className="flex flex-col items-end text-2xl font-normal text-black">
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
        className={`${isSideBar ? 'col-span-4' : 'col-span-full'} g-amber-400 h-full w-full overflow-hidden overflow-y-auto`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Root;
